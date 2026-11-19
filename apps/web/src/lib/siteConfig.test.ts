import { afterEach, describe, expect, it, vi } from "vitest";
import { CANONICAL_SITE_URL, resolveSiteUrl } from "@/lib/siteConfig";

// The value production was built with on 2026-11-13: every sitemap <loc>,
// canonical, og:url and JSON-LD url came out naming this host.
const AMPLIFY_DEFAULT_DOMAIN = "https://master.d2tiycb287o9m1.amplifyapp.com";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("resolveSiteUrl", () => {
  it("uses www when the variable is missing or blank", () => {
    expect(CANONICAL_SITE_URL).toBe("https://www.reelsavenow.com");
    expect(resolveSiteUrl(undefined)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl("")).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl("   ")).toBe(CANONICAL_SITE_URL);
  });

  it("never uses Amplify's default domain", () => {
    expect(resolveSiteUrl(AMPLIFY_DEFAULT_DOMAIN)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(`${AMPLIFY_DEFAULT_DOMAIN}/`)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl("https://main.abc123.amplifyapp.com")).toBe(CANONICAL_SITE_URL);
  });

  it("only treats amplifyapp.com itself and its subdomains as Amplify's", () => {
    expect(resolveSiteUrl("https://notamplifyapp.com")).toBe("https://notamplifyapp.com");
  });

  it("keeps another real domain, as just its origin", () => {
    expect(resolveSiteUrl("https://www.reelsavenow.com/")).toBe("https://www.reelsavenow.com");
    expect(resolveSiteUrl(" https://staging.example.com/some/path ")).toBe("https://staging.example.com");
    expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("falls back to www for a value that isn't a web address", () => {
    expect(resolveSiteUrl("www.reelsavenow.com")).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl("ftp://www.reelsavenow.com")).toBe(CANONICAL_SITE_URL);
  });
});

describe("a build with NEXT_PUBLIC_SITE_URL set to the Amplify domain", () => {
  async function loadWith(value: string) {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    const [{ siteConfig }, { default: sitemap }, { default: robots }, { APPLICATION_JSON_LD }] = await Promise.all([
      import("@/lib/siteConfig"),
      import("@/app/sitemap"),
      import("@/app/robots"),
      import("@/lib/structuredData"),
    ]);
    return { siteConfig, sitemap, robots, APPLICATION_JSON_LD };
  }

  it("still lists every sitemap page, and the robots.txt sitemap, on www", async () => {
    const { siteConfig, sitemap, robots, APPLICATION_JSON_LD } = await loadWith(AMPLIFY_DEFAULT_DOMAIN);

    expect(siteConfig.url).toBe("https://www.reelsavenow.com");
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://www.reelsavenow.com",
      "https://www.reelsavenow.com/support",
      "https://www.reelsavenow.com/contact",
      "https://www.reelsavenow.com/privacy-policy",
      "https://www.reelsavenow.com/terms",
    ]);
    expect(robots().sitemap).toBe("https://www.reelsavenow.com/sitemap.xml");
    expect(APPLICATION_JSON_LD.url).toBe("https://www.reelsavenow.com");
    expect(JSON.stringify([sitemap(), robots(), APPLICATION_JSON_LD])).not.toContain("amplifyapp");
  });
});
