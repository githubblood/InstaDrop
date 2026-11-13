export interface FaqEntry {
  question: string;
  answer: string;
}

// Plain data, deliberately in its own non-"use client" module - both the
// server-rendered app/page.tsx (FAQPage JSON-LD) and the client-rendered
// Faq.tsx (the accordion UI) import this same list, so the visible copy
// and the structured data can never drift apart. Re-exporting it through
// Faq.tsx (a "use client" file) instead broke the server build: Next
// treats every export of a "use client" module as a client reference,
// so page.tsx's server-side .map() over it failed at build time.
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: "Is ReelSaveNow free?",
    answer: "Yes, completely. No hidden tiers, no paywalls.",
  },
  {
    question: "How do I download an Instagram Reel?",
    answer:
      "Copy the Reel's link — tap Share, then Copy link in the Instagram app, or use the ⋯ menu on instagram.com. Paste it into the box at the top of this page and press Download. The Reel saves to your device as an MP4 file.",
  },
  {
    question: "Do I need to log in or install an app?",
    answer:
      "No. ReelSaveNow works in your web browser on phones, tablets and computers — no account, no sign-in and nothing to install. You can add it to your home screen for quicker access.",
  },
  {
    question: "What can I download?",
    answer:
      "Public Instagram Reels, video posts, IGTV videos, photos and carousel posts — and the audio of a Reel or video, saved as MP3. Stories, Highlights and profile links aren't supported.",
  },
  {
    question: "Can I download just the audio of a Reel as MP3?",
    answer:
      "Yes. Under the preview of a Reel or video, press Download Audio (MP3) to save only its sound. It's for personal use: the music in a Reel usually belongs to its artists and labels. When Instagram has muted a Reel, usually for licensed music, there is no sound to save, so the button is greyed out and the preview shows Instagram's reason.",
  },
  {
    question: "Can I download Reels from a private account?",
    answer:
      "ReelSaveNow's downloader works with public posts only, and it can't be used to see or save anyone else's private content. If your own account is public, your Reels download like any other public Reel.",
  },
  {
    question: "Is the video or photo quality reduced?",
    answer:
      "ReelSaveNow downloads the file Instagram provides and doesn't re-compress or resize it, so the quality you get depends on that source file. There's one downloadable version of each video, so there's no quality picker.",
  },
  {
    question: "Is there a faster way to use ReelSaveNow?",
    answer:
      "Yes. If you already have an Instagram link copied, you can skip the homepage entirely — just type reelsavenow.com/ directly before the link in your browser's address bar and press enter. You'll land straight on the preview and download screen.",
  },
  {
    question: "Why isn't my Instagram Reel downloading?",
    answer:
      "Usually because the post is from a private account, the link was copied only partly, or too many requests were made in a short time. The Support page lists every message the site shows and what to do about each one.",
  },
];
