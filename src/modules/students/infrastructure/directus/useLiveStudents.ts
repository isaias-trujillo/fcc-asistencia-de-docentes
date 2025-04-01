import {createDirectus, realtime} from "@directus/sdk";
import {create} from "zustand/react";
import EnrollmentScheme from "@/modules/students/application/EnrollmentScheme.ts";
import Student from "@/modules/students/domain/Student.ts";
import schemeToStudent from "@/modules/students/application/schemeToStudent.ts";

type Store = {
    search: (groupId: string) => Promise<void>;
    raw: Record<PropertyKey, EnrollmentScheme>;
    data: () => Student[];
    disconnect: () => void;
    connected: boolean;
    connect: () => Promise<void>;
};

const useLiveStudents = create<Store>((setState, getState) => {
    const client = createDirectus(
        import.meta.env.VITE_DIRECTUS_WS_URL as string,
    ).with(
        realtime({
            authMode: "handshake",
        }),
    );
    const search = async (groupId: string) => {
        setState({raw: {}});
        client.sendMessage({
            type: "subscribe",
            collection: "matriculas",
            query: {
                filter: {
                    grupo: {
                        id: {
                            _eq: groupId,
                        },
                    },
                },
                fields: ["*", "alumno.*"],
                sort: [
                    "alumno.apellido_paterno",
                    "alumno.apellido_materno",
                    "alumno.nombres",
                ],
            },
        });

        client.onWebSocket("message", (callback) => {
            if (callback.type !== "subscription") {
                return;
            }
            switch (callback.event) {
                case "init": {
                    const data = (callback?.data ?? []) as EnrollmentScheme[];
                    setState((prev) => ({
                        ...prev,
                        search,
                        raw: Object.fromEntries(
                            data.map((scheme) => [scheme.id, scheme]),
                        ),
                    }));
                    break;
                }
                case "create":
                case "update": {
                    {
                        const data = (callback?.data ?? []) as EnrollmentScheme[];
                        setState((prev) => ({
                            ...prev,
                            search,
                            raw: {
                                ...prev.raw,
                                ...Object.fromEntries(
                                    data.map((scheme) => [scheme.id, scheme]),
                                ),
                            },
                        }))
                        break;
                    }
                }
                case "delete": {
                    const data = (callback?.data ?? []) as string[];
                    // for this case data is an array of ids
                    setState((prev) => {
                        return {
                            ...prev,
                            search,
                            raw: Object.fromEntries(Object.entries(prev.raw).filter(([key]) => !data.includes(key))),
                        };
                    });
                    break;
                }
            }
        });
    };
    return {
        search,
        raw: {},
        data: () => schemeToStudent(getState().raw),
        disconnect: () => {
            if (!getState().connected) return;
            client.disconnect();
            setState(prev => ({...prev, connected: false, raw: {}}));
        },
        connected: false,
        connect: async () => {
            if (getState().connected) {
                return;
            }
            await client.connect()
                .then(() => setState({connected: true}))
                .catch(() => setState({connected: false}));
        },
    };
});

export default useLiveStudents;
