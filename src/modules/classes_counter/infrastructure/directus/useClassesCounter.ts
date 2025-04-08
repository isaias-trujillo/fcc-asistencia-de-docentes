import {Filters} from "@/modules/student_attendances/infrastructure/directus/filters.ts";
import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import Group from "@/modules/groups/domain/Group.ts";

type Store = {
    search: (payload: { group: Group, teacherId: string }, filters: Filters) => Promise<void>;
    raw: Record<PropertyKey, number>;
    attendances: () => number;
}

const useClassesCounter = create(persist<Store>((setState, getState) => {
    const search: Store['search'] = async ({group, teacherId}) => {
        const client = createDirectus(import.meta.env.VITE_DIRECTUS_WS_URL as string)
            .with(realtime({
                authMode: 'handshake',
            }))
        await client.connect();
        client.sendMessage({
            type: "subscribe",
            collection: "asistencias_de_alumnos",
            query: {
                filter: {
                    sesion: {
                        grupo: {
                            asignatura: {
                                codigo: {
                                    _eq: group.course.code
                                }
                            }
                        },
                    },
                    "estado": {
                        "_in": ["asistencia", "tardanza"]
                    }
                },
                fields: ['*', 'sesion.*'],
            },
        })

        client.onWebSocket('message', (callback) => {
            if (callback.type !== 'subscription') {
                return;
            }
            const data = (callback?.data ?? []) as { grupo: string; fecha_day: number }[]; // TODO: remove id
            if (!data.length) {
                setState(prev => ({...prev, raw: {}}))
                return;
            }
            if (callback.event === 'init') {
                setState(prev => {
                    return {
                        ...prev,
                        raw: data.reduce((acc, item) => {
                            const key = `${item.grupo}_${item.fecha_day}`;
                            if (!(key in acc)) {
                                acc[key] = 1;
                            } else {
                                acc[key] += 1;
                            }
                            return acc;
                        }, {} as Record<PropertyKey, number>)
                    }
                })
                return;
            }
        })
    }
    return {
        search,
        attendances: () => Object.values((getState()?.raw ?? {})).reduce((acc, v) => acc + v, 0),
        raw: {},
    }
}, {
    name: "classes-counter",
}))

export default useClassesCounter