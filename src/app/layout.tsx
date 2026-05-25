import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

const circular = localFont({
  src: [
    {
      path: "../../public/fonts/circular/CircularStd-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular/CircularStd-Book.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-circular",
});

export const metadata: Metadata = {
  title: {
    default: "Codebase Technologies - Software Development Agency",
    template: "%s | Codebase Technologies"
  },
  description: "A digital agency helping African startups and brands go global through design, development, and storytelling. We empower African brands with world-class digital experiences.",
  keywords: [
    "digital agency",
    "African startups",
    "brand development",
    "web design",
    "mobile apps",
    "UI/UX design",
    "brand identity",
    "motion graphics",
    "API integration",
    "e-commerce",
    "corporate websites",
    "digital platforms",
    "African brands",
    "global expansion"
  ],
  authors: [{ name: "Codebase Technologies Team" }],
  creator: "Codebase Technologies",
  publisher: "Codebase Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://codebase.africa"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codebase.africa",
    title: "Codebase Technologies - Software Development Agency",
    description: "A digital agency helping African startups and brands go global through design, development, and storytelling. We empower African brands with world-class digital experiences.",
    siteName: "Codebase Technologies",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebase Technologies - Software Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codebase Technologies - Software Development Agency",
    description: "A digital agency helping African startups and brands go global through design, development, and storytelling.",
    images: ["/og-image.jpg"],
    creator: "@codebaseafrica",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${circular.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
