import {z} from "zod";

const authScheme = z.object({
    documentNumber: z.string().min(8, {
        message: "Al menos 8 caracteres.",
    }).max(15, {
        message: "No más de 15 caracteres.",
    }).regex(/[a-zA-Z0-9]+/, {
        message: "Solo letras y números.",
    }),
})

export type AuthScheme = z.infer<typeof authScheme>;

export default authScheme