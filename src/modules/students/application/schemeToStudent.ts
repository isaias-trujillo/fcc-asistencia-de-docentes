import EnrollmentScheme from "@/modules/students/application/EnrollmentScheme.ts";
import Student from "@/modules/students/domain/Student.ts";

const schemeToStudent = (raw: Record<PropertyKey, EnrollmentScheme>): Student[] => {
    return Object.values(raw).map(scheme => ({
        id: scheme.alumno.id,
        code: scheme.alumno.codigo,
        surname: `${scheme.alumno.apellido_paterno} ${scheme.alumno.apellido_materno}`.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' '),
        givenName: scheme.alumno.nombres.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' '),
    }))
}

export default schemeToStudent