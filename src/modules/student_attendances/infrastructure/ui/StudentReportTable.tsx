import useAttendancesOverviewReport from "@/modules/student_attendances/infrastructure/directus/useAttendancesOverviewReport.ts";
import { useEffect } from "react";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { columns } from "@/modules/student_attendances/infrastructure/ui/columns.ts";
import { Button } from "@/components/ui/button.tsx";
import { Download } from "lucide-react";
import useClassesCounter from "@/modules/classes_counter/infrastructure/directus/useClassesCounter.ts";
import exportToExcel from "@/modules/shared/infrastructure/exportToExcel";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups";

const StudentReportTable = ({ groupId }: { groupId: string }) => {
  const {search, data: overview} = useAttendancesOverviewReport();
  const { date } = useChron();
  const { data} = useLiveStudents();
  const { attendances } = useClassesCounter();
  const hasStudents = data().length > 0;
  const { data: groups } = useLiveGroups();

  const group = groups().find((g) => g.id === groupId);

  useEffect(() => {
    if (!group) return;
    search(
      {
        today: date,
        filters: {
          period: "all",
          group,
        }
      }
    );
  }, [!!group]);

  if (!hasStudents) {
    return (
      <p className="w-full text-center">
        No hay alumnos asignados a este curso.
      </p>
    );
  }

  const parsedData = data().map((student) => {
    return {
      ...student,
      asistencias: overview()[student.id]?.asistencias ?? 0,
      tardanzas: overview()[student.id]?.tardanzas ?? 0,
      faltas: Math.max(
        0,
        attendances() -
          (overview()[student.id]?.asistencias ?? 0) -
          (overview()[student.id]?.tardanzas ?? 0),
      ),
      total: attendances() || 1,
    };
  });

  const downloadAsExcel = () => {
    exportToExcel({
      fileName: !group
        ? "curso desconocido"
        : `${group.classroom ?? ""} ${group.course.name}`,
      sheets: {
        resumen: {
          data: parsedData.map((p) => ({
            codigo: p.code,
            apellidos: p.surname,
            nombres: p.givenName,
            correo: p.email,
            estado: p.groupId !== groupId ? 'rectificado' : '',
            asistencias: p.asistencias,
            tardanzas: p.tardanzas,
            faltas: p.faltas,
            "porcentaje de inasistencia": ((p.faltas / p.total) * 100)
              .toFixed(0)
              .padStart(2, "0"),
          })),
        },
      },
    });
  };

  return (
    <Card className="grow">
      <CardHeader className="flex flex-row justify-between items-center flex-wrap">
        <CardTitle className="text-xl flex justify-center max-sm:w-full">
          Resumen de asistencias
        </CardTitle>
        <div className="flex flex-row gap-[clamp(0.5rem,0.5rem+1vh,1rem)] grow sm:max-w-fit max-sm:w-full  justify-evenly">
          <Button className="font-semibold" onClick={downloadAsExcel}>
            <Download />
            Excel
          </Button>
          {/* <Button className="font-semibold">
            <Download />
            CSV
          </Button> */}
        </div>
      </CardHeader>
      <CardContent
        className={"grow flex flex-col items-center justify-center w-full"}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.map((r) => {
              const percentage = (r.faltas / r.total) * 100;
              return <TableRow key={r.id} className={`${r.groupId !== groupId ? 'bg-muted/60' : ''} text-wrap`}>
                <TableCell>{r.code}</TableCell>
                <TableCell>{`${r.surname} ${r.givenName}`}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.groupId !== groupId ? 'Rectificado' : ''}</TableCell>
                <TableCell>{r.asistencias}</TableCell>
                <TableCell>{r.tardanzas}</TableCell>
                <TableCell>{r.faltas}</TableCell>
                <TableCell>
                  <span className={`${percentage >= 30
                      ? 'dark:text-rose-200 dark:bg-rose-950/35 text-rose-800 bg-red-100 font-semibold'
                      : percentage >= 10
                          ? 'dark:text-orange-200 dark:bg-orange-950/35 text-orange-800 bg-orange-100 font-semibold'
                          : ''
                  } py-1 rounded-md px-[clamp(0.25rem,0.5rem+1dvw,0.75rem)]`}>
                    {percentage.toFixed(0).padStart(2, "0")} %
                  </span>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentReportTable;
