import { BorderBeam } from "@/components/magicui/border-beam.tsx";
import InnerLayout from "@/layouts/InnerLayout.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import useAuth from "@/modules/auth/infrastructure/useAuth.ts";
import useLiveGroups from "@/modules/groups/infrastructure/directus/useLiveGroups.ts";
import GroupCard from "@/modules/groups/infrastructure/ui/components/GroupCard.tsx";
import AppNavBar from "@/modules/shared/infrastructure/ui/components/AppNavBar.tsx";
import LoadingBlock from "@/modules/shared/infrastructure/ui/components/LoadingBlock";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const GroupsPage = () => {
  const { data, search } = useLiveGroups();
  const { documentNumber, loggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentNumber) {
      setLoading(() => true);
      search(documentNumber)
        .catch(() => toast.error("No se pudo encontrar sus cursos."))
        .finally(() => setLoading(() => false));
    }
    // eslint-disable-next-line
  }, [loggedIn, documentNumber]);

  if (loading) {
    return (
      <MainLayout>
        <InnerLayout>
          <AppNavBar />
          <LoadingBlock />
          <BorderBeam duration={6} size={150} />
          <BorderBeam duration={6} size={150} delay={3} />
        </InnerLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <InnerLayout>
        <AppNavBar />
        <span className="text-[clamp(0.75rem,1.25rem+1dvw,2rem)] self-center">
          Selecciona un curso. 👇
        </span>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,19rem),1fr))] grid-flow-dense gap-[clamp(0.75rem,1rem+2vw,2rem)]">
          {data()
            .sort((a, b) => {
              const s1 = a.course.name
                .trim()
                .localeCompare(b.course.name.trim(), "es-ES");
              if (!a.classroom && !b.classroom) {
                return s1;
              }
              if (!a.classroom) {
                return s1;
              }
              if (!b.classroom) {
                return s1;
              }
              const s2 = a.classroom.localeCompare(b.classroom, "es-ES");
              return s1 + s2;
            })
            .map((group, i) => (
              <li key={i}>
                <GroupCard group={group} />
              </li>
            ))}
        </ul>
        <BorderBeam duration={6} size={150} />
        <BorderBeam duration={6} size={150} delay={3} />
      </InnerLayout>
    </MainLayout>
  );
};

export default GroupsPage;
