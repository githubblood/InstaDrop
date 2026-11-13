import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SupportPage from "@/app/support/page";

// The header and footer have their own tests; here they only need to exist.
vi.mock("@/components/layout/Navbar", () => ({ Navbar: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ Footer: () => <footer /> }));

afterEach(cleanup);

function headings(level: number) {
  return screen.getAllByRole("heading", { level }).map((heading) => heading.textContent);
}

describe("Support page", () => {
  it("explains every service and feature it was asked to cover", () => {
    render(<SupportPage />);
    expect(headings(1)).toEqual(["Reel not downloading? We can help."]);
    expect(headings(3)).toEqual(
      expect.arrayContaining([
        "Instagram Reels",
        "Photos",
        "Videos",
        "Carousels",
        "No added compression",
        "No login required",
        "Phones and tablets",
        "Laptops and desktops",
      ])
    );
    expect(headings(2)).toContain("Instagram Reels downloader not working?");
  });

  // Most visitors arrive because something failed, so the fixes come first,
  // and the section links follow the page.
  it("puts Troubleshooting first, in the page and in its section links", () => {
    const { container } = render(<SupportPage />);
    const sectionIds = Array.from(container.querySelectorAll("main section[id]")).map((section) => section.id);
    expect(sectionIds).toEqual(["troubleshooting", "downloads", "how-it-works", "devices"]);
    const anchorIds = Array.from(container.querySelectorAll('nav[aria-label="On this page"] a')).map((anchor) =>
      anchor.getAttribute("href")!.slice(1)
    );
    expect(anchorIds).toEqual(sectionIds);
  });

  // Troubleshooting quotes the messages the site really shows, so a reader
  // can match what is on their screen.
  it("quotes the site's own messages in Troubleshooting", () => {
    const { container } = render(<SupportPage />);
    for (const message of [
      "Please paste a valid public Instagram post, reel, or IGTV link.",
      "This content is from a private Instagram account and cannot be processed.",
      "This post could not be found. It may have been deleted or the link is incorrect.",
      "Could not download this media right now. Please try again.",
      "This is taking longer than usual. Please try again in a moment.",
    ]) {
      expect(container.textContent).toContain(message);
    }
  });

  it("does not promise what the app cannot do", () => {
    const { container } = render(<SupportPage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Stories and Highlights aren't supported");
    expect(text).not.toMatch(/download (all|everything) at once|private accounts? (are|is) supported/i);
  });

  it("jumps to each section and links on to Contact and the downloader", () => {
    const { container } = render(<SupportPage />);
    const anchors = Array.from(container.querySelectorAll('nav[aria-label="On this page"] a'));
    for (const anchor of anchors) {
      const id = anchor.getAttribute("href")!.slice(1);
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(anchors).toHaveLength(4);
    expect(screen.getByRole("link", { name: /Contact us/ }).getAttribute("href")).toBe("/contact");
    expect(screen.getByRole("link", { name: "Back to the Reels downloader" }).getAttribute("href")).toBe("/");
  });
});
