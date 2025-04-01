import attendanceStates from "@/modules/attendances/infrastructure/ui/attendanceStates.ts";

type Payload = {
    estado: 'asistencia' | 'tardanza' | 'falta' | 'auto';
    grupo?: string;
    docente?: string;
}

const getAttendanceUrlParams = (payload: Payload) => {
    const p = {...payload, estado: attendanceStates[payload.estado]};
    return Object.entries(p).reduce((acc, [key, value]) => {
        acc.push(`${key}=${value}`);
        return acc;
    }, [] as string[]).join('&');
}

export default getAttendanceUrlParams