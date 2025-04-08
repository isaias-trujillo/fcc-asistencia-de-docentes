import {Button} from "@/components/ui/button.tsx";
import useAuth from "@/modules/auth/infrastructure/useAuth.ts";
import {useNavigate} from "react-router";
import useProfile from "@/modules/teachers/infrastructure/directus/useProfile.ts";
import {LogOut} from "lucide-react";

const AppNavBar = () => {
    const {logout} = useAuth();
    const {profile, disconnect} = useProfile();
    const navigate = useNavigate();
    const onLogout = () =>
        logout().then(() => disconnect()).finally(() => {
            localStorage.clear();
            navigate("/");
        });

  return (
    <nav className="gap-x-[clamp(0.75rem,0.75rem+2vh,2rem)] gap-y-[clamp(0.5rem,0.5rem+1vh,1rem)] w-full flex flex-wrap justify-between items-center ">
      <div className="flex flex-row gap-2 items-center">
        <img
          src={`${import.meta.env.BASE_URL}/logo.svg`}
          alt="logo"
          className="size-[clamp(2rem,2rem+1dvw,2.5rem)]"
        />
        <div className="flex flex-col max-sm:grow text-[clamp(0.75rem,0.75rem+1dvh,1.5rem)]">
          <span className="font-semibold">{profile ?? "@docente"}</span>
          <span>Pregrado</span>
        </div>
      </div>
      <Button onClick={onLogout} className="max-sm:grow">
        <LogOut />
        Cerrar sesión
      </Button>
    </nav>
  );
};

export default AppNavBar;
