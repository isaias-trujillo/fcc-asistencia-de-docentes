import {createDirectus, createItem, createItems, deleteItems, realtime, rest,} from "@directus/sdk";
import {create} from "zustand/react";
import AttendanceScheme from "@/modules/attendances/application/AttendanceScheme.ts";
import {toast} from "sonner";
import {LiveAttendanceStore} from "@/modules/attendances/infrastructure/directus/liveAttendanceStore.ts";
import {formatTime} from "@/modules/attendances/infrastructure/directus/formatTime.ts";

const useLiveAttendances = create<LiveAttendanceStore>((setState, getState) => {
    const client = createDirectus(import.meta.env.VITE_DIRECTUS_WS_URL).with(
        realtime({authMode: "handshake"})
    );
    const apiClient = createDirectus(
        import.meta.env.VITE_DIRECTUS_API_URL
    ).with(rest({credentials: "include"}));

    const search: LiveAttendanceStore["search"] = async ({teacherAttendanceId}) => {
        getState().connect();
        setState({raw: {}});
        client.sendMessage({
            type: "subscribe",
            collection: "asistencias_de_alumnos",
            query: {
                filter: {sesion: {id: {_eq: teacherAttendanceId}}},
                fields: ["*", "alumno.*"],
            },
        });

        client.onWebSocket("message", (callback) => {
            if (callback.type !== "subscription") return;

            if (callback.event === "init") {
                const data = (callback?.data ?? []) as AttendanceScheme[];
                setState({
                    raw: Object.fromEntries(
                        data.map((scheme) => [
                            scheme.alumno.id,
                            scheme.estado
                        ])
                    )
                });
                return;
            }
            if (["create", "update"].includes(callback.event)) {
                const data = (callback?.data ?? []) as AttendanceScheme[];
                setState(prev => ({
                    ...prev,
                    raw: {
                        ...prev.raw,
                        ...Object.fromEntries(
                            data.map((scheme) => [
                                scheme.alumno.id,
                                scheme.estado
                            ])
                        )
                    }
                }));
                return;
            }
            if (['delete'].includes(callback.event)) {
                const data = (callback?.data ?? []) as AttendanceScheme['id'][];
                // for this case data is an array of ids
                setState((prev) => {
                    return {
                        ...prev,
                        raw: Object.fromEntries(Object.entries(prev.raw).filter(([key]) => !data.includes(key))),
                    };
                });
                return;
            }
        });
    };

    const mark: LiveAttendanceStore["mark"] = async ({studentId, state, date, time, teacherAttendanceId}) => {
        try {
            await apiClient.request(deleteItems("asistencias_de_alumnos", {
                filter: {
                    alumno: {id: {_eq: studentId}},
                    sesion: {id: {_eq: teacherAttendanceId}}
                }
            }));

            await apiClient.request(createItem("asistencias_de_alumnos", {
                alumno: studentId,
                fecha: date,
                hora: formatTime(time),
                estado: state,
                sesion: teacherAttendanceId,
            }));
        } catch {
            toast.error("No se pudo guardar la asistencia, revisa tu conexión a internet.", {
                action: {
                    label: "Recargar",
                    onClick: () => window.location.reload(),
                },
            });
        }
    };

    const markAll: LiveAttendanceStore["markAll"] = async ({studentIDs, ...props}) => {
        setState(prev => ({...prev, isMarkingAll: true}));
        try {
            await apiClient.request(deleteItems("asistencias_de_alumnos", {
                filter: {
                    sesion: {id: {_eq: props.teacherAttendanceId}}
                }
            }));

            await apiClient.request(createItems("asistencias_de_alumnos", studentIDs.map((id) => ({
                alumno: id,
                sesion: props.teacherAttendanceId,
                estado: props.state,
                fecha: props.date,
                hora: formatTime(props.time)
            }))));

        } catch {
            throw new Error("Error al registrar las asistencias, revisa tu conexión a internet.");
        } finally {
            setState(prev => ({...prev, isMarkingAll: false}))
            window.location.reload();
        }
    };
    return {
        search,
        raw: {},
        mark,
        markAll,
        overview: (students) => {
            // count 'asistencia' and 'tardanza' for each student
            // faltas = students.length - (asistencias + tardanzas)
            const raw = Object.values(getState().raw);
            const result = {
                asistencias: raw.filter((a) => a === 'asistencia').length,
                tardanzas: raw.filter((a) => a === 'tardanza').length,
                faltas: 0
            };
            result.faltas = students.length - (result.asistencias + result.tardanzas);
            return result;
        },
        isMarkingAll: false,
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

export default useLiveAttendances;
