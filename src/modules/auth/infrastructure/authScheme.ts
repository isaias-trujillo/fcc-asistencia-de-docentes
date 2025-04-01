import {z} from "zod"

const authScheme = z.object({
    documentNumber: z.string().min(8, {
        message: "Debe tener al menos 8 caracteres."
    }).max(18, {
        message: "Debe tener como máximo 18 caracteres."
    }).regex(/^[a-zA-Z0-9]+$/, {
        message: "Debe ser alfanumérico."
    }),
})

export type AuthScheme = z.infer<typeof authScheme>

export default authScheme