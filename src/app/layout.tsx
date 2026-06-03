import type { Metadata, Viewport } from "next";
import { Poppins, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavigationShell } from "@/components/NavigationShell";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, AUTHOR_NAME } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Cloud Computing",
    "Backend Engineering",
    "System Design",
    "Software Engineering",
    "Distributed Systems",
    "Infrastructure",
    "DevOps",
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${poppins.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          {/* Animated Gradient Mesh Blobs (Softened) */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="blob-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[rgba(126,87,194,0.04)] dark:bg-[rgba(159,134,192,0.03)] blur-[100px]"></div>
            <div className="blob-2 absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full bg-[rgba(224,102,163,0.03)] dark:bg-[rgba(217,122,166,0.02)] blur-[100px]"></div>
            <div className="blob-3 absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-[rgba(246,147,82,0.02)] dark:bg-[rgba(224,159,103,0.02)] blur-[100px]"></div>
          </div>
          
          <ProgressBar />
          <NavigationShell />
          <main className="flex-1 relative z-0">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
