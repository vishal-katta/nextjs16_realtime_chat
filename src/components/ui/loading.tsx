import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

export function Loading({ 
  message = "Loading...", 
  fullScreen = true,
  overlay = false,
  className 
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Spinner className="size-8" />
      <p className="text-sm text-muted-foreground font-medium">
        {message}
      </p>
    </div>
  );

  if (overlay) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}>
        {content}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "min-h-screen",
        className
      )}
    >
      {content}
    </div>
  );
}
