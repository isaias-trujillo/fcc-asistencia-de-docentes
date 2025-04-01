import { Button } from "@/components/ui/button";
import { LoaderCircle, LoaderIcon } from "lucide-react";

const LoadingBlock = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-[clamp(0.5rem,0.5rem+1vh,1rem)]">
      <p className="flex w-full justify-center gap-x-2">
        <LoaderIcon className="animate-spin text-4xl" />
        Cargando
      </p>
      <span>¿Está tardando mucho? Recarga la página.</span>
      <Button onClick={() => window.location.reload()}>
        <LoaderCircle />
        Recargar
      </Button>
    </div>
  );
};

export default LoadingBlock;
