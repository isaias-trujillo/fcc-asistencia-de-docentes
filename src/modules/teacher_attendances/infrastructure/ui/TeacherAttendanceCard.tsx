import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Clock, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance.ts";
import useProfile from "@/modules/teachers/infrastructure/directus/useProfile.ts";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups.ts";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";
import { toast } from "sonner";
import CheckInAlertDialog from "@/modules/attendances/infrastructure/ui/components/check-in-out/CheckInAlertDialog";
import CheckOutAlertDialog from "@/modules/attendances/infrastructure/ui/components/check-in-out/CheckOutAlertDialog";
import { useSearchParams } from "react-router";
import LoadingBlock from "@/modules/shared/infrastructure/ui/components/LoadingBlock";

const TeacherAttendanceCard = ({ groupId }: { groupId: string }) => {
  const { attendances, mark, search } = useTeacherAttendance();
  const { id: teacherId } = useProfile();
  const { data: groups } = useLiveGroups();
  const group = groups().find((g) => g.id === groupId);
  const { chron, date } = useChron();
  const isEmpty = Object.keys(attendances ?? {}).length === 0;
  const isAllChecked = Object.values(attendances ?? {}).every(
    (a) => !!a.hora_de_entrada && !!a.hora_de_salida,
  );

  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const aula = params.get("aula");

  const onClick = () => {
    if (!teacherId || !group) {
      toast.error(
        "No se pudo registrar su asistencia, intenta recargar la pagina.",
      );
      return;
    }
    const { hours, minutes, seconds } = chron().time;
    toast.promise(
      mark({
        teacherId,
        group,
        time: `${hours}:${minutes}:${seconds}`,
        date,
        aula,
      }),
      {
        loading: "Registrando...",
        success: "¡Su asistencia ha sido registrada!",
        error: "No se pudo registrar su asistencia.",
      },
    );
  };
  useEffect(() => {
    if (teacherId && group) {
      setLoading(() => true);
      // reducet five hours to the date
      const newDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
      search({ teacherId, group, date: newDate })
        .catch(() => toast.error("No encontraron sus asistencias para hoy."))
        .finally(() => setLoading(() => false));
    }
    // eslint-disable-next-line
  }, [groupId]);

  if (loading) {
    return (
      <Card
        className={
          "flex flex-row max-lg:flex-wrap items-center justify-center grow"
        }
      >
        <CardHeader
          className={`flex flex-row flex-wrap items-center justify-between gap-2`}
        >
          <LoadingBlock />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={"flex flex-row flex-wrap justify-start grow"}>
      <CardHeader
        className={`flex flex-col flex-wrap items-start justify-start  max-md:justify-center gap-y-2 gap-x-4 max-w-fit `}
      >
        <CardTitle className={"text-[clamp(1rem,1rem+1vw,1.5rem)] font-normal"}>
          {isEmpty
            ? "¿Vas a pasar lista?, primero marca tu entrada"
            : isAllChecked
              ? "¿Tienes más horas pendientes?"
              : "No olvides marcar tu salida al terminar tu(s) clase(s)."}
        </CardTitle>
        <CardDescription>
          {isEmpty && (
            <Button className={"max-sm:grow p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,1rem+1dvw,1.25rem)]"} onClick={onClick}>
              <SendIcon className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]'/> Marcar mi entrada
            </Button>
          )}
          {!isEmpty && isAllChecked && (
            <CheckInAlertDialog onSubmit={onClick} />
          )}
          {!isAllChecked && <CheckOutAlertDialog onSubmit={onClick} />}
        </CardDescription>
      </CardHeader>
      {!!Object.keys(attendances).length && (
        <CardContent className="max-md:grow gap-[clamp(1rem,1.25rem+2vh,2rem)] max-w-fit flex flex-row flex-wrap">
          {Object.values(attendances).map((a, index) => (
            <div
              key={a.id}
              className={
                "max-sm:grow bg-accent text-black rounded-md py-[clamp(0.5rem,0.5rem+1vh,1rem)] px-[clamp(1rem,1rem+1vh,2rem)] flex flex-col justify-start gap-[clamp(0.5rem,0.5rem+2dvh,1rem)]"
              }
            >
              <div className={"flex flex-row gap-2 items-center flex-wrap"}>
                <Clock className="text-foreground" />
                <span className={"text-foreground"}>Clase N° {index + 1}</span>
              </div>
              {a.hora_de_entrada && (
                <div className="flex flex-row gap-[clamp(0.5rem,0.5rem+2dvh,1rem)] items-center">
                  <span className="grow text-accent-foreground">
                    Hora de entrada:
                  </span>
                  <Badge
                    className={
                      "bg-yellow-400 text-black text-[clamp(0.75rem,1rem+1vh,1rem)]"
                    }
                  >
                    {a.hora_de_entrada}
                  </Badge>
                </div>
              )}
              {a.hora_de_salida && (
                <div className="flex flex-row gap-[clamp(0.5rem,0.5rem+2dvh,1rem)] items-center">
                  <span className="grow text-accent-foreground">
                    Hora de Salida:
                  </span>
                  <Badge
                    className={
                      "bg-card text-foreground text-[clamp(0.75rem,1rem+1vh,1rem)]"
                    }
                  >
                    {a.hora_de_salida}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default TeacherAttendanceCard;
