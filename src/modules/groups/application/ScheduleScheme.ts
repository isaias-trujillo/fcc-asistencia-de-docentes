import DayOfWeek from "@/modules/chron/domain/DayOfWeek.ts";

export type ScheduleScheme = {
    id: number
    dia_de_la_semana: keyof typeof DayOfWeek
    hora_de_inicio: string
    hora_de_finalizacion: string
    escuela: string
    docente: string
    grupo: Grupo
    aula?: string | null;
    rectificacion: boolean
    codigo_de_asignatura_de_referencia?: string | null;
    seccion_de_referencia?: number | null;
    aula_de_referencia?: string | null;
}

interface Grupo {
    id: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
    aula: string
    seccion: number
    asignatura: Asignatura
}

interface Asignatura {
    id: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
    codigo: string
    nombre: string
}

export class WeekDay {
}