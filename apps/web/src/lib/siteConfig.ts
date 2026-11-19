/** The address search engines should index: www, which the apex forwards to (see docs/DEPLOYMENT.md). */
export const CANONICAL_SITE_URL = "https://www.reelsavenow.com";

/**
 * The site URL behind every canonical, og:url, JSON-LD url, sitemap <loc> and
 * the robots.txt Sitemap line. NEXT_PUBLIC_SITE_URL can still point another
 * deployment at its own domain, but Amplify's default *.amplifyapp.com host
 * is never used: production was built with it in November 2026, and every
 * one of those URLs then named it instead of www. Returns the origin only,
 * so a trailing slash or path can't produce "//sitemap.xml".
 */
export function resolveSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return CANONICAL_SITE_URL;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return CANONICAL_SITE_URL;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return CANONICAL_SITE_URL;
  if (parsed.hostname === "amplifyapp.com" || parsed.hostname.endsWith(".amplifyapp.com")) {
    return CANONICAL_SITE_URL;
  }
  return parsed.origin;
}

export const siteConfig = {
  name: "ReelSaveNow",
  // The homepage <title>, og:title and twitter:title. Leads with the search
  // term the homepage targets; see docs/SEO.md for the keyword map.
  title: "Instagram Reels Downloader — Free, No Login | ReelSaveNow",
  // The installed app's name (manifest.ts). Kept apart from `title` so that
  // retuning the search title never renames the app on people's devices.
  appName: "ReelSaveNow — Instagram Photo & Video Downloader",
  description:
    "Free Instagram Reels downloader. Paste a public Reel, video or photo link to save it as MP4 or JPG, or a Reel's audio as MP3. No login required.",
  // Plain-text version of the hero headline - used anywhere that can't
  // render the hero's own styled JSX (e.g. the OG image). The hero's
  // <h1> in DownloaderPage.tsx highlights "Instagram Reels" in its own
  // gradient <span> and is intentionally left as hand-written JSX rather
  // than sourced from this string - if this tagline ever changes, that
  // heading needs a manual matching update.
  tagline: "Download Instagram Reels, videos & photos",
  // www is the canonical host: the apex can't point at Amplify from
  // GoDaddy DNS and is forwarded to www (see docs/DEPLOYMENT.md).
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;
