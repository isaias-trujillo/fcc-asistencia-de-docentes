import Group from "@/modules/groups/domain/Group.ts";
import { WeekDay } from "@/modules/groups/application/ScheduleScheme.ts";

const chars = [
  {
    toReplace: "á",
    replacement: "a",
  },
  {
    toReplace: "é",
    replacement: "e",
  },
  {
    toReplace: "í",
    replacement: "i",
  },
  {
    toReplace: "ó",
    replacement: "o",
  },
  {
    toReplace: "ú",
    replacement: "u",
  },
];

const getScheduleBasedOnDay = (payload: { group: Group; day: string }) => {
  const { group, day } = payload;
  const fixedDay = day
    .toLowerCase()
    .split("")
    .map((char) =>
      chars.reduce((acc, curr) => {
        return acc.replace(curr.toReplace, curr.replacement);
      }, char),
    )
    .join("")
    .toUpperCase() as WeekDay;

  const schedule = group.schedules.find(
    (schedule) => schedule.day === fixedDay,
  );
  if (
    !schedule ||
    !schedule.start ||
    !schedule.end ||
    schedule.start === schedule.end ||
    schedule.start === "00:00:00" ||
    schedule.end === "00:00:00"
  ) {
    return undefined;
  }
  return schedule;
};

export default getScheduleBasedOnDay;
