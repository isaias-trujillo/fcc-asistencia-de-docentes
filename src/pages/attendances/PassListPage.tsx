import InnerLayout from "@/layouts/InnerLayout.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import useLiveAttendances from "@/modules/attendances/infrastructure/directus/useLiveAttendances";
import MassiveMarkAttendanceCard
    from "@/modules/attendances/infrastructure/ui/components/massive-mark/MassiveMarkAttendanceCard";
import OverviewCard from "@/modules/attendances/infrastructure/ui/components/overview/OverviewCard";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups";
import GroupNavBar from "@/modules/groups/infrastructure/ui/components/GroupNavBar.tsx";
import QRCard from "@/modules/qr/infrastructure/ui/QRCard.tsx";
import AppNavBar from "@/modules/shared/infrastructure/ui/components/AppNavBar.tsx";
import LoadingBlock from "@/modules/shared/infrastructure/ui/components/LoadingBlock";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents.ts";
import useTeacherAttendance from "@/modules/teacher_attendances/infrastructure/directus/useTeacherAttendance.ts";
import StudentList from "@/pages/StudentList.tsx";
import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "lucide-react";

const PassListPage = () => {
    const {id} = useParams() as { id: string };
    const {
        data,
        search: searchStudents,
        connect: connectStudents,
        disconnect: disconnectStudents,
    } = useLiveStudents();
    const {search: searchAttendances, connect: connectAttendances, disconnect: disconnectAttendances, isMarkingAll} =
        useLiveAttendances();
    const {lastActiveAttendance} = useTeacherAttendance();
    const areThereStudents = data().length > 0;
    const {data: groups} = useLiveGroups();
    const group = groups().find((g) => g.id === id);
    const [params] = useSearchParams();
    const aula = params.get("aula");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!group) return;
        setLoading(() => true);
        connectStudents().then(async () => await connectAttendances()
            .then(async () => {
                await searchStudents({group});
                await searchAttendances({teacherAttendanceId: lastActiveAttendance()?.id});
            })).finally(() => setLoading(() => false));
    }, [!!group]);

    if (loading || isMarkingAll) {
        return (
            <MainLayout>
                <InnerLayout>
                    <AppNavBar/>
                    <main
                        className="flex flex-col w-full justify-between gap-[clamp(1rem,1.25rem+2vw,1.5rem)] max-lg:justify-center">
                        <GroupNavBar
                            redirectTo={`/cursos/${id}?aula=${aula}`}
                            groupId={id}
                            onRedirect={() => {
                                disconnectStudents();
                                disconnectAttendances();
                            }}
                        />
                        <LoadingBlock/>
                    </main>
                </InnerLayout>
            </MainLayout>
        );
    }

    if (!areThereStudents) {
        return (
            <MainLayout>
                <InnerLayout>
                    <AppNavBar/>
                    <main
                        className="flex flex-col w-full justify-between gap-[clamp(1rem,1.25rem+2vw,1.5rem)] max-lg:justify-center">
                        <GroupNavBar
                            redirectTo={`/cursos/${id}?aula=${aula}`}
                            groupId={id}
                            onRedirect={() => {
                                disconnectStudents();
                                disconnectAttendances();
                            }}
                        />
                        <p className="w-full text-center">
                            <span>No hay alumnos asignados a este curso.</span>
                            <span>O quizás perdiste la conexión a Internet.</span>
                            <Button className="font-semibold" onClick={() => window.location.reload()}>
                                <Loader/>
                                Intentar conectar
                            </Button>
                        </p>
                    </main>
                </InnerLayout>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <InnerLayout>
                <AppNavBar/>
                <main
                    className="flex flex-col w-full justify-between gap-[clamp(1rem,1.25rem+2vw,1.5rem)] max-lg:justify-center">
                    <GroupNavBar
                        redirectTo={`/cursos/${id}?aula=${aula}`}
                        groupId={id}
                        onRedirect={() => {
                            console.log("disconnecting from students and attendances");
                            disconnectStudents();
                            disconnectAttendances();
                        }}
                    />
                    <div
                        className={
                            "gap-[clamp(1rem,1.25rem+2vw,1.5rem)] flex flex-row max-xl:flex-wrap gap-y-[clamp(1rem,1.25rem+2vw,1.5rem)]"
                        }
                    >
                        {group && <QRCard/>}
                        <MassiveMarkAttendanceCard
                            teacherAttendanceId={lastActiveAttendance()?.id}
                        />
                        <OverviewCard/>
                    </div>
                    <StudentList/></main>
            </InnerLayout>
        </MainLayout>
    );
};

export default PassListPage;
