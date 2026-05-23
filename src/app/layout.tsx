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
    default: "Ananse Digital - Digital Agency for African Startups & Brands",
    template: "%s | Ananse Digital"
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
  authors: [{ name: "Ananse Digital Team" }],
  creator: "Ananse Digital",
  publisher: "Ananse Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://anansedigital.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anansedigital.com",
    title: "Ananse Digital - Digital Agency for African Startups & Brands",
    description: "A digital agency helping African startups and brands go global through design, development, and storytelling. We empower African brands with world-class digital experiences.",
    siteName: "Ananse Digital",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ananse Digital - Where innovation meets imagination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ananse Digital - Digital Agency for African Startups & Brands",
    description: "A digital agency helping African startups and brands go global through design, development, and storytelling.",
    images: ["/og-image.jpg"],
    creator: "@anansedigital",
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
