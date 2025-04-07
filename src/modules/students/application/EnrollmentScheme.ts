type EnrollmentScheme = {
    id: string;
    alumno: {
        id: string;
        codigo: string;
        apellido_paterno: string;
        apellido_materno: string;
        nombres: string;
        plan_de_estudios: string;
        ciclo: string;
        correo: string;
    };
    grupo: string;
}

export default EnrollmentScheme