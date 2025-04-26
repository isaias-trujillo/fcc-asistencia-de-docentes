import Schedule from "./Schedule.ts";

type Group = {
    id: string;
    course: {
        id: string;
        name: string;
        code: string;
    };
    section: number;
    classroom?: string | null;
    teacherId: string;
    schedules: Array<Schedule>;
    program?: Partial<{
        abbreviation: string;
        name: string;
    }
    >
}

export default Group