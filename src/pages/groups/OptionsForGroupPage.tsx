import AppNavBar from "@/modules/shared/infrastructure/ui/components/AppNavBar.tsx";
import { BorderBeam } from "@/components/magicui/border-beam.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import InnerLayout from "@/layouts/InnerLayout.tsx";
import { useParams } from "react-router";
import GroupNavBar from "@/modules/groups/infrastructure/ui/components/GroupNavBar.tsx";
import TeacherAttendanceCard from "@/modules/teacher_attendances/infrastructure/ui/TeacherAttendanceCard.tsx";
import OptionsForGroup from "@/modules/groups/infrastructure/ui/components/OptionsForGroup.tsx";

const OptionsForGroupPage = () => {
  const { id: groupId } = useParams() as { id: string };

  return (
    <MainLayout>
      <InnerLayout>
        <AppNavBar />
        <main className="flex max-md:flex-col flex-wrap w-full justify-between gap-[clamp(1rem,1.25rem+2vh,2rem)] max-lg:justify-start max-md:items-center ">
          <GroupNavBar groupId={groupId} />
          <section
            className={
              "flex flex-col flex-wrap w-full gap-[clamp(1rem,1.25rem+2vh,2rem)]"
            }
          >
            <TeacherAttendanceCard groupId={groupId} />
            <OptionsForGroup groupId={groupId} />
          </section>
        </main>
        <BorderBeam duration={6} size={150} />
        <BorderBeam duration={6} size={150} delay={3} />
      </InnerLayout>
    </MainLayout>
  );
};

export default OptionsForGroupPage;
