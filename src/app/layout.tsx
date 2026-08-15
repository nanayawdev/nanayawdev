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

const ragick = localFont({
  src: [
    {
      path: "../../public/fonts/ragick/Ragick-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ragick/Ragick-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ragick",
});

export const metadata: Metadata = {
  title: {
    default: "nanayawdev - Software Engineer",
    template: "%s | nanayawdev"
  },
  description: "I'm a software engineer helping startups and brands go global through design, development, and storytelling. I empower brands with world-class digital experiences.",
  keywords: [
    "software engineer",
    "web design",
    "mobile apps",
    "UI/UX design",
    "brand identity",
    "motion graphics",
    "API integration",
    "e-commerce",
    "corporate websites",
    "digital platforms",
    "portfolio",
    "freelance developer"
  ],
  authors: [{ name: "nanayawdev" }],
  creator: "nanayawdev",
  publisher: "nanayawdev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nanayawdev.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nanayawdev.com",
    title: "nanayawdev - Software Engineer",
    description: "I'm a software engineer helping startups and brands go global through design, development, and storytelling. I empower brands with world-class digital experiences.",
    siteName: "nanayawdev",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "nanayawdev - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nanayawdev - Software Engineer",
    description: "I'm a software engineer helping startups and brands go global through design, development, and storytelling.",
    images: ["/og-image.jpg"],
    creator: "@nanayawdev",
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
      <body className={`${circular.variable} ${ragick.variable} antialiased`}>
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
