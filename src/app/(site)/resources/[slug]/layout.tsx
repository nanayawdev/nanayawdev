import type { Metadata } from "next";
import pool from "@/lib/db";

const SITE_URL = "https://nanayawdev.com";

interface PostMeta {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  author: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

async function getPost(slug: string): Promise<PostMeta | null> {
  const { rows } = await pool.query(
    `SELECT title, excerpt, category, tags, cover_image, author, published_at, created_at, updated_at
     FROM blog_posts WHERE slug = $1 AND published = TRUE`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/resources/${slug}`;
  const images = post.cover_image ? [post.cover_image] : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      images,
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function ResourceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLd = post && {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "nanayawdev",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/nanayawdev-logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/resources/${slug}` },
    articleSection: post.category,
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
