import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";

type Attendance = {
    id: string;
    studentId: string;
    state: AttendanceScheme['estado'];
}

export default Attendance;