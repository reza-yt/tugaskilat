import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/new", "/tasks", "/profile", "/api/"],
    },
    sitemap: "https://tugaskilat.web.id/sitemap.xml",
  };
}
