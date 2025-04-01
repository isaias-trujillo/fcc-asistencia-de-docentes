// TYPES
import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";
import Student from "@/modules/students/domain/Student.ts";

export type LiveAttendanceStore = {
    search: (payload: { teacherAttendanceId?: string }) => Promise<void>;
    raw: Record<
        AttendanceScheme["alumno"]["id"],
        AttendanceScheme['estado']>;
    mark: (payload: {
        studentId: string;
        state: AttendanceScheme["estado"];
        date: string;
        time: string;
        teacherAttendanceId?: string;
    }) => Promise<void>;
    isMarkingAll: boolean;
    markAll: (payload: {
        studentIDs: AttendanceScheme["alumno"]["id"][];
        date: string;
        time: string;
        state: AttendanceScheme["estado"];
        teacherAttendanceId?: string;
    }) => Promise<void>;
    overview: (students: Student[]) => {
        asistencias: number;
        tardanzas: number;
        faltas: number;
    };
    disconnect: () => void;
    connected: boolean;
    connect: () => Promise<void>;
};