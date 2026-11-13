"use client";

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-5 text-left text-base font-semibold transition-colors duration-150 ease-out hover:text-primary data-[state=open]:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

interface AccordionContentProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  /**
   * Render the panel's content even while it is closed, hidden from view
   * and from assistive technology, so it is in the server-rendered HTML.
   * Radix otherwise leaves a closed panel empty, which made the FAQ's
   * answers exist only in its JSON-LD.
   */
  keepMounted?: boolean;
}

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, keepMounted, ...props }, ref) {
  if (keepMounted) {
    return (
      <AccordionPrimitive.Content
        ref={ref}
        forceMount
        // A closed panel is a 0fr row and visibility:hidden, which keeps it
        // out of the accessibility tree and the tab order just as an
        // unmounted one was. Radix suppresses the animation on first render,
        // so closed panels start collapsed without playing the close.
        className="grid text-body data-[state=closed]:invisible data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr] data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open"
        {...props}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn("pb-5 pr-9 text-muted-foreground", className)}>{children}</div>
        </div>
      </AccordionPrimitive.Content>
    );
  }

  return (
    <AccordionPrimitive.Content
      ref={ref}
      // Radix exposes the measured content height as a CSS custom property
      // (--radix-accordion-content-height) specifically so height:auto can
      // still be animated - see the accordion-down/up keyframes in
      // tailwind.config.ts, same 150-300ms ease-out/ease-in convention as
      // the rest of the app's motion (Dialog, Toast).
      className="overflow-hidden text-body data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-5 pr-9 text-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
