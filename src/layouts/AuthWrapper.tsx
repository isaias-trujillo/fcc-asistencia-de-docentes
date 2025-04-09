import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/modules/auth/infrastructure/ui/components/LoginForm";
import useAuth from "@/modules/auth/infrastructure/useAuth";
import useProfile from "@/modules/teachers/infrastructure/directus/useProfile";
import { LogOut } from "lucide-react";
import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";

const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { authenticated, search, connect, disconnect, connected } = useProfile();
  const navigate = useNavigate();
  const { logout, documentNumber } = useAuth();

  useEffect(() => {
    connect().then(() => {
        if (documentNumber && connected) {
            search(documentNumber);
        }
    });
  }, [connected]);

  const onLogout = () =>
    logout().then(() => disconnect()).finally(() => {
      localStorage.clear();
      navigate("/");
      window.location.reload();
    });

  if (!authenticated) {
      localStorage.clear();
    return (
      <Card className="relative flex flex-row flex-wrap self-center items-center justify-start overflow-hidden gap-[clamp(1rem,1rem+2vh,4rem)] max-w-max  z-10 ">
        <CardHeader>
          <CardTitle className="text-[clamp(2rem,3rem+2vh,5rem)] text-left">
            Tu sesión ha expirado
          </CardTitle>
        </CardHeader >
        <CardContent className="flex flex-col text-[clamp(1rem,1rem+1vw,1.75rem)] gap-[clamp(0.5rem,0.5rem+2vh,1rem)]">
            <p className='max-w-2/3'>Puedes cerrar sesión y volver a ingresar tu documento de identidad (DNI, CE, Pasaporte, etc.)</p>
            <Button onClick={onLogout} className="font-semibold w-fit">
              <LogOut />
              Cerrar sesión
            </Button>
        </CardContent>
        <BorderBeam duration={6} size={100} />
        <BorderBeam duration={6} size={100} delay={3} />
      </Card>
    );
  }

  return children;
};

export default AuthWrapper;
