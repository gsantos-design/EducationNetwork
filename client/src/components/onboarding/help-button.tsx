import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HelpButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  tooltipText?: string;
}

export default function HelpButton({
  className = "",
  variant = "outline",
  size = "icon",
  tooltipText = "Start Tutorial"
}: HelpButtonProps) {
  const { startOnboarding } = useOnboarding();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`${className} relative group`}
            onClick={startOnboarding}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}