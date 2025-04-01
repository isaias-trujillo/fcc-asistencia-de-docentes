import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {Form, FormField} from "@/components/ui/form"
import authScheme, {AuthScheme} from "@/modules/auth/infrastructure/ui/authScheme.ts";
import onLogin from "@/modules/auth/infrastructure/ui/onLogin.ts";
import AuthIDFieldItem from "@/modules/auth/infrastructure/ui/AuthIDFieldItem.tsx";

const AuthForm = () => {
    const form = useForm<AuthScheme>({
        resolver: zodResolver(authScheme),
        defaultValues: {
            documentNumber: "",
        },
    })

    const onSubmit = form.handleSubmit(onLogin);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
                <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({field}) => (
                        <AuthIDFieldItem field={field}/>
                    )}
                />
                <Button type="submit" className="w-full font-semibold">Iniciar sesión</Button>
            </form>
        </Form>
    )
};

export default AuthForm