import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://astro-paper.pages.dev/", // replace this with your deployed domain
  author: "Akari",
  desc: "A minimal, responsive and Moe-Moe blog theme.",
  title: "blog.moe",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/whyakari",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:moenyanuwu@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/whyakari",
    linkTitle: `${SITE.title} on YouTube`,
    active: true,
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/moehacker",
    linkTitle: `${SITE.title} on GitLab`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/whyakari",
    linkTitle: `${SITE.title} on Telegram`,
    active: true,
  },
];
