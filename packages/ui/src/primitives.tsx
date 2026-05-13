import type { ReactNode } from "react";
import { clsx } from "clsx";
import { designTokens } from "@knit/shared";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({ children, variant = "primary", className }: ButtonProps) {
  return (
    <button
      className={clsx("knit-button", `knit-button-${variant}`, className)}
      style={{
        borderRadius: designTokens.radius.button,
        border: variant === "ghost" ? "1px solid transparent" : `1px solid ${designTokens.colors.border}`
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={clsx("knit-card", className)}
      style={{
        background: designTokens.colors.surface,
        border: `1px solid ${designTokens.colors.border}`,
        borderRadius: designTokens.radius.card
      }}
    >
      {children}
    </section>
  );
}

export function StatusTag({ children, tone = "info" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" }) {
  return (
    <span
      className="knit-status-tag"
      style={{
        color: designTokens.colors[tone],
        borderRadius: designTokens.radius.badge
      }}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="knit-empty-state">
      <div className="knit-empty-line" />
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
