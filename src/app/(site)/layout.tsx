import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { AdSenseScript } from "@/components/adsense-script";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseScript />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
