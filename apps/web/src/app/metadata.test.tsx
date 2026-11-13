import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { generateMetadata as homeMetadata } from "@/app/page";
import { metadata as catchAllMetadata } from "@/app/[...url]/page";
import { metadata as privateMetadata } from "@/app/private/page";
import { metadata as supportMetadata } from "@/app/support/page";
import { metadata as contactMetadata } from "@/app/(legal)/contact/page";
import PrivacyPolicyPage, { metadata as privacyMetadata } from "@/app/(legal)/privacy-policy/page";
import TermsPage, { metadata as termsMetadata } from "@/app/(legal)/terms/page";
import manifest from "@/app/manifest";
import { formatLegalDate, PRIVACY_POLICY_UPDATED, TERMS_UPDATED } from "@/lib/legalDates";
import { siteConfig } from "@/lib/siteConfig";

beforeAll(() => {
  // The legal pages' table of contents watches headings as they scroll by.
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

afterEach(cleanup);

describe("page metadata", () => {
  it("gives every indexable page a canonical equal to its sitemap path", () => {
    expect(supportMetadata.alternates?.canonical).toBe("/support");
    expect(contactMetadata.alternates?.canonical).toBe("/contact");
    expect(privacyMetadata.alternates?.canonical).toBe("/privacy-policy");
    expect(termsMetadata.alternates?.canonical).toBe("/terms");
    // The plain homepage inherits the root layout's canonical, "/". (The
    // layout itself loads next/font, which can't run here, so read it.)
    expect(homeMetadata({ searchParams: {} })).toEqual({});
    const layout = fs.readFileSync(path.join(__dirname, "layout.tsx"), "utf8");
    expect(layout).toMatch(/alternates:\s*{\s*canonical:\s*"\/"/);
  });

  // Without their own openGraph/twitter, these pages inherited the root
  // layout's - the homepage's title, description and og:url.
  it("gives every indexable page its own social card, pointing at itself", () => {
    const pages = [
      [supportMetadata, "/support"],
      [contactMetadata, "/contact"],
      [privacyMetadata, "/privacy-policy"],
      [termsMetadata, "/terms"],
    ] as const;
    for (const [meta, pagePath] of pages) {
      const title = `${meta.title as string} | ${siteConfig.name}`;
      expect(meta.openGraph).toMatchObject({
        type: "website",
        url: pagePath,
        siteName: siteConfig.name,
        title,
        description: meta.description,
        locale: "en_US",
      });
      expect(meta.twitter).toMatchObject({ card: "summary_large_image", title, description: meta.description });
      // A page with its own openGraph no longer gets the root
      // opengraph-image.tsx, so the card has to name it.
      const image = { url: "/opengraph-image", width: 1200, height: 630 };
      expect(meta.openGraph?.images).toEqual([expect.objectContaining(image)]);
      expect(meta.twitter?.images).toEqual([expect.objectContaining(image)]);
    }
    const titles = pages.map(([meta]) => meta.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles).not.toContain(siteConfig.title);
  });

  it("targets the agreed search terms in the homepage and Support titles", () => {
    expect(siteConfig.title).toBe("Instagram Reels Downloader — Free, No Login | ReelSaveNow");
    expect(siteConfig.description).toMatch(/^Free Instagram Reels downloader\./);
    expect(supportMetadata.title).toBe("Instagram Reel Not Downloading? Fixes & Help");
    expect(supportMetadata.description).toMatch(/^Instagram Reels downloader not working\?/);
    expect((supportMetadata.description as string).length).toBeLessThanOrEqual(155);
    // Unsupported claims stay out of every title and description.
    const copy = [siteConfig.title, siteConfig.description, supportMetadata.title, supportMetadata.description].join(" ");
    expect(copy).not.toMatch(/4K|1080p|Full HD|high[- ]resolution|watermark/i);
  });

  it("keeps the installed app's name when the search title changes", () => {
    expect(manifest().name).toBe(siteConfig.appName);
    expect(siteConfig.appName).toBe("ReelSaveNow — Instagram Photo & Video Downloader");
  });

  it("marks the utility routes noindex, with no canonical to contradict it", () => {
    const noindex = [
      privateMetadata,
      catchAllMetadata,
      homeMetadata({ searchParams: { url: "https://www.instagram.com/reel/x/" } }),
    ];
    for (const meta of noindex) {
      expect(meta.robots).toEqual({ index: false, follow: false });
      expect(meta.alternates).toEqual({ canonical: null });
    }
  });

  it("shows the legal pages' Last updated date from the module the sitemap reads", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(`Last updated: ${formatLegalDate(PRIVACY_POLICY_UPDATED)}`)).toBeTruthy();
    cleanup();
    render(<TermsPage />);
    expect(screen.getByText(`Last updated: ${formatLegalDate(TERMS_UPDATED)}`)).toBeTruthy();
  });
});
