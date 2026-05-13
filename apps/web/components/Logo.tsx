import Link from "next/link";

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={footer ? "footer-logo" : "brand-logo"} aria-label="秦時線首頁">
      <img src="/brand/qinshixian-logo.svg" alt="秦時線" />
    </Link>
  );
}
