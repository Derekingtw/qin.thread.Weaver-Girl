import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MobileStickyCTA } from "../components/MobileStickyCTA";
import { LanguageProvider, StyleThemeProvider } from "../lib/i18n";

export const metadata: Metadata = {
  title: "秦時線 | 手作委託與自營選品",
  description: "秦時線串起想像與雙手的溫度，提供手作委託、作品驗收、交易保障與自營選品服務。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <LanguageProvider>
          <StyleThemeProvider>
            <div className="shell">
              <Header />
              {children}
              <Footer />
              <MobileStickyCTA />
            </div>
          </StyleThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
