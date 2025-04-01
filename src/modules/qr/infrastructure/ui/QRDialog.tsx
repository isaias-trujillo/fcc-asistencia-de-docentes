import { Button } from "@/components/ui/button.tsx";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { DialogDescription } from "@radix-ui/react-dialog";
import BigQrCode from "@/modules/qr/infrastructure/ui/BigQrCode.tsx";

const QRDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border-background border-1 transition-colors w-full">
          <ZoomIn />
          Ampliar QR
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          "bg-white flex flex-col max-w-[fit-content!important] max-h-fit"
        }
        aria-describedby={"QR para la asistencia de alumnos"}
      >
        <DialogHeader>
          <DialogTitle className={"hidden"}>
            Pide a tus alumnos que escaneen el QR para marcar su asistencia
          </DialogTitle>
          <DialogDescription className={"hidden"}>
            O puedes pasar lista de forma manual
          </DialogDescription>
          <BigQrCode />
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-blue-900 text-white hover:bg-blue-800 hover:text-white transition-colors font-semibold">
              <ZoomOut />
              Reducir QR
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRDialog;
