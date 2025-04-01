export type ScheduleScheme = {
    id: number
    dia_de_la_semana: WeekDay
    hora_de_inicio: string
    hora_de_finalizacion: string
    escuela: string
    docente: string
    grupo: Grupo
    aula?: string | null
}

export type WeekDay = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO'

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
