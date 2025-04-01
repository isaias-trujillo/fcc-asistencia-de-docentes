import {ScheduleScheme} from "./ScheduleScheme.ts";
import Group from "../domain/Group.ts";

const schemeToSchedule = (scheme: ScheduleScheme) => ({
    id: scheme.id,
    day: scheme.dia_de_la_semana,
    start: scheme.hora_de_inicio,
    end: scheme.hora_de_finalizacion,
    classroom: scheme.aula,
});

const schemeToGroup = (schemes: Record<PropertyKey, ScheduleScheme>): Group[] => {
    // create a hashmap:
    // key: group id
    // value: group
    // if a group has the same id, append the schedules to the group
    const groups: Record<string, Group> = {};
    Object.values(schemes).forEach((scheme) => {
        const key = scheme.aula ? `${scheme.grupo.id}-${scheme.aula}` : scheme.grupo.id;
        const group = groups[key] ?? undefined;
        if (group) {
            group.schedules.push(schemeToSchedule(scheme));
            return;
        }
        groups[key] = {
            id: scheme.grupo.id.toString(),
            course: {
                id: scheme.grupo.asignatura.id.toString(),
                name: scheme.grupo.asignatura.nombre,
                code: scheme.grupo.asignatura.codigo,
            },
            section: scheme.grupo.seccion,
            classroom: scheme.aula,
            teacherId: scheme.docente.toString(),
            schedules: [schemeToSchedule(scheme)],
        }
        return;
    });
    return Object.values(groups);
}

export default schemeToGroup