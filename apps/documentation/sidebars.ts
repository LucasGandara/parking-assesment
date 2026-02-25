import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      type: "category",
      label: "📋 Specifications",
      items: [
        {
          type: "category",
          label: "Auth",
          items: [
            "specs/auth/layout",
            "specs/auth/login",
            "specs/auth/registration",
            "specs/auth/routing",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
