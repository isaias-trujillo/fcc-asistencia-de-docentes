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
            <Button className={"max-sm:grow"}>
                <SendIcon /> Marcar mi salida
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de marcar tu salida?</AlertDialogTitle>
                <AlertDialogDescription className={'font-semibold text-accent-foreground'}>
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
