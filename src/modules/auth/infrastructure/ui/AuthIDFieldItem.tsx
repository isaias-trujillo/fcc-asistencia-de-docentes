import {FormControl, FormDescription, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import {AuthScheme} from "@/modules/auth/infrastructure/ui/authScheme.ts";
import {FC, useState} from "react";
import {ControllerRenderProps} from "react-hook-form";

type Props = {
    field: ControllerRenderProps<AuthScheme, 'documentNumber'>
};

const AuthIDFieldItem: FC<Props> = ({field}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return <FormItem>
        <FormLabel className="text-[clamp(0.75rem,1rem+1vh,1.25rem)]">Documento de Identidad</FormLabel>
        <FormDescription>(DNI, CE, Pasaporte, etc.)</FormDescription>
        <div className="flex items-center gap-2">
            <FormControl>
                <Input placeholder="shadcn" type={showPassword ? 'text' : 'password'} {...field} />
            </FormControl>
            {showPassword ? <EyeIcon onClick={toggleShowPassword}/> : <EyeOffIcon onClick={toggleShowPassword}/>}
        </div>
        <FormMessage/>
    </FormItem>
}

export default AuthIDFieldItem