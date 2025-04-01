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
      <Button className={"max-sm:grow"}>
        <SendIcon /> Marcar nueva entrada
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          ¿Estás seguro de marcar a nueva entrada?
        </AlertDialogTitle>
        <AlertDialogDescription
          className={"font-semibold text-accent-foreground"}
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
