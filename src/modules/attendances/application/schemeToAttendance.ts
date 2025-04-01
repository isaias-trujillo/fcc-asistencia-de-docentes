import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";
import Attendance from "@/modules/attendances/domain/Attendance.ts";

const schemeToAttendance = (
  raw: Record<
    PropertyKey,
    Pick<AttendanceScheme, "estado"> & {
      alumno: AttendanceScheme["alumno"]["id"];
    }
  >,
): Attendance[] => {
  return Object.entries(raw).map(([key, scheme]) => ({
    id: key,
    studentId: scheme.alumno,
    state: scheme.estado,
  }));
};

export default schemeToAttendance;
