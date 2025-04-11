import {Filters} from "@/modules/student_attendances/infrastructure/directus/filters.ts";
import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import Group from "@/modules/groups/domain/Group.ts";

type Store = {
    search: (payload: { group: Group, teacherId: string }, filters: Filters) => Promise<void>;
    raw: Record<PropertyKey, number>;
    attendances: () => number;
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const useClassesCounter = create<Store>((setState, getState) => {
    const client = createDirectus(import.meta.env.VITE_DIRECTUS_WS_URL as string)
        .with(realtime({
            authMode: 'handshake',
        }));
    const search: Store['search'] = async ({group, teacherId}) => {
        client.sendMessage({
            type: "subscribe",
            collection: "asistencias_de_alumnos",
            query: {
                filter: {
                    sesion: {
                        grupo: {
                            id: {
                                _eq: group.id
                            }
                        },
                        docente: {
                            id: {
                                _eq: teacherId
                            }
                        }
                    }
                },
                fields: ['*'],
                limit: -1,
                // aggregate: {
                //     count: '*'
                // },
                groupBy: ['sesion'],
            },
        })

        client.onWebSocket('message', (callback) => {
            if (callback.type !== 'subscription') {
                return;
            }
            const data = (callback?.data ?? []) as { sesion: number }[]; // TODO: remove id
            if (!data.length) {
                setState(prev => ({...prev, raw: {}}))
                return;
            }
            if (callback.event === 'init') {
                setState(prev => {
                    return {
                        ...prev,
                        raw: Object.fromEntries(data.map(({sesion}) => [sesion, 1]))
                    }})
                return;
            }
        })
    }
    return {
        search,
        attendances: () => Object.values((getState()?.raw ?? {})).reduce((acc, v) => acc + v, 0),
        raw: {},
        connected: false,
        connect: async () => {
            if (getState().connected) {
                return;
            }
            await client.connect().then(() => setState({connected: true})).catch(() => setState({connected: false}));
        },
        disconnect: () => {
            if (!getState().connected) return;
            client.disconnect();
            setState(prev => ({...prev, connected: false, raw: {}}));
        }
    }
})

export default useClassesCounter