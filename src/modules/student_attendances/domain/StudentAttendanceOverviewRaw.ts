type StudentAttendanceOverviewRaw = {
    studentId: string;
    asistencias: number;
    tardanzas: number;
}

export type StudentAttendanceOverviewRawRecord = Record<StudentAttendanceOverviewRaw['studentId'], Omit<StudentAttendanceOverviewRaw, 'studentId'>>;
export default StudentAttendanceOverviewRaw