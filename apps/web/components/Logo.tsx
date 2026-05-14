import Link from "next/link";

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={footer ? "footer-logo" : "brand-logo"} aria-label="秦時線">
      <img src="/brand/qinshixian-logo-official-cropped.png" alt="秦時線" />
    </Link>
  );
}
