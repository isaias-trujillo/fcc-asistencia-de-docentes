import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FC, ReactNode } from "react";

type Props = {
  onSubmit: () => void;
  children: ReactNode;
  title: ReactNode;
  message?: ReactNode;
};

const MassiveMarkAlertDialog: FC<Props> = (props) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{props.title}</AlertDialogTitle>
        <AlertDialogDescription className={"font-semibold text-gray-600"}>
          {props.message}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex flex-row gap-8 flex-wrap">
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={props.onSubmit}>
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default MassiveMarkAlertDialog;
