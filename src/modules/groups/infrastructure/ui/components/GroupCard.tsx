import Group from "@/modules/groups/domain/Group.ts";
import { NavLink } from "react-router";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import fixCourseName from "@/modules/groups/infrastructure/fixCourseName.ts";

type Props = {
  group: Group;
  showIcon?: boolean;
};

const GroupCard: FC<Props> = ({ group }) => {
  return (
    <NavLink to={`/cursos/${group.id}?aula=${group.classroom}`} key={group.id}>
      <Card className="h-full bg-background hover:bg-accent transition-all duration-300 ease-in gap-4">
        <CardHeader className="gap-4 text-[clamp(0.75rem,0.75rem+1dvh,1.25rem)] flex max-lg:flex-row max-lg:items-center max-lg:justify-center max-lg:flex-wrap">
          {group.classroom && group.classroom !== 'N/A' && (
            <CardTitle>
              <Badge
                className={
                  "bg-yellow-400 text-black text-[clamp(0.75rem,0.75rem+1dvh,1.5rem)] p-[clamp(0.25rem,0.25rem+1dvh,1.5rem)]"
                }
              >
                Aula: {group.classroom}
              </Badge>
            </CardTitle>
          )}
          <span className="max-lg:text-center">
            {group.course.name.split(" ").map(fixCourseName).join(" ")}
          </span>
          <span>Sección: {group.section}</span>
        </CardHeader>
        <CardContent className="text-[clamp(1rem,0.75rem+1vw,1.75rem)] h-full"></CardContent>
        <CardFooter className="flex flex-col w-full items-start flex-wrap gap-[clamp(1rem,1rem+2dvw,2.5rem)] text-[clamp(0.75rem,0.75rem+1dvh,1.25rem)]">
          <div
            className={
              "flex w-full gap-4 bg-accent py-2 px-4 rounded-md flex-row flex-wrap justify-between"
            }
          >
            {group.schedules.map((s) => (
              <div
                key={s.id}
                className={
                  "flex flex-row md:flex-col justify-between items-start gap-x-4 max-md:w-full"
                }
              >
                <span className={"font-semibold"}>
                  {s.day.slice(0, 1) +
                    s.day.slice(1, s.day.length).toLocaleLowerCase()}
                </span>
                <span className="text-accent-foreground">
                  {s.start} - {s.end}
                </span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
    </NavLink>
  );
};

export default GroupCard;
