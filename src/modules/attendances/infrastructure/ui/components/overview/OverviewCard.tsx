import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents.ts";
import useLiveAttendances from "@/modules/attendances/infrastructure/directus/useLiveAttendances.ts";
// import OverviewLegend from "@/modules/attendances/infrastructure/ui/components/overview/OverviewLegend.tsx";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";

const OverviewCard = () => {
  const { data: students } = useLiveStudents();
  const { date } = useChron();

  const { overview} = useLiveAttendances();
  const data = overview(students());
  return (
    <Card className="flex justify-between flex-row xl:flex-col items-center grow">
      <CardHeader className="grow flex flex-wrap flex-row items-center justify-around">
        <CardTitle className={"text-[clamp(1rem,1rem+1vw,1.5rem)]"}>
          ¿Cuántos han asistido a esta clase?
        </CardTitle>
        <CardDescription
          className={
            "text-[clamp(0.75rem,0.75rem+1vw,1rem)] max-xl:text-start max-xl:grow"
          }
        >
          {date.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-0 p-0">
        <p className="text-center flex flex-row items-center justify-center gap-2 text-2xl">
          {data.asistencias + data.tardanzas}
          <span>/</span>
          {students().length}
        </p>
      </CardContent>
      <CardFooter>{/* <OverviewLegend overview={data} /> */}</CardFooter>
    </Card>
  );
};

export default OverviewCard;
