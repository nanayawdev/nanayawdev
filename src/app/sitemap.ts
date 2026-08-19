import { MetadataRoute } from 'next'
import pool from '@/lib/db'

const baseUrl = 'https://nanayawdev.com'

async function getSlugs(table: string, dateCol = 'updated_at') {
  const { rows } = await pool.query(
    `SELECT slug, ${dateCol} AS date FROM ${table} WHERE published = TRUE ORDER BY ${dateCol} DESC`
  )
  return rows as { slug: string; date: Date }[]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, caseStudies, projects, components] = await Promise.all([
    getSlugs('blog_posts'),
    getSlugs('case_studies'),
    getSlugs('projects'),
    getSlugs('component_resources'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services/web-development`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/web-apps`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/mobile-apps`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/api-integration`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/maintenance-hosting`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/brand-identity`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/ui-ux-design`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/motion-graphics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/social-media-design`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/packaging-design`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/apps`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/resources/${p.slug}`,
    lastModified: p.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${baseUrl}/case-studies/${c.slug}`,
    lastModified: c.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const componentRoutes: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${baseUrl}/resources/components/${c.slug}`,
    lastModified: c.date,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes, ...caseStudyRoutes, ...projectRoutes, ...componentRoutes]
}
