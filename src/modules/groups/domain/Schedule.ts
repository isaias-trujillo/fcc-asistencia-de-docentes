import DayOfWeek from "@/modules/chron/domain/DayOfWeek.ts";

type Schedule = Readonly<{
    id: number;
    day: keyof typeof DayOfWeek;
    start: string;
    end: string;
}
>
export default Schedule