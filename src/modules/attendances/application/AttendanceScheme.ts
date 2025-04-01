import EnrollmentScheme from "@/modules/students/application/EnrollmentScheme.ts";

type AttendanceScheme = {
    id: string;
    alumno: EnrollmentScheme['alumno'];
    fecha: string;
    hora: string;
    estado: 'asistencia' | 'tardanza' | 'falta';
}

export default AttendanceScheme