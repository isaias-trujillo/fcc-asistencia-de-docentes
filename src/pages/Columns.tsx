import Student from "@/modules/students/domain/Student.ts";

export const columns: Array<{
    key: keyof Student;
    label: string;
}> = [
    { key: "code", label: "Código" },
    { key: "surname", label: "Apellidos" },
    { key: "givenName", label: "Nombres" },
    {key: "email", label: "Correo"},
];