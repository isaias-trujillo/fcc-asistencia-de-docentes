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
    return (
      <Card className="relative flex flex-row items-center justify-center overflow-hidden gap-[clamp(1rem,1rem+2vh,4rem)] shadow-2xl max-sm:w-[calc(100%-max(2vw,2.5rem))] z-10 ">
        <CardHeader className="grow">
          <CardTitle className="text-[clamp(1.15rem,1rem+2vh,3rem)]">
            Tu sesión ha expirado
          </CardTitle>
          <CardDescription className="flex flex-col text-[clamp(1rem,0.75rem+1vw,1.5rem)] gap-[clamp(0.5rem,0.5rem+2vh,1rem)]">
            <span>Vuelve a ingresar tu credencial para continuar.</span>
            <span>O puede salir del sistema:</span>
            <Button onClick={onLogout} className="font-semibold w-fit">
              <LogOut />
              Cerrar sesión
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-max flex flex-row gap-5 grow items-center">
          <LoginForm />
        </CardContent>
        <BorderBeam duration={6} size={100} />
        <BorderBeam duration={6} size={100} delay={3} />
      </Card>
    );
  }

  return children;
};

export default AuthWrapper;
