import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "ParkSmart AI Docs",
  tagline: "Intelligent Parking Management System",
  url: "https://parksmart.example.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Unosquare.`,
      style: "dark",
    },
    navbar: {
      items: [],
      title: "ParkSmart AI",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
