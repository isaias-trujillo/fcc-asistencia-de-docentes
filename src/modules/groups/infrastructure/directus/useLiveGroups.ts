import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {ScheduleScheme} from "@/modules/groups/application/ScheduleScheme.ts";
import schemeToGroup from "@/modules/groups/application/schemeToGroup.ts";
import Group from "@/modules/groups/domain/Group.ts";

type Store = {
    search: (documentNumber: string) => Promise<void>;
    raw: Record<PropertyKey, ScheduleScheme>;
    data: () => Group[]
};

const useLiveGroups = create(persist<Store>((setState, getState) => {
    const search = async (documentNumber: string) => {
        const client = createDirectus(import.meta.env.VITE_DIRECTUS_WS_URL as string)
            .with(realtime({
                authMode: 'handshake',
            }))

        await client.connect();
        client.sendMessage({
            type: "subscribe",
            collection: "horarios",
            query: {
                filter: {
                    "docente": {
                        "identificacion": {
                            "_eq": documentNumber
                        }
                    }
                },
                fields: ['*', 'grupo.*', 'grupo.asignatura.*'],
            }
        })

        client.onWebSocket('message', (callback) => {
            if (callback.type !== 'subscription') {
                return;
            }
            const data = (callback?.data ?? []) as ScheduleScheme[];
            switch (callback.event) {
                case 'init': {
                    setState(() => ({
                        search,
                        raw: {...Object.fromEntries(data.map(scheme => [scheme.id, scheme]))}
                    }));
                    break;
                }
                case "create":
                case 'update': {
                    setState(({raw}) => ({
                        search,
                        raw: {...raw, ...Object.fromEntries(data.map(scheme => [scheme.id, scheme]))}
                    }));
                    break;
                }
                case "delete": {
                    // for this case data is an array of ids
                    setState(({raw}) => {
                        return {
                            search,
                            raw: data.reduce((acc, item) => {
                                if (item.id in acc) {
                                    // delete the item from the hashmap
                                    delete acc[item.id];
                                }
                                return acc;
                            }, raw)
                        }
                    });
                    break;
                }
            }
        })
    }
    return {
        search,
        raw: {},
        data: () => schemeToGroup(getState().raw),
    };
}, {
    name: "live-groups",
}))

export default useLiveGroups