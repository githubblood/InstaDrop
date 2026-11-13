"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { FAQ_ENTRIES } from "@/components/marketing/faqData";
import { reveal } from "@/components/motion/ScrollReveal";

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="container pb-16 pt-4 sm:pb-20 sm:pt-6">
      <div {...reveal()} className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
        <span className="text-eyebrow uppercase text-primary">FAQ</span>
        <h2 id="faq-heading" className="text-h2">
          Frequently asked <span className="text-brand-gradient">questions</span>
        </h2>
      </div>

      {/* One card around the list rather than loose rows on the page, so the
          section has an edge and the questions read as one unit. */}
      <div
        {...reveal(1)}
        className="mx-auto mt-10 max-w-3xl rounded-lg border border-border bg-card px-5 shadow-sm sm:px-7"
      >
        <Accordion type="single" collapsible>
          {FAQ_ENTRIES.map((entry) => (
            <AccordionItem key={entry.question} value={entry.question}>
              <AccordionTrigger>{entry.question}</AccordionTrigger>
              {/* keepMounted: every answer is in the server-rendered HTML,
                  matching the FAQPage JSON-LD built from the same list. */}
              <AccordionContent keepMounted>{entry.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <p {...reveal(2)} className="mt-6 text-center text-sm text-muted-foreground">
        Reel not downloading?{" "}
        <Link
          href="/support#troubleshooting"
          className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See the troubleshooting guide
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
