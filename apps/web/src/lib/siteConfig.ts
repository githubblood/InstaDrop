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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.reelsavenow.com",
} as const;
