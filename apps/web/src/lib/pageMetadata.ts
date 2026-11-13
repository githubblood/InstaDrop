import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

interface PageMetadataInput {
  /** The page's own title; the layout's template appends " | ReelSaveNow". */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/support" - also the canonical. */
  path: string;
}

/**
 * Metadata for an indexable page other than the homepage.
 *
 * Next.js doesn't derive og:title or og:description from title/description,
 * and a page without its own openGraph inherits the root layout's whole
 * object - so every page used to share the homepage's social card, og:url
 * included. A page that sets openGraph replaces the layout's entirely, which
 * is why type, siteName and locale are repeated here - and why the image is
 * too: once a page has its own openGraph, Next stops applying the root
 * opengraph-image.tsx to it (checked in the built HTML).
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  const image = { url: "/opengraph-image", type: "image/png", width: 1200, height: 630 };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
