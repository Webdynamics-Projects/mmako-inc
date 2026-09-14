/**
 * Marketing copy, kept out of the components so the client can revise wording
 * without touching layout code.
 */

export const valueStrip = [
  { label: "Clear Advice", detail: "Straight answers, no jargon", icon: "clarity" },
  {
    label: "Business-Minded",
    detail: "Recommendations weighed against your commercial goals",
    icon: "compass",
  },
  { label: "Fast Turnaround", detail: "Modern tools, quick responses", icon: "speed" },
  {
    label: "Strong Advocacy",
    detail: "Firm representation when it counts",
    icon: "shield",
  },
] as const;

export const clientTypes = [
  {
    title: "Startups & Founders",
    detail: "Getting the legal basics right from day one",
  },
  {
    title: "Scaling Businesses",
    detail: "Building legal foundations that support growth",
  },
  {
    title: "Established Companies",
    detail: "Ongoing compliance and strategic advice",
  },
  {
    title: "Individuals in Disputes",
    detail: "Practical, determined representation",
  },
] as const;

export const services = [
  {
    number: "01",
    title: "Business & Corporate Advisory",
    description: "Solid foundations for modern enterprises — structured to scale.",
    items: [
      "Company formation",
      "Structuring & restructuring",
      "Shareholder agreements",
      "Corporate governance",
    ],
  },
  {
    number: "02",
    title: "Commercial Contracts",
    description:
      "Agreements that protect your interests without slowing the deal down.",
    items: [
      "Bespoke contract drafting",
      "Review & risk analysis",
      "Contract negotiation",
      "Terms of service & privacy policies",
    ],
  },
  {
    number: "03",
    title: "Dispute Resolution & Litigation",
    description:
      "Firm representation when things go wrong, resolved as efficiently as possible.",
    items: [
      "Contract & commercial disputes",
      "Debt recovery",
      "Business & shareholder disputes",
      "Alternative dispute resolution",
    ],
  },
  {
    number: "04",
    title: "Ongoing Legal Support",
    description:
      "Your external in-house counsel — support before issues become problems.",
    items: [
      "Monthly retainers",
      "Preventative legal support",
      "On-demand advisory access",
      "Compliance checks",
    ],
  },
] as const;

export const whyMmako = [
  "Clear, practical advice",
  "Fast response times",
  "Commercially-minded thinking",
  "Straightforward communication, always",
] as const;

export const process = [
  {
    step: "01",
    title: "Get the full picture",
    detail: "We start by understanding your situation properly",
  },
  {
    step: "02",
    title: "Map the risk and the options",
    detail: "You get a clear view of where you stand",
  },
  {
    step: "03",
    title: "Move with a plan",
    detail: "We act decisively toward the outcome you need",
  },
] as const;

export const philosophy = [
  {
    title: "Plain language first",
    detail: "We explain what matters in terms you can actually act on.",
  },
  {
    title: "Commercial judgment",
    detail:
      "Every recommendation is weighed against what it means for your business, not just the legal technicality.",
  },
  {
    title: "Advocacy that holds up",
    detail: "When a matter turns adversarial, we push hard for a fair outcome.",
  },
  {
    title: "Real access to your lawyer",
    detail: "You shouldn't have to wait days for an update.",
  },
] as const;

export const notTraditional = [
  {
    title: "Plain English, always",
    detail: "You'll always know where you stand and what your options are.",
  },
  {
    title: "Built for speed",
    detail:
      "We use modern tools and processes so our turnaround matches the pace you're operating at.",
  },
  {
    title: "Paid for results, not hours",
    detail:
      "We focus on solving your problem efficiently, not running up billable time.",
  },
] as const;
