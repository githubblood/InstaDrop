import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import SupportPage from "@/app/support/page";
import { Faq } from "@/components/marketing/Faq";
import { FeatureList } from "@/components/marketing/FeatureList";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TrustBar } from "@/components/marketing/TrustBar";
import { siteConfig } from "@/lib/siteConfig";

vi.mock("@/components/layout/Navbar", () => ({ Navbar: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ Footer: () => <footer /> }));

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

afterEach(cleanup);

// The backend returns the one rendition Instagram lists for a video, picked
// for having sound rather than for resolution, and nobody has measured what
// resolution that is. Photos and videos reach the user as Instagram's own
// files (streamed, or joined to their sound with ffmpeg -c copy); the MP3 is
// the one re-encode. So copy may say "no added compression" for photos and
// videos, and must not claim a quality level.
const UNVERIFIED = /original quality|original file|full source resolution|highest quality|high[- ]resolution|\b4K\b|1080p|Full HD/i;

describe("quality claims", () => {
  it.each([
    ["TrustBar", () => render(<TrustBar />)],
    ["How it works", () => render(<HowItWorks />)],
    ["feature list", () => render(<FeatureList />)],
    ["FAQ", () => render(<Faq />)],
    ["Support page", () => render(<SupportPage />)],
  ])("%s claims no unmeasured quality level", (_label, renderPart) => {
    const { container } = renderPart();
    expect(container.textContent).not.toMatch(UNVERIFIED);
  });

  it("keeps the metadata free of them too", () => {
    expect(`${siteConfig.title} ${siteConfig.description} ${siteConfig.tagline}`).not.toMatch(UNVERIFIED);
  });

  it("says what is verified instead, scoped to photos and videos", () => {
    expect(render(<TrustBar />).container.textContent).toContain("Instagram-provided files");
    cleanup();
    expect(render(<HowItWorks />).container.textContent).toContain(
      "Photos and videos as Instagram provides them — no added compression."
    );
    cleanup();
    const features = render(<FeatureList />).container.textContent;
    expect(features).toContain("No added compression");
    expect(features).toContain("Photos and videos are the files Instagram provides");
  });
});
