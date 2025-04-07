import {Filters} from "@/modules/student_attendances/infrastructure/directus/filters.ts";
import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type Store = {
    search: (payload: { groupId: string, teacherId: string }, filters: Filters) => Promise<void>;
    raw: Record<PropertyKey, number>;
    attendances: () => number;
}

const useClassesCounter = create(persist<Store>((setState, getState) => {
    const search: Store['search'] = async ({groupId, teacherId}) => {
        const client = createDirectus(import.meta.env.VITE_DIRECTUS_WS_URL as string)
            .with(realtime({
                authMode: 'handshake',
            }))
        await client.connect();
        client.sendMessage({
            type: "subscribe",
            collection: "asistencias_de_docentes",
            query: {
                filter: {
                    "grupo": {
                        "id": {
                            "_eq": groupId
                        }
                    },
                    "docente": {
                        "id": {
                            "_eq": teacherId
                        }
                    },
                    "estado": {
                        "_in": ["asistencia", "tardanza"]
                    }
                },
                fields: ['id', 'fecha'],
                groupBy: ['grupo', 'day(fecha)'],
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
                            if (!(item.grupo in acc)) {
                                acc[item.grupo] = 0;
                            } else {
                                acc[item.grupo] += 1;
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
        attendances: () => Object.keys((getState()?.raw ?? {})).length,
        raw: {},
    }
}, {
    name: "classes-counter",
}))

export default useClassesCounter