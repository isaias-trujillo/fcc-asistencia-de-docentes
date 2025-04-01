import useAttendancesOverviewReport from "@/modules/student_attendances/infrastructure/directus/useAttendancesOverviewReport.ts";
import { useEffect } from "react";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";
import useProfile from "@/modules/teachers/infrastructure/directus/useProfile.ts";
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
import { columns } from "@/modules/student_attendances/infrastructure/ui/Columns.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Download } from "lucide-react";
import useClassesCounter from "@/modules/classes_counter/infrastructure/directus/useClassesCounter.ts";
import exportToExcel from "@/modules/shared/infrastructure/exportToExcel";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups";

const StudentReportTable = ({ groupId }: { groupId: string }) => {
  const store = useAttendancesOverviewReport();
  const { date } = useChron();
  const { id: teacherId } = useProfile();
  const { data} = useLiveStudents();
  const overview = store.data();
  const { attendances } = useClassesCounter();
  const hasStudents = data().length > 0;
  const { data: groups } = useLiveGroups();

  const group = groups().find((g) => g.id === groupId);

  const parsedData = data().map((student) => {
    return {
      ...student,
      asistencias: overview[student.id]?.asistencias ?? 0,
      tardanzas: overview[student.id]?.tardanzas ?? 0,
      faltas: Math.max(
        0,
        attendances() -
          (overview[student.id]?.asistencias ?? 0) -
          (overview[student.id]?.tardanzas ?? 0),
      ),
      total: attendances() || 1,
    };
  });

  useEffect(() => {
    store.search(
      {
        period: "all",
      },
      date,
      teacherId ?? "",
      groupId,
    );
  }, [groupId]);

  if (!hasStudents) {
    return (
      <p className="w-full text-center">
        No hay alumnos asignados a este curso.
      </p>
    );
  }

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
            {parsedData.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.code}</TableCell>
                <TableCell>{r.surname}</TableCell>
                <TableCell>{r.givenName}</TableCell>
                <TableCell>{r.asistencias}</TableCell>
                <TableCell>{r.tardanzas}</TableCell>
                <TableCell>{r.faltas}</TableCell>
                <TableCell>
                  {((r.faltas / r.total) * 100).toFixed(0).padStart(2, "0")} %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentReportTable;
