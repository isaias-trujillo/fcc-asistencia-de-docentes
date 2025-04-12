import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {SendIcon} from "lucide-react";

const CheckOutAlertDialog = ({onSubmit} : { onSubmit: () => void }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className={"max-sm:grow p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)]"}>
                <SendIcon className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]'/> Marcar mi salida
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className={"text-[clamp(0.75rem,1rem+1dvw,1.5rem)] text-left"}>¿Estás seguro de marcar tu salida?</AlertDialogTitle>
                <AlertDialogDescription className={'text-accent-foreground text-[clamp(0.75rem,0.75rem+1dvw,1rem)] text-left'}>
                    Si tienes más horas pendientes, tendrás que volver a marcar tu entrada y pasar lista a tus alumnos de nuevo.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default CheckOutAlertDialog;
