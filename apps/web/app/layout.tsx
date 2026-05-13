import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LanguageProvider } from "../lib/i18n";

export const metadata: Metadata = {
  title: "秦時線 | 手作委託平台",
  description: "秦時線是溫暖、可信任的手作委託與平台自營商品服務。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <LanguageProvider>
          <div className="shell">
            <Header />
            {children}
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
