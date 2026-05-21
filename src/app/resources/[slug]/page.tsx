import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getResourceBySlug, getRelatedResources } from "@/lib/resources-data";
import { CTACard } from "@/components/cta-card";

export default function ResourceDetail({ params }: { params: { slug: string } }) {
  const post = getResourceBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedResources(params.slug, 2);

  const paragraphs = post.body.split("\n\n");

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-10">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Resources
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
          {post.category} · {post.date}
        </p>
        <h1 className="max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted flex items-center justify-center text-[0.6rem] font-bold text-foreground border border-border">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground leading-none">
              {post.author}
            </p>
            <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest mt-0.5">
              {post.authorRole}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width hero image */}
      <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-24 items-start">

          {/* Left sidebar — sticky */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                About this article
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Category
              </p>
              <span className="inline-block border border-border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                {post.category}
              </span>
            </div>
            <CTACard />
          </div>

          {/* Right — article body */}
          <div className="prose-custom">
            {paragraphs.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-bold text-foreground leading-snug tracking-tight mt-12 mb-4 first:mt-0"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="space-y-2 mb-6 pl-4 border-l-2 border-[#FD4912]">
                    {items.map((item, j) => (
                      <li key={j} className="text-foreground text-lg leading-relaxed">
                        {item.replace(/^- \*\*(.+?)\*\*: /, (_, bold) => ``)}{item.replace(/^- /, "").replace(/\*\*(.+?)\*\*/, "$1")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-foreground text-lg leading-relaxed mb-6">
                  {block}
                </p>
              );
            })}
          </div>

        </div>
      </div>

      {/* Related posts */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Related resources
            </h2>
            <Link
              href="/resources"
              className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/resources/${r.slug}`}
                className="group flex overflow-hidden border border-border bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                </div>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {r.category} · {r.date}
                    </p>
                    <p className="text-base font-semibold leading-snug text-foreground">
                      {r.title}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                    Read More
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
