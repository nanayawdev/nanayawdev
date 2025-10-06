import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="text-center">
        <h1 className="text-5xl text-foreground mb-4">
          Devs & Creatives
        </h1>
      </main>
    </div>
  );
}
