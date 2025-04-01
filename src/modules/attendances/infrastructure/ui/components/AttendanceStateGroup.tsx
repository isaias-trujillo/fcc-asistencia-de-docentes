import {FC} from "react";
import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";
import useLiveAttendances from "@/modules/attendances/infrastructure/directus/useLiveAttendances.ts";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";
import {SpellCheck, Type} from "lucide-react";

import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance.ts";
import {LetterFIcon} from "@/modules/attendances/infrastructure/ui/components/LetterFIcon.tsx";

type AttendanceStateGroupProps = {
    studentId: string;
};

const AttendanceStateGroup: FC<AttendanceStateGroupProps> = ({
                                                                 studentId,
                                                             }) => {
    const {mark, raw} = useLiveAttendances();
    const {lastActiveAttendance} = useTeacherAttendance();

    const attendance = raw[studentId] ?? undefined;
    const chron = useChron((s) => s.chron);

    return (
        <ToggleGroup
            type="single"
            size="lg"
            onValueChange={async (value: AttendanceScheme["estado"] | "") => {
                const date = new Date(chron().original).toISOString().split("T")[0];

                const time = `${("0" + chron().time.hours).slice(-2)}:${("0" + chron().time.minutes).toString().slice(-2)}`;

                await mark({
                    state: value === "" ? "falta" : value,
                    studentId,
                    date,
                    time,
                    teacherAttendanceId: lastActiveAttendance()?.id,
                });
            }}
        >
            <ToggleGroupItem
                value="asistencia"
                aria-label="Marcar como presente"
                style={{
                    backgroundColor:
                        attendance && attendance === "asistencia"
                            ? "var(--color-green-100)"
                            : "",
                    color:
                        attendance && attendance === "asistencia"
                            ? "var(--color-green-800)"
                            : "",
                }}
            >
                <SpellCheck className="size-[clamp(1rem,1rem+2dvw,1.5rem]"/>
            </ToggleGroupItem>
            <ToggleGroupItem
                value="tardanza"
                aria-label="Marcar como tardanza"
                style={{
                    backgroundColor:
                        attendance && attendance === "tardanza"
                            ? "var(--color-yellow-100)"
                            : "",
                    color:
                        attendance && attendance === "tardanza"
                            ? "var(--color-yellow-800)"
                            : "",
                }}
            >
                <Type className="size-[clamp(1rem,1rem+2dvw,1.5rem]"/>
            </ToggleGroupItem>
            <ToggleGroupItem
                value="falta"
                aria-label="Marcar como ausente"
                style={{
                    backgroundColor:
                        !attendance || attendance === "falta"
                            ? "var(--color-red-100)"
                            : "",
                }}
            >
                <LetterFIcon
                    fill={
                        !attendance || attendance === "falta"
                            ? "var(--color-red-800)"
                            : "var(--foreground)"
                    }
                />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};

export default AttendanceStateGroup;
