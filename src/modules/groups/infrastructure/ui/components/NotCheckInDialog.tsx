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
            <Button className="w-full flex justify-start gap-2 p-[clamp(1rem,1.75rem+1vh,2rem)] text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)]">
                <ListChecks className='size-[clamp(1rem,1.25rem+1dvw,1.5rem)]' />
                Pasar lista
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className={"text-[clamp(0.75rem,1rem+1dvw,1.5rem)]"}>
                    {isEmpty
                        ? 'No has marcado tu entrada'
                        : isAllChecked
                            ? 'No puede pasar lista si ya has marcado tu salida.'
                            : 'OK'
                    }
                </DialogTitle>
                <DialogDescription className={"text-[clamp(0.75rem,0.75rem+1dvw,1.25rem)] text-foreground"}>
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
