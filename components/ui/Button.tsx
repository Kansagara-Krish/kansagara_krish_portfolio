import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-text text-bg hover:bg-muted border-transparent",
  secondary: "bg-surface text-text border-border hover:border-text/30",
  ghost: "bg-transparent text-text border-transparent hover:bg-border/30",
  danger: "bg-red-700 text-white border-transparent hover:bg-red-800",
  outline: "bg-transparent text-text border-border hover:border-text"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  xl: "h-14 px-8 text-base",
  icon: "h-10 w-10 p-0"
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedProps & {
    href?: undefined;
  };

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  SharedProps & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", icon, className, children } = props;
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-60 transition-colors",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {icon}
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    variant: _v2,
    size: _s2,
    icon: _i2,
    className: _c2,
    children: _ch2,
    ...buttonProps
  } = props as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {icon}
      {children}
    </button>
  );
}
