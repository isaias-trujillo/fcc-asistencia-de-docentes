import {useForm} from "react-hook-form"
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import {Input} from "@//components/ui/input";
import authScheme, {AuthScheme} from "@/modules/auth/infrastructure/authScheme.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import useAuth from "@/modules/auth/infrastructure/useAuth.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {useState} from "react";
import {EyeIcon, EyeOffIcon} from "lucide-react";

const LoginForm = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<AuthScheme>({
        resolver: zodResolver(authScheme),
        defaultValues: {
            documentNumber: ""
        },
    })
    const onSubmit = async (payload: AuthScheme) => {
        toast.promise(login(payload.documentNumber), {
            loading: "Validando credenciales...",
            success: () => {
                navigate("/cursos");
                return "Bienvenido de nuevo !";
            },
            error: "Credenciales inválidas."
        });
    };

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[clamp(3rem,3rem+1vw,4rem)]">
            <FormField
                control={form.control}
                name="documentNumber"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className="text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)]">
                            Documento de identidad
                        </FormLabel>
                        <FormDescription>DNI, CE, Pasaporte, etc.</FormDescription>
                        <div className="flex items-center gap-[clamp(0.5rem,0.5rem+1vh,2rem)]">
                            <FormControl>
                                <Input autoFocus={true} type={showPassword ? 'text' : 'password'} placeholder="1234678" {...field} />
                            </FormControl>
                            {showPassword ? <EyeIcon onClick={() => setShowPassword(false)}/> :
                                <EyeOffIcon onClick={() => setShowPassword(true)}/>}
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full font-semibold">Iniciar sesión</Button>
        </form>
    </Form>
}

export default LoginForm
