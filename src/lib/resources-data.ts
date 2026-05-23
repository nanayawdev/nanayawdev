export interface Resource {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  image: string;
  featured?: boolean;
  body: string;
}

export const resources: Resource[] = [
  {
    slug: "why-african-brands-need-digital-first-strategy",
    title: "Why African Brands Need a Digital-First Strategy in 2025",
    excerpt: "The global market is watching Africa. Here's how to make sure your brand is ready when opportunity knocks.",
    date: "May 14, 2025",
    author: "Kwame Asante",
    authorRole: "Founder & Creative Director",
    category: "Strategy",
    image: "/hero1.avif",
    featured: true,
    body: `The African digital economy is growing faster than any other region in the world. Mobile penetration, improved infrastructure, and a young, connected population are creating a once-in-a-generation window for brands to build global audiences from a local base.

But many African brands are still operating with a traditional mindset — waiting until they have "enough" before investing in their digital presence. That thinking is costly.

## The cost of waiting

Every month without a clear digital strategy is a month your competitors are building an audience you could have had. Search rankings take time. Brand recognition takes time. Content authority takes time.

The brands winning today started building two, three years ago. The brands who will win in 2027 are starting right now.

## What a digital-first strategy actually means

Digital-first doesn't mean abandoning offline channels. It means making digital the backbone of how you communicate, sell, and build trust — then using offline to deepen those relationships.

Practically, it means:
- A website that converts, not just one that exists
- Content that answers the questions your customers are already asking
- A brand identity that reads clearly on a phone screen
- Systems that let customers find you, understand you, and pay you — without friction

## Where to start

Start with clarity. Before you build anything, answer: who are we for, what problem do we solve, and why should anyone trust us? Get those answers sharp, then build the digital layer on top.

That's the work we do at Ananse Digital. And it's never too late to start.`,
  },
  {
    slug: "design-systems-for-startups",
    title: "Design Systems for Startups: When to Build, When to Wait",
    excerpt: "A design system is a powerful investment — but only at the right stage. Here's how to know when you're ready.",
    date: "April 28, 2025",
    author: "Kofi Mensah",
    authorRole: "UI/UX Designer",
    category: "Design",
    image: "/hero2.avif",
    body: `Design systems are having a moment. Every design conference, every product blog, every hiring post for senior designers mentions them. And for good reason — at the right scale, a design system is one of the highest-leverage investments a product team can make.

But startups aren't there yet. And building one too early is one of the most common ways early-stage teams waste engineering and design hours they can't afford to lose.

## The case for waiting

In the first 18 months, your product is changing constantly. What works for your landing page today will be thrown out next quarter. Building a rigid component library on top of a moving target creates debt, not value.

The signal to start is when you feel the pain of inconsistency — when your engineers are building the same button four different ways, when your designer spends time recreating components instead of solving new problems.

## When you're ready

You're ready for a design system when:
- You have more than two designers or three frontend engineers
- You have multiple products or surfaces sharing a brand language
- Inconsistency is causing real bugs or user confusion
- You're planning to scale hiring in design or engineering

Until then, a shared Figma library and a basic component folder in your codebase is enough.

## What to build first

Start with foundations: colour tokens, typography scale, spacing system. Then add the five or six components that appear on every screen — button, input, card, modal, navigation. That's your v1. Everything else can wait.`,
  },
  {
    slug: "mobile-app-launch-checklist",
    title: "The African Market Mobile App Launch Checklist",
    excerpt: "Launching a mobile app in Ghana, Nigeria, Kenya, or beyond? These are the things most teams miss.",
    date: "April 10, 2025",
    author: "Yaw Boateng",
    authorRole: "Mobile Developer",
    category: "Development",
    image: "/hero3.avif",
    body: `Launching a mobile app anywhere is hard. Launching one in African markets has an extra layer of nuance that most development guides — written for Silicon Valley products — simply don't cover.

After building and launching apps across Ghana, Nigeria, and Kenya, here's the checklist we run through before every release.

## Network conditions

Assume slow networks. Your app should load core functionality on 3G. Implement offline-first patterns where possible, cache aggressively, and never make your users wait for a full page load to do something simple.

## Payment integration

Mobile money is not optional — it's the primary payment method in most markets. Integrate MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and M-Pesa depending on your target markets. Card-only checkout will cost you conversion.

## Localisation

Even within a single country, language and currency formatting matters. Don't hard-code currency symbols. Support multiple languages at the architecture level from day one — retrofitting localisation is painful.

## App store optimisation

Google Play dominates on Android across the continent. Invest in your listing: screenshots in local context, a description that speaks to local problems, and a support email that actually gets answered.

## Data privacy

Understand the data protection laws in each market you operate in. Nigeria's NDPR, Ghana's Data Protection Act, and Kenya's Data Protection Act all have real teeth now.

Launch day is not the time to discover any of these.`,
  },
  {
    slug: "brand-identity-beyond-logo",
    title: "Brand Identity Is Not Your Logo",
    excerpt: "Most founders think brand = logo. The ones building lasting companies know it goes much deeper.",
    date: "March 22, 2025",
    author: "Abena Darko",
    authorRole: "Brand Strategist",
    category: "Branding",
    image: "/hero6.webp",
    body: `When founders come to us asking for a brand, they usually mean a logo. Sometimes they mean a colour palette and a font. Occasionally they mean a website.

What they actually need — what will determine whether their business feels trustworthy, premium, and distinctive — is something much deeper.

## Brand is behaviour

Your brand is the sum of every experience someone has with your company. The logo is a trigger that activates that sum. But if the experience it's triggering is inconsistent, confusing, or forgettable, the best-designed logo in the world won't save you.

Brand is how you write your emails. It's how your customer service team responds to complaints. It's the tone of your social media. It's the quality of your packaging. It's how you onboard new clients.

## Why this matters for African startups

African businesses are competing for trust in markets where trust has historically been hard to earn. Consumers are sophisticated, sceptical, and have been burned before. A cohesive brand — one that behaves consistently across every touchpoint — is one of the most powerful trust signals you have.

## What a real brand identity includes

- **Purpose**: why you exist beyond making money
- **Positioning**: who you're for and who you're not for
- **Voice**: how you write and speak
- **Visual language**: logo, colour, typography, photography style, iconography
- **Application standards**: how all of the above is applied across channels

The logo is the last thing we design. Everything else comes first.`,
  },
  {
    slug: "seo-for-african-businesses",
    title: "SEO for African Businesses: What Actually Works",
    excerpt: "Generic SEO advice is written for US markets. Here's what moves the needle when your audience is in Africa.",
    date: "March 5, 2025",
    author: "Akosua Frimpong",
    authorRole: "Digital Marketer",
    category: "Marketing",
    image: "/hero7.webp",
    body: `Most SEO guides are written by US-based marketers, for US-based audiences, targeting US-based search behaviour. If you're building a business serving Ghanaians, Nigerians, Kenyans, or South Africans, a lot of that advice doesn't apply directly.

Here's what we've learned from running SEO campaigns across multiple African markets.

## Search volume is real but different

People in African markets are searching. A lot. But the keywords, the intent, and the phrasing are different from what US-centric tools will suggest. "Buy phone" and "buy phone in Accra" are different searches with different intent. Always localise your keyword research.

## Mobile-first indexing is non-negotiable

Google's mobile-first index means your mobile experience is your SEO. In markets where mobile is the primary internet device, a poor mobile experience is an SEO disaster. Get this right before anything else.

## Local intent is underserved

Most businesses targeting African markets haven't invested seriously in SEO. That means the competition for local-intent keywords is far lower than comparable searches in Western markets. This is an opportunity — if you move fast.

## Content in local context

Write about problems your specific audience faces in their specific context. Don't translate American content — create African content. The search intent is different. The examples are different. The concerns are different.

## Consistency over cleverness

Show up consistently. Publish regularly. Build links from relevant local publications, directories, and partners. It's not glamorous, but it's what works.`,
  },
  {
    slug: "how-to-brief-a-digital-agency",
    title: "How to Brief a Digital Agency (So You Get What You Actually Want)",
    excerpt: "A bad brief costs you time, money, and the relationship. Here's how to write one that sets everyone up to win.",
    date: "February 18, 2025",
    author: "Ama Owusu",
    authorRole: "Lead Engineer",
    category: "Strategy",
    image: "/hero8.jpg",
    body: `The quality of the brief you give an agency is the single biggest predictor of the quality of work you receive. We've seen it hundreds of times — great teams deliver mediocre work because the brief was vague, and average teams punch above their weight because the brief was clear.

Here's what a good brief looks like.

## Start with the problem, not the solution

The most common mistake: "We need a new website." That's a solution. The brief should start with the problem: "Our current website doesn't communicate what we do clearly, visitors are bouncing before reaching the pricing page, and we're getting enquiries from the wrong types of clients."

Now the agency knows what success looks like.

## Be specific about your audience

"Everyone" is not an audience. "Small business owners in Lagos aged 28-45 who are currently using Excel to manage their inventory" is an audience. The more specific you are, the better the work will be.

## Share what you like and why

If you've seen work you admire, share it. But more important than sharing the example is explaining why you like it. "I like this because it feels premium without being cold" is more useful than a link.

## Be honest about constraints

Budget, timeline, internal stakeholders, technical limitations, brand restrictions — the earlier you surface constraints, the fewer surprises there will be. Agencies are good at working within constraints. We're not good at discovering them mid-project.

## Define what done looks like

What will be true when this project is successful? More enquiries? Better client quality? Lower churn? Faster onboarding? Tie the success metric to a business outcome, not just a deliverable.`,
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getRelatedResources(slug: string, count = 2): Resource[] {
  return resources.filter((r) => r.slug !== slug).slice(0, count);
}
