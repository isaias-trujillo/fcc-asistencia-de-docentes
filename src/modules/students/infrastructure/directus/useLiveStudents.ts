import {createDirectus, readItems, rest} from "@directus/sdk";
import {create} from "zustand/react";
import EnrollmentScheme from "@/modules/students/application/EnrollmentScheme.ts";
import Student from "@/modules/students/domain/Student.ts";
import schemeToStudent from "@/modules/students/application/schemeToStudent.ts";
import Group from "@/modules/groups/domain/Group.ts";
import {ScheduleScheme} from "@/modules/groups/application/ScheduleScheme.ts";

type Store = {
    search: ({group}: { group: Group }) => Promise<void>;
    raw: Record<PropertyKey, EnrollmentScheme>;
    data: () => Student[];
    disconnect: () => void;
    connected: boolean;
    connect: () => Promise<void>;
};

const useLiveStudents = create<Store>((setState, getState) => {
    const client = createDirectus(
        import.meta.env.VITE_DIRECTUS_API_URL as string,
    ).with(rest({credentials: "include"}))
    const search: Store['search'] = async ({group}) => {
        setState({raw: {}});
        const childrenGroups = await client.request(readItems('horarios', {
            filter: {
                'codigo_de_asignatura_de_referencia': {
                    _eq: group.course.code
                },
                'seccion_de_referencia': {
                    _eq: group.section
                }
            },
            limit: -1
        })).catch(() => []) as {grupo: ScheduleScheme['grupo']['id']}[];
        const ORFilters = childrenGroups.map((schedule) => ({
            grupo: {
                id: {
                    _eq: schedule.grupo
                }
            }
        }));

        const enrollments = await client.request(readItems('matriculas', {
            filter: {
                _or: [
                    {
                        _or: ORFilters
                    },
                    {
                        grupo: {
                            id: {
                                _eq: group.id
                            }
                        }
                    }
                ],

            },
            fields: ['*', 'alumno.*'],
            sort: ['alumno.apellido_paterno', 'alumno.apellido_materno', 'alumno.nombres'],
            limit: -1
        })).catch(() => []) as EnrollmentScheme[];

        setState({
            raw: Object.fromEntries(
                enrollments.map((scheme) => [scheme.id, scheme]),
            ),
        });
    };
    return {
        search,
        raw: {},
        data: () => schemeToStudent(getState().raw),
        disconnect: () => {
            if (!getState().connected) return;
            setState(prev => ({...prev, connected: false, raw: {}}));
        },
        connected: false,
        connect: async () => {
            if (getState().connected) {
                return;
            }
        },
    };
});

export default useLiveStudents;
