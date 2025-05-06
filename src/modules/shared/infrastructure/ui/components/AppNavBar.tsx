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
            window.location.reload();
        });

  return (
    <nav className="gap-x-[clamp(0.75rem,0.75rem+2vh,2rem)] gap-y-[clamp(0.5rem,0.5rem+1vh,1rem)] w-full flex flex-wrap justify-between items-center ">
      <div className="flex flex-row gap-2 items-center">
        <img
          src={`${import.meta.env.BASE_URL}/logo.svg`}
          alt="logo"
          className="size-[clamp(1.25rem,1.5rem+1dvw,2rem)]"
        />
        <p className="flex flex-row max-sm:grow text-[clamp(0.75rem,0.75rem+1dvh,1.25rem)] gap-[clamp(0.25rem,0.25rem+1vh,.5rem)]">
          <span className="font-semibold">{profile ?? "@docente"}</span>
          <span>(Pregrado)</span>
        </p>
      </div>
      <Button onClick={onLogout} className="max-sm:grow">
        <LogOut />
        Cerrar sesión
      </Button>
    </nav>
  );
};

export default AppNavBar;
