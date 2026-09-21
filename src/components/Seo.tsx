import { useEffect } from "react";

const SITE_URL = "https://stanleyoseiwusu.com";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "profile";
}

const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}: SeoProps) => {
  useEffect(() => {
    const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
    const canonicalUrl = `${SITE_URL}${normalizedPath}`;

    document.title = title;

    setMeta('meta[name="title"]', "name", "title", title);
    setMeta('meta[name="description"]', "name", "description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", image);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary");
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
  }, [title, description, path, image, type]);

  return null;
};

export default Seo;
