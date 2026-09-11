import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { GlassSurface } from "./GlassSurface";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;

export function GlassButton({ children, href, className = "", ...props }: Props) {
  if (href) {
    return <GlassSurface as="a" variant="button" interactive className={`glass-button ${className}`} href={href} {...props}>{children}</GlassSurface>;
  }
  return <GlassSurface as="button" variant="button" interactive className={`glass-button ${className}`} {...props}>{children}</GlassSurface>;
}
