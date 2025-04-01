type TeacherAttendanceScheme = {
    id: string;
    docente: string;
    grupo: string;
    fecha: string;
    hora_de_entrada: string;
    hora_de_salida?: string;
    estado: string;
    hora_de_entrada_esperada?: string;
    hora_de_salida_esperada?: string;
}

export default TeacherAttendanceScheme