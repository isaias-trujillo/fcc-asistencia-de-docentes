import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ListChecks} from "lucide-react";
import {DialogClose} from "@radix-ui/react-dialog";

const NotCheckInDialog = ({isEmpty, isAllChecked}: { isEmpty: boolean, isAllChecked: boolean }) => {
    if (!isEmpty && !isAllChecked) {
        return <></>
    }
    return <Dialog>
        <DialogTrigger asChild>
            <Button className="w-full flex justify-start gap-2">
                <ListChecks/>
                Pasar lista
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {isEmpty
                        ? 'No has marcado tu entrada'
                        : isAllChecked
                            ? 'No puede pasar lista si ya has marcado tu salida.'
                            : 'OK'
                    }
                </DialogTitle>
                <DialogDescription>
                    {isEmpty
                        ? 'Una vez hayas marcado tu entrada, podrás pasar lista'
                        : isAllChecked
                            ? 'Pero, si tienes más horas pendientes, puedes marcar una nueva entrada.'
                            : 'OK'
                    }
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
};

export default NotCheckInDialog;
