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
          <CardDescription className="text-[clamp(0.75rem,1rem+1dvw,1.25rem)] italic bg-[#ffc727] text-black px-4 py-2 rounded-md w-fit">
            Pregrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
              href={`${import.meta.env.BASE_URL}/manual-de-uso.pdf`}
              target='_blank'
              className='bg-accent rounded-md py-2 px-4 text-center flex items-center gap-4 justify-center'>
            <img src='https://cdn-icons-png.flaticon.com/512/18063/18063801.png'
                 className='size-[clamp(1rem,1.5rem+2dvw,2.5rem)]' alt='pdf logo'/>
            <span className='font-semibold text-[clamp(0.75rem,0.75rem+1dvh,1.15rem)]'>Manual de uso del sistema</span>
          </a>
            <img
                src={`${import.meta.env.BASE_URL}/24666574_6977678 2.svg`}
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
