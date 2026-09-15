/**
 * Brand strategy content.
 *
 * Synthesised from the firm's own approved website copy — the four value
 * propositions, the philosophy section and the "not the traditional firm"
 * section. Nothing here introduces a claim, credential or capability the firm
 * has not already published about itself. It still needs the client's sign-off
 * before it becomes the governing brand document.
 */

export const overview = `Mmako Inc. is a South African business law firm built for the pace at which
modern business actually operates. The firm works with founders, growing companies, established
businesses and individuals in disputes, across corporate advisory, commercial contracts, dispute
resolution and ongoing legal support.

The brand exists to close a specific gap: legal counsel that is genuinely useful to a commercial
decision-maker. Not counsel buried in jargon, not counsel billed by the hour regardless of outcome,
and not counsel that takes days to reach. Every expression of the brand — from a letter of demand
to a social post — should leave the reader knowing exactly where they stand and what happens next.`;

export const personality = [
  {
    trait: "Direct",
    is: "Says the thing plainly, including when the answer is unwelcome. Leads with the conclusion.",
    isNot: "Blunt for its own sake, or dismissive of a client's concern.",
  },
  {
    trait: "Commercial",
    is: "Weighs every recommendation against what it means for the business, not just the legal technicality.",
    isNot: "Cavalier about legal risk, or willing to trade away a client's position for speed.",
  },
  {
    trait: "Responsive",
    is: "Moves at the client's pace. Acknowledges quickly, and says when a full answer will land.",
    isNot: "Reactive or rushed — speed never comes at the cost of getting it right.",
  },
  {
    trait: "Assured",
    is: "Confident in its own judgment. Comfortable making a recommendation rather than listing options.",
    isNot: "Boastful. The brand never claims accolades, rankings or credentials it has not earned.",
  },
];

export const values = [
  {
    name: "Clarity",
    line: "Plain language first.",
    body: "We explain what matters in terms the client can act on. If a sentence needs a legal dictionary, it gets rewritten.",
  },
  {
    name: "Commercial judgment",
    line: "Advice weighed against the business.",
    body: "Every recommendation is measured against what it means commercially, not only what the law permits.",
  },
  {
    name: "Advocacy",
    line: "Representation that holds up.",
    body: "When a matter turns adversarial, we push hard for a fair outcome and say so plainly from the outset.",
  },
  {
    name: "Access",
    line: "Real access to your lawyer.",
    body: "Clients should not wait days for an update. Reachability is a service standard, not a courtesy.",
  },
];

export const positioning = {
  statement: `For founders, growing companies and individuals who need legal support that keeps pace with
their business, Mmako Inc. is a modern South African business law firm that gives clear, fast,
outcome-focused counsel. Unlike traditional firms that bill by the hour and communicate in legalese,
Mmako Inc. is paid for solving the problem and explains everything in plain English.`,
  audiences: [
    { name: "Startups & founders", need: "Getting the legal basics right from day one, without a firm's overhead." },
    { name: "Scaling businesses", need: "Legal foundations that support growth rather than slow it down." },
    { name: "Established companies", need: "Ongoing compliance and strategic advice from counsel who knows the business." },
    { name: "Individuals in disputes", need: "Practical, determined representation and a straight answer on their prospects." },
  ],
  differentiators: [
    "Plain English, always — the client always knows where they stand and what their options are.",
    "Built for speed — modern tools and processes, so turnaround matches the client's pace.",
    "Paid for results, not hours — focused on solving the problem efficiently.",
    "Commercially-minded thinking, applied to every recommendation.",
  ],
};

export const voice = {
  principles: [
    { rule: "Lead with the answer.", why: "Put the conclusion in the first sentence, then the reasoning. A client reading on their phone should get the answer before they scroll." },
    { rule: "Write the way you would explain it out loud.", why: "If you would not say it to the client across a desk, do not write it." },
    { rule: "Prefer the short word.", why: "Use, not utilise. Start, not commence. About, not in relation to." },
    { rule: "Be specific about what happens next.", why: "Every piece of client communication ends with a concrete next step and, where relevant, a date." },
    { rule: "Never oversell.", why: "No rankings, awards, superlatives or claims the firm cannot substantiate. Confidence comes from precision, not adjectives." },
  ],
  rewrites: [
    {
      before: "We are pleased to advise that we have given consideration to the aforementioned matter and are of the view that there may potentially be merit in pursuing the matter further.",
      after: "You have a strong claim. We recommend sending a letter of demand this week.",
    },
    {
      before: "Kindly note that same shall be attended to in due course.",
      after: "We will have this back to you by Thursday.",
    },
    {
      before: "Mmako Inc. is a premier, award-winning law firm delivering world-class legal solutions.",
      after: "Mmako Inc. is a business law firm. We give founders and growing companies clear, fast legal support.",
    },
  ],
  vocabulary: {
    use: ["clear", "practical", "commercial", "straightforward", "outcome", "plainly", "where you stand"],
    avoid: ["bespoke solutions", "leverage", "synergy", "world-class", "premier", "cutting-edge", "kindly note", "aforementioned", "herewith"],
  },
};

export const namingRule = `The firm is **Mmako Inc.** everywhere — in the logo and in writing. Page titles, email
signatures, letterheads, invoices, legal documents and social posts all use Mmako Inc.

**Mmako Incorporated** is the full legal entity. Use it in copyright lines, contractual documents
and the email confidentiality notice, and nowhere else.

The logo's wordmark reads MMAKO INC. in capitals. That is artwork, not type: it appears only as the
supplied logo files and is never retyped, reset in a font, or written in capitals in running text.

The firm has previously been referred to as "Mmako Law". That name is retired. It should not appear
in any new asset, document or post.`;
