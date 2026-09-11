import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { usePointerTilt } from "../hooks/usePointerTilt";

type GlassVariant = "nav" | "button" | "card" | "panel";

type Props = {
  as?: ElementType;
  variant?: GlassVariant;
  interactive?: boolean;
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export function GlassSurface({
  as,
  variant = "panel",
  interactive = false,
  children,
  className = "",
  ...props
}: Props) {
  const Component: any = as ?? "div";
  const surfaceRef = usePointerTilt<HTMLElement>(interactive);
  const classes = `glass-surface glass-${variant} ${interactive ? "is-interactive" : ""} ${className}`.trim();
  return <Component ref={surfaceRef} className={classes} {...props}>{children}</Component>;
}
