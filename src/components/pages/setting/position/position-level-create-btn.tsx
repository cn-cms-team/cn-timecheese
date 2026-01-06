import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PositionLevelCreateBtn = ({ onAppend } : { onAppend : () => void }) => {
  return (
    <div>
      <Button
        type="button"
        size={'xs'}
        onClick={onAppend}
      >
        <Plus size={15} />
      </Button>
    </div>
  );
};

export default PositionLevelCreateBtn