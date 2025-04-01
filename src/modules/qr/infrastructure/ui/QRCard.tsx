import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import SmallQRCode from "@/modules/qr/infrastructure/ui/SmallQRCode.tsx";
import QRDialog from "@/modules/qr/infrastructure/ui/QRDialog.tsx";
// import QRPreferences from "./QRPreferences";

const QRCard = () => {
  return (
    <Card className="flex flex-row max-md:flex-wrap justify-between gap-[clamp(1rem,1.25rem+2vw,1.5rem)] bg-white text-black max-xl:min-w-fit">
      <CardHeader className={"flex flex-col justify-between gap-2"}>
        <CardTitle className={"text-[clamp(1rem,1rem+1vw,1.5rem)]"}>
          Pide a tus alumnos que escaneen el QR para marcar su asistencia
        </CardTitle>
        <CardDescription
          className={"text-[clamp(0.75rem,0.75rem+1vw,1rem)] text-black"}
        >
          <QRDialog />
        </CardDescription>
        {/* <QRPreferences /> */}
      </CardHeader>
      <CardContent
        className={
          "flex flex-col flex-wrap items-center justify-evenly grow gap-[clamp(1rem,1.25rem+2vw,1.5rem)]"
        }
      >
        <SmallQRCode />
      </CardContent>
    </Card>
  );
};

export default QRCard;
