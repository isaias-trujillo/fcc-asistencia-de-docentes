import { QRCode } from "react-qrcode-logo";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance.ts";
import useStudentsAttendanceState from "@/modules/qr/infrastructure/useStudentsAttendanceState.ts";
import attendanceStates from "@/modules/attendances/infrastructure/ui/attendanceStates.ts";

const SmallQRCode = () => {
  const { lastActiveAttendance } = useTeacherAttendance();
  const { state } = useStudentsAttendanceState();
  const maskedState = attendanceStates[state];

  if (!lastActiveAttendance) {
    return (
      <span className="text-center text-red-500 bg-red-100 p-2 rounded-md">
        No se pudo generar el QR.
      </span>
    );
  }
  return (
    <div className={"size-[clamp(12.5rem,10rem+2.5dvw,20rem)]"}>
      <QRCode
        value={`${import.meta.env.VITE_ASISTENCIA_DE_ALUMNOS_URL}?token=${lastActiveAttendance()?.id}-${maskedState}`}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: "1/1",
        }}
        size={1024}
        quietZone={0}
      ></QRCode>
    </div>
  );
};

export default SmallQRCode;
