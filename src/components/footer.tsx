export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Devs & Creatives</h3>
            <p className="text-muted-foreground">
              A digital agency helping African startups and brands go global through design, development, and storytelling.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/services/web-development" className="hover:text-foreground transition-colors">Web Development</a></li>
              <li><a href="/services/ui-ux-design" className="hover:text-foreground transition-colors">UI/UX Design</a></li>
              <li><a href="/services/mobile-apps" className="hover:text-foreground transition-colors">Mobile Apps</a></li>
              <li><a href="/services/brand-identity" className="hover:text-foreground transition-colors">Brand Identity</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</a></li>
              <li><a href="/case-studies" className="hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://twitter.com/devsandcreatives" className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="https://linkedin.com/company/devsandcreatives" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="/resources" className="hover:text-foreground transition-colors">Resources</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Devs & Creatives. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
