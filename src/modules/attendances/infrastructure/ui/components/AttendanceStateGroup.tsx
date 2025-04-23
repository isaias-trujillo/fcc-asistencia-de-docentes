import {FC, memo, useCallback, useEffect, useState} from "react";
import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";
import useLiveAttendances from "@/modules/attendances/infrastructure/directus/useLiveAttendances.ts";
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";
import {SpellCheck, Type} from "lucide-react";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance.ts";
import {LetterFIcon} from "@/modules/attendances/infrastructure/ui/components/LetterFIcon.tsx";
import {cn} from "@/lib/utils.ts";
import {selectedClass} from "@/modules/attendances/infrastructure/ui/components/selectedClass.ts"; // si estás usando shadcn/utils

type AttendanceStateGroupProps = {
    studentId: string;
};

const AttendanceStateGroup: FC<AttendanceStateGroupProps> = memo(({ studentId }) => {
    const { mark, raw } = useLiveAttendances();
    const { lastActiveAttendance } = useTeacherAttendance();
    const attendance = raw[studentId] ?? undefined;
    const chron = useChron((s) => s.chron);

    const [selected, setSelected] = useState<AttendanceScheme["estado"] | "">("");

    useEffect(() => {
        setSelected(attendance ?? "");
    }, [attendance]);

    const handleClick = useCallback(
        async (value: AttendanceScheme["estado"]) => {
            setSelected(value);
            const date = new Date(chron().original).toISOString().split("T")[0];
            const time = `${("0" + chron().time.hours).slice(-2)}:${("0" + chron().time.minutes).toString().slice(-2)}`;

            await mark({
                state: value,
                studentId,
                date,
                time,
                teacherAttendanceId: lastActiveAttendance()?.id,
            });
        },
        [chron, mark, studentId, lastActiveAttendance]
    );

    const baseClass =
        "p-2 rounded-xl border transition-all duration-200 ease-in-out flex items-center justify-center";


    return (
        <div className="flex gap-2">
            <button
                className={cn(baseClass, selected === "asistencia" && selectedClass.asistencia)}
                onClick={() => handleClick("asistencia")}
                aria-label="Marcar como presente"
            >
                <SpellCheck className="size-[clamp(1rem,1rem+2dvw,1.5rem)]" />
            </button>
            <button
                className={cn(baseClass, selected === "tardanza" && selectedClass.tardanza)}
                onClick={() => handleClick("tardanza")}
                aria-label="Marcar como tardanza"
            >
                <Type className="size-[clamp(1rem,1rem+2dvw,1.5rem)]" />
            </button>
            <button
                className={cn(baseClass, (selected === "falta" || selected.trim().length === 0) && selectedClass.falta)}
                onClick={() => handleClick("falta")}
                aria-label="Marcar como ausente"
            >
                <LetterFIcon
                    className={`size-[clamp(1rem,1rem+2dvw,1.5rem)] ${(selected === "falta" || selected.trim().length === 0) && 'fill-rose-800'}`}
                />
            </button>
        </div>
    );
});

AttendanceStateGroup.displayName = "AttendanceStateGroup";

export default AttendanceStateGroup;
