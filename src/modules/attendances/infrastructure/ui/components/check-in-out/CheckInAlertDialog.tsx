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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

const CheckInAlertDialog = ({ onSubmit }: { onSubmit: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className={"max-sm:grow p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,1rem+1dvw,1.25rem) text-background"}>
        <SendIcon className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]'/> Marcar una nueva entrada
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className={"text-[clamp(0.75rem,1rem+1dvw,1.5rem)] text-left"}>
          ¿Estás seguro de marcar a nueva entrada?
        </AlertDialogTitle>
        <AlertDialogDescription
          className={"text-accent-foreground text-[clamp(0.75rem,0.75rem+1dvw,1rem)] text-left"}
        >
          Tendrías que volver a pasar lista a tus alumnos.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onSubmit}>Continuar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default CheckInAlertDialog;
