"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { StaggeredMenu } from "@/components/StaggeredMenu";

const navigationItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about me", link: "/about" },
  { label: "Services", ariaLabel: "View my services", link: "/services" },
  { label: "Projects", ariaLabel: "View my projects", link: "/projects" },
  { label: "Resources", ariaLabel: "View resources", link: "/resources" },
  { label: "Start a Project", ariaLabel: "Start a project", link: "/start" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com/nanayawdev" },
  { label: "GitHub", link: "https://github.com/nanayawdev" },
  { label: "LinkedIn", link: "https://linkedin.com/in/nanayawdev" },
  { label: "Instagram", link: "https://instagram.com/nanayawdev" },
];

export function Navbar() {
  const pathname = usePathname();

  // Hide navbar on the /start page
  if (pathname === "/start") return null;

  return (
    <StaggeredMenu
      position="right"
      items={navigationItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      logoText="nanayawdev"
      headerExtra={<ThemeToggle />}
      menuButtonColor="var(--foreground)"
      openMenuButtonColor="var(--foreground)"
      changeMenuColorOnOpen={false}
      colors={["#9b5de5", "#2d1b4e"]}
      accentColor="#542e7b"
      isFixed
    />
  );
}
