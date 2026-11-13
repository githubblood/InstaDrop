import { renderToString } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CookieHelpGuide } from "@/components/private/CookieHelpGuide";
import { Faq } from "@/components/marketing/Faq";
import { FAQ_ENTRIES } from "@/components/marketing/faqData";

afterEach(cleanup);

// What the server sends, with React's text escaping undone so it can be
// compared with the plain strings in faqData.
function serverHtml() {
  return renderToString(<Faq />)
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

describe("FAQ", () => {
  it("puts every answer in the server-rendered HTML, not only in the JSON-LD", () => {
    const html = serverHtml();
    for (const entry of FAQ_ENTRIES) expect(html).toContain(entry.answer);
  });

  it("server-renders every panel closed and hidden", () => {
    render(<Faq />);
    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(FAQ_ENTRIES.length);
    for (const trigger of triggers) {
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      // Radix sets aria-controls only while a panel is open; the panel is a
      // region labelled by its trigger either way.
      const panel = document.querySelector(`[role="region"][aria-labelledby="${trigger.id}"]`)!;
      expect(panel.getAttribute("data-state")).toBe("closed");
      // visibility:hidden keeps a closed answer out of the accessibility
      // tree and the tab order, as an unmounted one was.
      expect(panel.className).toContain("data-[state=closed]:invisible");
    }
  });

  it("still opens one answer at a time and closes it again", () => {
    render(<Faq />);
    const [first, second] = screen.getAllByRole("button");
    fireEvent.click(first!);
    expect(first!.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(second!);
    expect(first!.getAttribute("aria-expanded")).toBe("false");
    expect(second!.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(second!);
    expect(second!.getAttribute("aria-expanded")).toBe("false");
  });

  it("links on to the Support page's troubleshooting", () => {
    render(<Faq />);
    const link = screen.getByRole("link", { name: /troubleshooting guide/i });
    expect(link.getAttribute("href")).toBe("/support#troubleshooting");
  });

  it("makes no unsupported quality, watermark or private-content promises", () => {
    const text = FAQ_ENTRIES.map((entry) => `${entry.question} ${entry.answer}`).join(" ");
    expect(text).not.toMatch(/4K|1080p|Full HD|high[- ]resolution|remove (the )?watermark/i);
    const quality = FAQ_ENTRIES.find((entry) => entry.question === "Is the video or photo quality reduced?");
    expect(quality?.answer).not.toMatch(/^No\b/);
    expect(quality?.answer).toContain("depends on that source file");
    const privateAnswer = FAQ_ENTRIES.find((entry) => entry.question.includes("private account"))?.answer;
    expect(privateAnswer).toContain("public posts only");
  });
});

// keepMounted is opt-in: the other accordions keep Radix's default, an empty
// closed panel.
describe("other accordions", () => {
  it("leave a closed panel's content out, as before", () => {
    const html = renderToString(<CookieHelpGuide />);
    expect(html).toContain("How do I find my session cookie?");
    expect(html).not.toContain("sessionid");
  });
});
