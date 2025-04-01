import {z} from "zod";
import authScheme from "@/modules/auth/infrastructure/ui/authScheme.ts";

const onLogin = (payload: z.infer<typeof authScheme>) => {
    console.log(payload)
}

export default onLogin