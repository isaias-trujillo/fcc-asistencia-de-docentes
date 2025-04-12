import LoginForm from "@/modules/auth/infrastructure/ui/components/LoginForm.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam.tsx";

const LoginPage = () => {
  return (
    <MainLayout>
      <Card className="relative w-md overflow-hidden gap-[clamp(1rem,1rem+2vh,4rem)] shadow-2xl max-sm:w-[calc(100%-max(2vw,2.5rem))] z-10 ">
        <CardHeader>
          <CardTitle className="text-[clamp(1.15rem,1rem+2vh,3rem)]">
            Sistema de Marcación de Docentes
          </CardTitle>
          <CardDescription className="text-[clamp(0.75rem,1rem+1dvw,1.25rem)] italic bg-[#7e1e20] text-white w-fit py-2 px-4 rounded-md">
            Posgrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={`${import.meta.env.BASE_URL}/9148013_4099578.svg`}
            alt="something in the way..."
          />
          <LoginForm />
        </CardContent>
        <BorderBeam duration={6} size={100} />
        <BorderBeam duration={6} size={100} delay={3} />
      </Card>
    </MainLayout>
  );
};

export default LoginPage;
