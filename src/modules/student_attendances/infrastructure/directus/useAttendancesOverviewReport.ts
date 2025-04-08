import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import periodToRange from "@/modules/student_attendances/domain/PeriodToRange.ts";
import {createDirectus, realtime} from "@directus/sdk";
import {Filters} from "@/modules/student_attendances/infrastructure/directus/filters.ts";
import {StudentAttendanceOverviewRawRecord} from "@/modules/student_attendances/domain/StudentAttendanceOverviewRaw.ts";

type Store = {
    data: () => StudentAttendanceOverviewRawRecord;
    raw: Record<
        PropertyKey,
        { alumno: string; estado: "asistencia" | "tardanza" | "falta" }
    >;
    search: ({filters, today}: { filters: Filters, today: Date }) => Promise<void>;
};

const useAttendancesOverviewReport = create(
    persist<Store>(
        (setState, getState) => {
            const search: Store["search"] = async ({filters, today}) => {
                const {from, to} = periodToRange(
                    filters.period === "custom range"
                        ? {
                            date: today,
                            period: filters.period,
                            range: filters.range,
                        }
                        : {
                            date: today,
                            period: filters.period,
                        },
                );

                const client = createDirectus(
                    import.meta.env.VITE_DIRECTUS_API_URL as string,
                ).with(
                    realtime({
                        authMode: "handshake",
                    }),
                );
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
                                            _eq: filters.group?.course.code,
                                        },
                                    },
                                }
                            },
                            estado: {
                                _in: ['asistencia', 'tardanza']
                            },
                            ...(filters.studentId
                                ? {
                                    alumno: {
                                        id: {
                                            _eq: filters.studentId,
                                        },
                                    },
                                }
                                : {}),
                            ...(from || to
                                ? {
                                    fecha: {
                                        ...(from
                                            ? {
                                                _gte: from.toISOString().split("T")[0],
                                            }
                                            : {}),
                                        ...(to
                                            ? {
                                                _lte: to.toISOString().split("T")[0],
                                            }
                                            : {}),
                                    },
                                }
                                : {}),
                        },
                        fields: ["id", "alumno", "estado"],
                        limit: -1,
                    },
                });

                client.onWebSocket("message", (callback) => {
                    if (callback.type !== "subscription") {
                        return;
                    }

                    if (callback.event === "delete") {
                        return;
                    }

                    const data = (callback?.data ?? []) as { id: string | number; alumno: string; estado: "asistencia" | "tardanza" | "falta" }[];
                    switch (callback.event) {
                        case "init":
                            setState((prev) => ({
                                ...prev,
                                raw: Object.fromEntries(data.map((d) => [d.id, d])),
                            }));
                            break;
                        case "create":
                        case "update":
                            setState(({raw, ...props}) => ({
                                ...props,
                                raw: {
                                    ...raw,
                                    ...Object.fromEntries(data.map((d) => [d.id, d])),
                                },
                            }));
                            break;
                    }
                });
            };

            return {
                search,
                raw: {},
                data: () => {
                    const groupByStudent = Object.entries(getState()?.raw ?? {}).reduce(
                        (acc, [, {alumno, estado}]) => {
                            if (alumno in acc) {
                                acc[alumno].asistencias += estado === "asistencia" ? 1 : 0;
                                acc[alumno].tardanzas += estado === "tardanza" ? 1 : 0;
                                return acc;
                            }
                            acc[alumno] = {
                                asistencias: estado === "asistencia" ? 1 : 0,
                                tardanzas: estado === "tardanza" ? 1 : 0,
                                faltas: estado === "falta" ? 1 : 0,
                            };
                            return acc;
                        },
                        {} as Record<PropertyKey, Record<PropertyKey, number>>,
                    );

                    return groupByStudent as StudentAttendanceOverviewRawRecord;
                },
            };
        },
        {
            name: "student-attendances-overview-report",
        },
    ),
);

export default useAttendancesOverviewReport;
