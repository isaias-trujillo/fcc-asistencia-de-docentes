import {Filters} from "@/modules/student_attendances/infrastructure/directus/filters.ts";
import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type Store = {
    search: (payload: { groupId: string, teacherId: string }, filters: Filters) => Promise<void>;
    raw: Record<PropertyKey, string>;
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
            },
        })

        client.onWebSocket('message', (callback) => {
            if (callback.type !== 'subscription') {
                return;
            }
            const data = (callback?.data ?? []) as { id: string | number; fecha: string }[]; // TODO: remove id
            if (!data.length) {
                setState(prev => ({...prev, raw: {}}))
                return;
            }
            if (callback.event === 'init') {
                setState(prev => {
                    return {
                        ...prev,
                        raw: Object.fromEntries(data.map(item => [item.id, item.fecha]))
                    }
                })
                return;
            }
            if (callback.event === "create" || callback.event === "update") {
                setState(({raw, ...others}) => {
                    return {
                        ...others,
                        // append only id not exits,
                        raw: {...raw, ...Object.fromEntries(data.map(item => [item.id, item.fecha]))},
                    }
                })
                return;
            }

            if (callback.event === "delete") {
                // for this case data is an array of ids
                setState(({raw, ...others}) => {
                    return {
                        ...others,
                        raw: data.reduce((acc, item) => {
                            if (item.id in acc) {
                                // delete the item from the hashmap
                                delete acc[item.id];
                            }
                            return acc;
                        }, raw)
                    }
                });
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