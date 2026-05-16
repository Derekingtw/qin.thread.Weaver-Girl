import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MobileStickyCTA } from "../components/MobileStickyCTA";
import { LanguageProvider, StyleThemeProvider } from "../lib/i18n";

export const metadata: Metadata = {
  title: "秦時線 | 手作委託與織女接單",
  description: "秦時線串起想像與雙手的溫度，從委託到交付，讓每一件手作都被溫柔對待。",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  themeColor: "#3F766F",
  applicationName: "秦時線",
  appleWebApp: {
    capable: true,
    title: "秦時線",
    statusBarStyle: "default"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#FAF7F2" />
        <meta name="theme-color" content="#3F766F" />
      </head>
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
