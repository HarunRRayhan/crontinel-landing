import { getCollection } from 'astro:content';

export async function GET() {
  const site = 'https://crontinel.com';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/pricing', priority: '0.9', changefreq: 'monthly' },
    { url: '/features', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/changelog', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/legal/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/legal/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  const blogPosts = await getCollection('blog');
  const vsPosts   = await getCollection('vs');
  const useCases  = await getCollection('use-cases');
  const integrations = await getCollection('integrations');

  const dynamicPages = [
    ...blogPosts.map((p) => ({ url: `/blog/${p.id}`, priority: '0.7', changefreq: 'monthly' })),
    ...vsPosts.map((p) => ({ url: `/vs/${p.id}`, priority: '0.8', changefreq: 'monthly' })),
    ...useCases.map((p) => ({ url: `/use-cases/${p.id}`, priority: '0.7', changefreq: 'monthly' })),
    ...integrations.map((p) => ({ url: `/integrations/${p.id}`, priority: '0.7', changefreq: 'monthly' })),
  ];

  const allPages = [...staticPages, ...dynamicPages];
  const today = new Date().toISOString().slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
