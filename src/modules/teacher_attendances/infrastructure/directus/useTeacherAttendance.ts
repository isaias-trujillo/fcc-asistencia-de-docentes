import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import {
  createDirectus,
  createItem,
  realtime,
  rest,
  updateItem,
} from "@directus/sdk";
import { toast } from "sonner";
import Group from "@/modules/groups/domain/Group.ts";
import getScheduleBasedOnDay from "@/modules/groups/application/getScheduleBasedOnDay.ts";
import getStateBasedOnScheduleAndTime from "@/modules/groups/application/getStateBasedOnScheduleAndTime.ts";
import TeacherAttendanceScheme from "@/modules/teacher_attendances/infrastructure/directus/TeacherAttendanceScheme.ts";

type TeacherAttendanceStore = {
  attendances: Record<PropertyKey, TeacherAttendanceScheme>;
  search: (payload: {
    teacherId: string;
    group: Group;
    date: Date;
  }) => Promise<void>;
  mark: (payload: {
    teacherId: string;
    group: Group;
    time: string;
    date: Date;
    aula?: string | null;
  }) => Promise<void>;
  lastActiveAttendance(): TeacherAttendanceScheme | undefined;
};

const useTeacherAttendance = create(
  persist<TeacherAttendanceStore>(
    (setState, getState) => {
      const search: TeacherAttendanceStore["search"] = async ({
        teacherId,
        group,
        date,
      }) => {
        const client = createDirectus(
          import.meta.env.VITE_DIRECTUS_WS_URL as string,
        ).with(
          realtime({
            authMode: "handshake",
          }),
        );
        await client.connect();
        client.sendMessage({
          type: "subscribe",
          collection: "asistencias_de_docentes",
          query: {
            filter: {
              docente: {
                id: {
                  _eq: teacherId,
                },
              },
              grupo: {
                id: {
                  _eq: group.id,
                },
              },
              fecha: {
                _eq: date.toISOString().split("T")[0],
              },
            },
          },
        });

        client.onWebSocket("message", (callback) => {
          if (callback.type !== "subscription") {
            return;
          }
          if (callback.event === "delete") {
            const data = (callback?.data ?? []) as PropertyKey[];

            setState(({ attendances, ...prev }) => {
              return {
                ...prev,
                attendances: data.reduce((acc, curr) => {
                  if (curr in acc) {
                    delete acc[curr];
                  }
                  return acc;
                }, attendances),
              };
            });
            return;
          }
          const data = (callback?.data ?? []) as TeacherAttendanceScheme[];
          if (callback.event === "init") {
            setState((prev) => ({
              ...prev,
              attendances: Object.fromEntries(
                data.map((attendance) => [attendance.id, attendance]),
              ),
            }));
            return;
          }
          setState((prev) => ({
            ...prev,
            attendances: {
              ...prev.attendances,
              ...Object.fromEntries(
                data.map((attendance) => [attendance.id, attendance]),
              ),
            },
          }));
        });
      };

      const mark: TeacherAttendanceStore["mark"] = async ({
        teacherId,
        group,
        time,
        date,
        aula,
      }) => {
        const client = createDirectus(
          import.meta.env.VITE_DIRECTUS_API_URL as string,
        ).with(rest({ credentials: "include" }));

        // get attendance without hora de salida
        const attendanceId = Object.values(getState()?.attendances ?? {}).find(
          (a) => a.grupo === group.id && !a.hora_de_salida,
        )?.id;

        if (!attendanceId) {
          let state: string = "asistencia";
          const day = date.toLocaleDateString("es-ES", { weekday: "long" });
          const schedule = getScheduleBasedOnDay({
            group,
            day,
          });
          if (schedule) {
            state = getStateBasedOnScheduleAndTime({ schedule, date });
          }

          // create a new one
          try {
            const attendance = (await client.request(
              createItem("asistencias_de_docentes", {
                docente: teacherId,
                grupo: group.id,
                // fecha: date.toISOString().split("T")[0],
                hora_de_entrada: time,
                hora_de_entrada_esperada: schedule?.start,
                hora_de_salida_esperada: schedule?.end,
                estado: state,
                aula,
              }),
            )) as TeacherAttendanceScheme;
            setState((prev) => ({
              ...prev,
              attendances: {
                ...prev.attendances,
                [attendance.id]: attendance,
              },
            }));
          } catch {
            toast.error("No se pudo marcar su entrada.");
          }
          return;
        }

        if (!attendanceId) {
          toast.error("Primero tiene que marcar su entrada.");
          return;
        }

        // update
        try {
          const attendance = (await client.request(
            updateItem("asistencias_de_docentes", attendanceId, {
              hora_de_salida: time,
            }),
          )) as TeacherAttendanceScheme;
          setState((prev) => ({
            ...prev,
            attendances: {
              ...prev.attendances,
              [attendance.id]: attendance,
            },
          }));
        } catch {
          toast.error("No se pudo marcar su salida.");
        }
      };

      return {
        attendances: {},
        search,
        mark,
        lastActiveAttendance: () =>
          Object.values(getState()?.attendances ?? {}).find(
            (a) => !a.hora_de_salida || a.hora_de_salida === "",
          ),
      };
    },
    {
      name: "teacher-attendance",
    },
  ),
);

export default useTeacherAttendance;
