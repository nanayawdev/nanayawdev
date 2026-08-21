"use client";

import { usePathname } from "next/navigation";
import { StaggeredMenu } from "@/components/StaggeredMenu";
import { GithubLogoIcon as Github, InstagramLogoIcon as Instagram, LinkedinLogoIcon as Linkedin, TiktokLogoIcon as TikTok } from "@phosphor-icons/react";

const navigationItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about me", link: "/about" },
  { label: "Services", ariaLabel: "View my services", link: "/services" },
  { label: "Projects", ariaLabel: "View my projects", link: "/projects" },
  { label: "Apps", ariaLabel: "View my apps", link: "/apps" },
  { label: "Resources", ariaLabel: "View resources", link: "/resources" },
  { label: "Start a Project", ariaLabel: "Start a project", link: "/start" },
];

const socialItems = [
  { label: "GitHub", link: "https://github.com/nanayawdev", icon: Github },
  { label: "LinkedIn", link: "https://linkedin.com/in/nanayawdev", icon: Linkedin },
  { label: "Instagram", link: "https://instagram.com/nanayawdev", icon: Instagram },
  { label: "TikTok", link: "https://tiktok.com/@nanayawdev", icon: TikTok },
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
      logoText="nanayaw.dev"
      logoImageSrc="/nanayawdev-logo.png"
      menuButtonColor="var(--foreground)"
      openMenuButtonColor="var(--foreground)"
      changeMenuColorOnOpen={false}
      colors={["#cdf68c", "#0a291a"]}
      accentColor="#cdf68c"
      isFixed
    />
  );
}
