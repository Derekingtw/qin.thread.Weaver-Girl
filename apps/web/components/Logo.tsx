import Link from "next/link";
import type { StyleTheme } from "../lib/i18n";

type LogoProps = {
  variant?: "full" | "compact";
  size?: "sm" | "md" | "lg";
  theme?: StyleTheme;
  mode?: "light" | "dark";
  clickable?: boolean;
  footer?: boolean;
};

const logoSrcByMode = {
  light: "/brand/qinshixian-logo-main.png",
  dark: "/brand/qinshixian-logo-main-dark.png"
};

export function Logo({
  variant = "full",
  size = "md",
  mode = "light",
  clickable = true,
  footer = false
}: LogoProps) {
  const className = [
    footer ? "footer-logo" : "brand-logo",
    `logo-${variant}`,
    `logo-${size}`
  ].join(" ");
  const image = <img src={logoSrcByMode[mode]} alt="秦時線" loading="eager" />;

  if (!clickable) {
    return <span className={className} aria-label="秦時線">{image}</span>;
  }

  return (
    <Link href="/" className={className} aria-label="秦時線">
      {image}
    </Link>
  );
}
