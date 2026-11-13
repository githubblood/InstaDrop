import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalSection } from "@/components/legal/LegalSection";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: `Email ${siteConfig.name} about a broken link, a failed download, a copyright concern or a feature idea.`,
  path: "/contact",
});

// Placeholder inbox - flagged here rather than silently treated as final:
// confirm this is a real, monitored address before launch.
const CONTACT_EMAIL = "support@reelsavenow.com";

const SECTIONS = [
  { id: "how-to-reach-us", label: "How to Reach Us" },
  { id: "what-to-contact-us-about", label: "What to Contact Us About" },
  { id: "copyright-concerns", label: "Copyright Concerns" },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 tracking-tight">Contact</h1>
      </div>

      <LegalPageShell sections={SECTIONS}>
        <LegalSection id="how-to-reach-us" title="How to Reach Us">
          <p>
            You can contact us by email at the address below.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors duration-150 ease-out hover:bg-secondary"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </LegalSection>

        <LegalSection id="what-to-contact-us-about" title="What to Contact Us About">
          <p>A few things people reach out about most:</p>
          <ul className="flex flex-col gap-2 pl-5">
            <li className="list-disc">Something&apos;s broken — a link that won&apos;t resolve, a download that fails, a bug in the app.</li>
            <li className="list-disc">A copyright or content-removal concern — see the dedicated section below.</li>
            <li className="list-disc">General questions about how ReelSaveNow works, or a feature you&apos;d like to see.</li>
          </ul>
          <p>
            If a link or download isn&apos;t working, the{" "}
            <a href="/support#troubleshooting" className="text-primary underline underline-offset-2">
              troubleshooting guide
            </a>{" "}
            on our Support page may solve it faster.
          </p>
          <p>
            We don&apos;t currently offer live chat or a ticketing system; email is the only
            contact option.
          </p>
        </LegalSection>

        <LegalSection id="copyright-concerns" title="Copyright Concerns">
          <p>
            If you believe content accessible through ReelSaveNow infringes your copyright,
            email us with a description of the content and a link to the original
            Instagram post. ReelSaveNow doesn&apos;t control the original Instagram post and
            can&apos;t remove it from Instagram. To have it taken down, report it to Instagram
            or contact the account owner. If you&apos;re not sure how, you can email the
            address shown above.
          </p>
        </LegalSection>
      </LegalPageShell>
    </div>
  );
}
