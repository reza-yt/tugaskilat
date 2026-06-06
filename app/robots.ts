import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/new", "/tasks", "/profile", "/api/", "/admin"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog/", "/pricing"],
        disallow: ["/dashboard", "/new", "/tasks", "/profile", "/api/", "/admin"],
      },
    ],
    sitemap: "https://tugaskilat.web.id/sitemap.xml",
  };
}
