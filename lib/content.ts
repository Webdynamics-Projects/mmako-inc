export const services = [
  {
    number: "01",
    title: "Legal and Corporate Advisory",
    description: "Solid foundations for modern enterprises — structured to scale.",
    items: [
      "Company incorporation",
      "Corporate restructuring",
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

/* Copy is from the client's own profile. Photos live in
   public/team. */
export const team = [
  {
    name: "Dalen Mmako",
    role: "Founder & Director",
    photo: { src: "/team/dalen-mmako.jpg", width: 1088, height: 1445 },
    bio: [
      "Dalen Mmako is an attorney of the High Court of South Africa and the Founder and Director of Mmako Inc.",
      "Dalen’s practice focuses on commercial litigation and arbitration, contractual disputes, insolvency and creditor enforcement, and corporate and commercial advisory. He has acted in High Court proceedings, liquidation applications, contractual enforcement matters and complex commercial disputes involving significant financial and commercial interests.",
      "Dalen approaches each matter with a clear understanding of the client’s objectives and the commercial context in which the issue arises. His advice is focused on identifying the legal and commercial risks, evaluating the available options and determining the most effective course of action, whether through litigation, negotiation, restructuring, mediation or arbitration.",
      "Dalen holds a BA Law, LLB and Postgraduate Diploma in Entrepreneurship from the University of Pretoria. His experience in legal practice, commercial risk, restructuring and recoveries, together with his entrepreneurial background, informs the approach behind Mmako Inc — providing technically sound legal advice that is practical, commercially grounded and responsive to the realities facing clients.",
      "Beyond legal practice, Dalen is involved in youth development through the Dalen Mmako Foundation, which uses sport to create opportunities for young people.",
    ],
  },
] as const;
