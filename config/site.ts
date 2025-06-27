export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/oi/",
    },
    {
      label: "Notes",
      href: "/course/",
    },
    // {
    //   label: "Research",
    //   href: "/research/",
    // },
    {
      label: "Friends",
      href: "/friends/",
    },
    {
      label: "About",
      href: "/about/",
    },
  ],
  links: {
    github: "https://github.com/memset0/next-blog",
    // twitter: "https://twitter.com/hero_ui",
    // docs: "https://heroui.com",
    // discord: "https://discord.gg/9b6yyZKmH4",
    // sponsor: "https://patreon.com/jrgarciadev",
  },
};
