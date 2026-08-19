"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileIcon, Search, X } from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  featured: boolean;
  author: string;
  published_at: string | null;
  created_at: string;
}

interface ComponentResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
  files: { name: string; url: string; size: number }[];
  featured: boolean;
  author: string;
  published_at: string | null;
  created_at: string;
}

const PER_PAGE = 8;
type Tab = "articles" | "components";

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResourcesPageInner />
    </Suspense>
  );
}

function ResourcesPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab]       = useState<Tab>("articles");
  const [posts, setPosts]   = useState<Post[]>([]);
  const [page, setPage]     = useState(1);
  const [postCategory, setPostCategory] = useState<string>(searchParams.get("category") ?? "All");

  const [query, setQuery]             = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults]   = useState<Post[] | null>(null);
  const [searching, setSearching]     = useState(false);

  const [components, setComponents]           = useState<ComponentResource[]>([]);
  const [componentCategory, setComponentCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []));
    fetch("/api/components")
      .then((r) => r.json())
      .then((d) => setComponents(d.components ?? []));
  }, []);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) { setSearchResults(null); return; }
    setSearching(true);
    fetch(`/api/blog/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((d) => setSearchResults(d.posts ?? []))
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  const setCategoryInUrl = useCallback((category: string) => {
    setPostCategory(category);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);
    router.replace(params.size > 0 ? `/resources?${params.toString()}` : "/resources", { scroll: false });
  }, [router, searchParams]);

  const postCategories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filteredPosts  = postCategory === "All" ? posts : posts.filter((p) => p.category === postCategory);
  const totalPages = Math.ceil(filteredPosts.length / PER_PAGE);
  const paginated  = filteredPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const isSearching   = debouncedQuery.length > 0;
  const displayedPosts = isSearching ? (searchResults ?? []) : paginated;
  const indexOffset    = isSearching ? 0 : (page - 1) * PER_PAGE;

  const componentCategories = ["All", ...Array.from(new Set(components.map((c) => c.category)))];
  const filteredComponents  = componentCategory === "All"
    ? components
    : components.filter((c) => c.category === componentCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">

        {/* Header */}
        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Resources
        </motion.p>
        <motion.h1
          className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          Insights &amp; Ideas
        </motion.h1>

        {/* Tabs */}
        <motion.div
          className="flex items-center gap-2 mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {([
            ["articles", "Articles"],
            ["components", "Components"],
          ] as [Tab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                tab === value
                  ? "border border-foreground bg-foreground text-background"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {tab === "articles" && (
        <>

        {/* Empty state */}
        {posts.length === 0 && (
          <p className="text-muted-foreground text-base mb-16">No articles published yet — check back soon.</p>
        )}

        {posts.length > 0 && (
          <>
            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full border border-border bg-background py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category filter */}
            {!isSearching && postCategories.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 mb-10">
                {postCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryInUrl(c)}
                    className={`px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      postCategory === c
                        ? "border border-foreground bg-foreground text-background"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Search status */}
        {isSearching && (
          <p className="mb-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {searching ? "Searching…" : `${searchResults?.length ?? 0} result${searchResults?.length === 1 ? "" : "s"} for "${debouncedQuery}"`}
          </p>
        )}
        {isSearching && !searching && searchResults?.length === 0 && (
          <p className="text-muted-foreground text-base mb-16">No articles matched your search.</p>
        )}

        {/* Editorial list */}
        <div className="divide-y divide-border">
          {displayedPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
              viewport={{ once: true }}
            >
              <Link href={`/resources/${post.slug}`} className="group flex items-center gap-4 py-6 sm:gap-6 sm:py-8 lg:gap-8 lg:py-10">
                <span className="w-5 shrink-0 text-sm font-medium tabular-nums text-muted-foreground/40 sm:w-6 lg:w-8">
                  {String(indexOffset + i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                    <h2 className="text-2xl font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-muted-foreground lg:text-4xl">
                      {post.title}
                    </h2>
                    {post.featured && (
                      <span className="w-fit bg-foreground px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-background">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="max-w-2xl text-base text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  {post.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/60">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {post.cover_image && (
                  <div className="relative hidden w-20 shrink-0 self-stretch overflow-hidden rounded-xl opacity-70 transition-opacity duration-300 group-hover:opacity-100 sm:block lg:w-32">
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                  </div>
                )}

                <div className="hidden shrink-0 items-center lg:flex">
                  <ArrowUpRight className="h-5 w-5 translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {!isSearching && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-10 w-10 items-center justify-center text-[0.65rem] font-semibold tracking-[0.18em] transition-colors ${
                  page === n
                    ? "border border-foreground bg-foreground text-background"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        </>
        )}

        {tab === "components" && (
        <>

          {/* Empty state */}
          {components.length === 0 && (
            <p className="text-muted-foreground text-base mb-16">No components shared yet — check back soon.</p>
          )}

          {/* Category filter */}
          {components.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10">
              {componentCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setComponentCategory(c)}
                  className={`px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    componentCategory === c
                      ? "border border-foreground bg-foreground text-background"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((c, index) => (
              <motion.div
                key={c.slug}
                className="bg-background"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
              >
                <Link href={`/resources/components/${c.slug}`} className="group flex h-full flex-col overflow-hidden border border-border">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {c.cover_image ? (
                      <Image
                        src={c.cover_image}
                        alt={c.title}
                        fill
                        className="object-cover transition duration-700 group-hover:grayscale"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <FileIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {c.category}
                      </p>
                      <h3 className="text-lg font-bold leading-snug text-foreground mb-2">{c.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{c.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                        {c.files?.length ?? 0} file{c.files?.length === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                        View
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </>
        )}

      </div>
    </div>
  );
}
