import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlarmClock, Check, X } from "lucide-react";
import MassiveMarkAlertDialog from "./MassiveMarkAlertDialog";
import useLiveAttendances from "../../../directus/useLiveAttendances";
import { toast } from "sonner";
import useChron from "@/modules/chron/infrastructure/directus/useChron";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents";
import { formatTime } from "../../../directus/formatTime";

const MassiveMarkAttendanceCard = ({
  teacherAttendanceId,
}: {
  teacherAttendanceId?: string;
}) => {
  const { markAll} = useLiveAttendances();
  const { date } = useChron();
  const { data: students } = useLiveStudents();

  const onSubmit = (state: "asistencia" | "tardanza" | "falta") => {
    const d = date.toISOString().split("T")[0];
    toast.promise(
      markAll({
        state: state,
        date: d,
        time: formatTime(`${date.getHours()}:${date.getMinutes()}`),
        studentIDs: students().map((s) => s.id),
        teacherAttendanceId,
      }),
      {
        loading: `Marcando a todos con ${state}...`,
        success: `Se ha marcado a todos con ${state}.`,
        error: {
          message: '"Error al registrar las asistencias, revisa tu conexión a internet."',
          action: {
            label: "Recargar",
            onClick: () => window.location.reload(),
          },
        }
        ,
      },
    );
  };
  return (
    <Card className="flex max-lg:flex-col flex-row flex-wrap items-center justify-between grow">
      <CardHeader>
        <CardTitle className={"text-[clamp(1rem,1rem+1vw,1.5rem)]"}>
          ¿O prefieres pasar lista a todos?
        </CardTitle>
        <CardDescription className={"text-[clamp(1rem,1rem+1dvw,1.25rem)]"}>
          Marcar a todos con 👇
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row flex-wrap gap-[clamp(1rem,1rem+1dvw,1.5rem)]">
        <MassiveMarkAlertDialog
          onSubmit={() => onSubmit("asistencia")}
          title="¿Estás seguro de marcar a todos con Asistencia?"
        >
          <Button>
            <Check />
            Asistencia
          </Button>
        </MassiveMarkAlertDialog>
        <MassiveMarkAlertDialog
          onSubmit={() => onSubmit("tardanza")}
          title="¿Estás seguro de marcar a todos con Tardanza?"
        >
          <Button>
            <AlarmClock />
            Tardanza
          </Button>
        </MassiveMarkAlertDialog>
        <MassiveMarkAlertDialog
          onSubmit={() => onSubmit("falta")}
          title="¿Estás seguro de marcar a todos con Falta?"
        >
          <Button>
            <X />
            Falta
          </Button>
        </MassiveMarkAlertDialog>
      </CardContent>
    </Card>
  );
};

export default MassiveMarkAttendanceCard;
