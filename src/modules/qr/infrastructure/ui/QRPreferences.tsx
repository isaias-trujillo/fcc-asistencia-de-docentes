import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import useStudentsAttendanceState from "@/modules/qr/infrastructure/useStudentsAttendanceState.ts";

const QRPreferences = () => {
  const { state, update } = useStudentsAttendanceState();

  return (
    <div className="bg-none flex flex-row flex-wrap justify-between items-center w-full p-0 m-0 border-none border-transparent outline-none shadow-none">
      <div className='p-0 m-0 border-none'>
        <span>
          Considerar como
        </span>
      </div>
      <div className='p-0 m-0 border-none'>
        <Select
          defaultValue={state}
          onValueChange={(value) => {
            update(value as "asistencia" | "tardanza" | "falta" | "auto");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="auto">Según el horario</SelectItem>
              <SelectItem value="asistencia">Asistencia</SelectItem>
              <SelectItem value="tardanza">Tardanza</SelectItem>
              <SelectItem value="falta">Falta</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QRPreferences;
