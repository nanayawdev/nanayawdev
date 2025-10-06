import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-foreground">
              Devs & Creatives
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </a>
              <a href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
