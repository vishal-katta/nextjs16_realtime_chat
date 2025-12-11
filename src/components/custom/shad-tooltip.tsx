import React, {
  forwardRef,
  memo,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export type ShadToolTipType = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  content?: ReactNode | null;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  asChild?: boolean;
  children?: ReactElement;
  delayDuration?: number;
  styleClasses?: string;
  avoidCollisions?: boolean;
  className?: string;
  showArrow?: boolean;
};

// Update to use the Tailwind tooltip colors that reference our CSS variables
const BASE_TOOLTIP_CLASSES =
  "z-[99] max-w-96 rounded-lg text-[12px] bg-foreground text-background backdrop-blur-md";

// Memoize the tooltip content component
const MemoizedTooltipContent = memo(
  forwardRef<
    HTMLDivElement,
    {
      className?: string;
      side?: ShadToolTipType["side"];
      avoidCollisions?: boolean;
      align?: ShadToolTipType["align"];
      children: React.ReactNode;
      collisionPadding?: number;
      sideOffset?: number;
      sticky?: "always" | "partial";
    }
  >((props, ref) => (
    <TooltipContent
      ref={ref}
      className={props.className}
      side={props.side}
      avoidCollisions={props.avoidCollisions}
      align={props.align}
      sticky={props.sticky ?? "partial"}
      forceMount
      sideOffset={typeof props.sideOffset === "number" ? props.sideOffset : 5}
      collisionPadding={props.collisionPadding}
    >
      {props.children}
    </TooltipContent>
  ))
);

MemoizedTooltipContent.displayName = "MemoizedTooltipContent";

// Memoize the main tooltip component
const ShadTooltip = memo(
  forwardRef<HTMLDivElement, ShadToolTipType>(
    (
      {
        content,
        side,
        asChild = true,
        children,
        styleClasses,
        delayDuration = 500,
        open,
        align,
        setOpen,
        avoidCollisions = true,
        className,
      },
      ref
    ) => {
      // Move useMemo calls before the early return
      const tooltipClassName = useMemo(
        () => cn(BASE_TOOLTIP_CLASSES, styleClasses, className),
        [styleClasses, className]
      );

      const tooltipProps = useMemo(
        () => ({
          defaultOpen: !children,
          open,
          onOpenChange: setOpen,
          delayDuration:
            typeof delayDuration === "number" ? delayDuration : 500,
          // Use a shorter delay for closing to improve hover transitions
          skipDelayDuration: 0,
        }),
        [children, open, setOpen, delayDuration]
      );

      // Move early return after hooks
      if (!content) {
        return children;
      }

      return (
        <TooltipProvider disableHoverableContent={false}>
          <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
            <MemoizedTooltipContent
              ref={ref}
              className={tooltipClassName}
              side={side}
              avoidCollisions={avoidCollisions}
              align={align}
              collisionPadding={8}
              sticky="partial"
              sideOffset={5}
            >
              {content}
            </MemoizedTooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  )
);

// Add display name for dev tools
ShadTooltip.displayName = "ShadTooltip";
export default ShadTooltip;
