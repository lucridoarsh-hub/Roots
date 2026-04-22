import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.enduringroots.in/",
      lastModified: new Date(),
    },
    {
      url: "https://www.enduringroots.in/about",
      lastModified: new Date(),
    },
    {
      url: "https://www.enduringroots.in/blog",
      lastModified: new Date(),
    },
    {
      url: "https://www.enduringroots.in/contact",
      lastModified: new Date(),
    },
    {
      url: "https://www.enduringroots.in/pricing",
      lastModified: new Date(),
    },
  ];
}