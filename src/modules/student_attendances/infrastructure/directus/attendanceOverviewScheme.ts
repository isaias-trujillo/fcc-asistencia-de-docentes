export type AttendanceOverviewScheme = {
    alumno: string; // student id
    estado: 'asistencia' | 'tardanza' | 'falta';
    count: string | null;
}