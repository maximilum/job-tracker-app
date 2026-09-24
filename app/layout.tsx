// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import type { Metadata } from "next";
<<<<<<< HEAD
import { Alexandria, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
=======
import { IBM_Plex_Sans_Arabic, Tomorrow, BioRhyme, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
>>>>>>> ccb1c11ea94338212a2e026e84cdf9c48228e0cf

const fontSans = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "متتبع الوظائف | Job Tracker",
  description: "تتبع طلبات التوظيف الخاصة بك - Track Your Job Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('app_lang');
                if (saved === 'en') {
                  document.documentElement.lang = 'en';
                  document.documentElement.dir = 'ltr';
                } else {
                  document.documentElement.lang = 'ar';
                  document.documentElement.dir = 'rtl';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
<<<<<<< HEAD
        className={`${fontSans.className} ${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-x-hidden`}
=======
        className={`${fontArabic.variable} ${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased overflow-x-hidden`}
>>>>>>> ccb1c11ea94338212a2e026e84cdf9c48228e0cf
      >
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
