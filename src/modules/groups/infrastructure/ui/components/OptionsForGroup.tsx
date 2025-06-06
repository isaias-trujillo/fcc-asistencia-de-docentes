import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { NavLink, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { ChartBar, ListChecks } from "lucide-react";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance";
import NotCheckInDialog from "@/modules/groups/infrastructure/ui/components/NotCheckInDialog.tsx";

const OptionsForGroup = ({ groupId }: { groupId: string }) => {
  const { attendances } = useTeacherAttendance();
  const isEmpty = Object.keys(attendances ?? {}).length === 0;
  const isAllChecked = Object.values(attendances ?? {}).every(
    (a) => !!a.hora_de_entrada && !!a.hora_de_salida,
  );
  const [params] = useSearchParams();
  const aula = params.get("aula");

  return (
    <Card className="flex flex-row flex-wrap justify-center items-center max-lg:justify-start grow">
      <CardHeader>
        <CardTitle className={"text-[clamp(1rem,1rem+1vw,1.5rem)] font-normal"}>
          ¿Qué necesitas?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="gap-4 flex sm:flex-row flex-col flex-wrap ">
          <li key={"pasar-lista"}>
            {!isEmpty && !isAllChecked && (
              <NavLink to={`/cursos/${groupId}/pasar-lista?aula=${aula}`}>
                <Button className="flex justify-start gap-2 p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)]">
                  <ListChecks className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]'/>
                  Pasar lista
                </Button>
              </NavLink>
            )}
            <NotCheckInDialog isAllChecked={isAllChecked} isEmpty={isEmpty} />
          </li>
          <li key={"reporte-de-asistencia"}>
            <NavLink
              to={`/cursos/${groupId}/reporte-de-asistencia?aula=${aula}`}
            >
              <Button className="flex justify-start gap-2 p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)]">
                <ChartBar className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]'/>
                Ver el reporte de asistencia
              </Button>
            </NavLink>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default OptionsForGroup;
