import {useParams, useSearchParams} from "react-router";
import StudentReportTable from "@/modules/student_attendances/infrastructure/ui/StudentReportTable.tsx";
import InnerLayout from "@/layouts/InnerLayout.tsx";
import AppNavBar from "@/modules/shared/infrastructure/ui/components/AppNavBar.tsx";
import GroupNavBar from "@/modules/groups/infrastructure/ui/components/GroupNavBar.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import useClassesCounter from "@/modules/classes_counter/infrastructure/directus/useClassesCounter.ts";
import {useEffect, useState} from "react";
import useProfile from "@/modules/teachers/infrastructure/directus/useProfile.ts";
import {SlidingNumber} from "@/components/motion-primitives/sliding-number.tsx";
import LoadingBlock from "@/modules/shared/infrastructure/ui/components/LoadingBlock";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents.ts";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups.ts";

const AttendanceReportPage = () => {
    const {id: groupId} = useParams() as { id: string };
    const {attendances, search: searchCount, connect: connectCount} = useClassesCounter();
    const {search: searchStudents, connect: connectStudents, disconnect: disconnectStudents} = useLiveStudents();
    const {id: teacherId, disconnect: disconnectProfile} = useProfile();
    const [params] = useSearchParams();
    const aula = params.get("aula");
    const [loading, setLoading] = useState(true);
    const {data: groups} = useLiveGroups();
    const group = groups().find((g) => g.id === groupId);

    useEffect(() => {
        if (!group) return;
        setLoading(() => true);
        connectStudents().then(async () => {
            await connectCount().then(() => searchCount({group, teacherId: teacherId ?? ''}, {period: 'all'}));
            await searchStudents({group});
        }).finally(() => setLoading(() => false));
        // eslint-disable-next-line
    }, [!!teacherId]);


    if (loading) {
        return (
            <MainLayout>
                <InnerLayout>
                    <AppNavBar/>
                    <main
                        className="flex flex-col w-full justify-between gap-[clamp(1rem,1.25rem+2vw,1.5rem)] max-lg:justify-center">
                        <GroupNavBar
                            redirectTo={`/cursos/${groupId}?aula=${aula}`}
                            groupId={groupId}
                            onRedirect={() => {
                                console.log('disconnect students and profile');
                                disconnectStudents();
                                disconnectProfile();
                            }}
                        />
                        <LoadingBlock/>
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
                        redirectTo={`/cursos/${groupId}?aula=${aula}`}
                        groupId={groupId}
                        onRedirect={() => {
                            console.log('disconnect students and profile');
                            disconnectStudents();
                            disconnectProfile();
                        }}
                    />
                    <div className='flex flex-row flex-wrap gap-[clamp(1rem,1.25rem+2vw,1.5rem)] justify-between'>
                        <span className={"flex flex-row flex-wrap gap-0.5 items-center"}>
                            N° de veces que tomó asistencia a sus alumnos: <SlidingNumber value={attendances()}/>
                        </span>
                        {/*<FiltersUI/>*/}
                    </div>
                    <StudentReportTable groupId={groupId}/>
                </main>
            </InnerLayout>
        </MainLayout>
    );
};

export default AttendanceReportPage;
