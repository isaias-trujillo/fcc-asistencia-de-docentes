import Day from "@/modules/chron/domain/Day.ts";

type Schedule = Readonly<{
    id: number;
    day: keyof typeof Day;
    start: string;
    end: string;
}
>
export default Schedule