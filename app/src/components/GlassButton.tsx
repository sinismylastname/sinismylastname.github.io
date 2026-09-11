import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { GlassSurface } from "./GlassSurface";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;

export function GlassButton({ children, href, className = "", ...props }: Props) {
  const target = href ? "a" : "button";
  const content = <span className="glass-button-label">{children}</span>;
  if (href) {
    return <GlassSurface as={target} variant="button" interactive className={`glass-button ${className}`} href={href} {...props}>{content}</GlassSurface>;
  }
  return <GlassSurface as={target} variant="button" interactive className={`glass-button ${className}`} {...props}>{content}</GlassSurface>;
}
