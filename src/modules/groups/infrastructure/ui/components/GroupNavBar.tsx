import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import GroupChip from "./GroupChip";
import Clock from "@/modules/chron/infrastructure/ui/Clock";

const GroupNavBar = ({
  redirectTo = "/cursos",
  groupId,
  onRedirect,
}: {
  redirectTo?: string;
  groupId: string;
  onRedirect?: () => void;
}) => {
  const navigate = useNavigate();
  const onNavigate = () => {
    console.log("onNavigate");
    if (onRedirect) onRedirect();
    navigate(redirectTo);
  };
  // get query params
  return (
    <div className="flex flex-row flex-wrap justify-between max-md:justify-center items-center w-full gap-x-[clamp(1rem,1.25rem+2vh,2rem)] gap-y-2 border p-4 rounded-xl">
      <Button
        onClick={onNavigate}
        className="flex justify-start gap-2 bg-blue-800 text-white hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft /> Retroceder
      </Button>
      <Clock />
      <GroupChip groupId={groupId} />
    </div>
  );
};

export default GroupNavBar;
