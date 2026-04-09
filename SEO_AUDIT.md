# Crontinel Landing — SEO Audit

**Audited:** 2026-04-09 (static file analysis — no live URL fetching)  
**Scope:** `/Users/ray/Work/crontinel/landing/src/`

---

## Summary

The foundation is strong. Base.astro handles canonical URLs, OG tags, Twitter cards, and JSON-LD globally. All key pages pass custom titles and descriptions. The biggest gaps are missing structured data on individual pages, some nav/internal link gaps, and a few metadata improvements.

---

## Checklist

### Meta Tags

| Check | Status | Notes |
|---|---|---|
| `<title>` on homepage | ✅ Pass | "Crontinel — Laravel Cron & Background Job Monitoring" — good keyword density |
| `<title>` on pricing | ✅ Pass | "Pricing — Crontinel" — functional but could be more keyword-rich |
| `<title>` on features | ✅ Pass | "Features — Crontinel" — functional |
| `<title>` on about | ✅ Pass | "About — Crontinel" |
| `<meta name="description">` — homepage | ✅ Pass | 119 chars, includes keywords |
| `<meta name="description">` — pricing | ✅ Pass | 96 chars |
| `<meta name="description">` — features | ✅ Pass | 145 chars |
| `<meta charset>` | ✅ Pass | Set in Base.astro |
| `<meta name="viewport">` | ✅ Pass | Set in Base.astro |
| `<meta name="generator">` | ✅ Pass | Set (Astro generator) |

### Open Graph & Social

| Check | Status | Notes |
|---|---|---|
| `og:type` | ✅ Pass | "website" — set in Base.astro |
| `og:url` | ✅ Pass | Set from canonical URL |
| `og:title` | ✅ Pass | Mirrors `<title>` |
| `og:description` | ✅ Pass | Mirrors `<meta description>` |
| `og:image` | ✅ Pass | `/og-default.png` exists in `public/` |
| `twitter:card` | ✅ Pass | "summary_large_image" |
| `twitter:title` | ✅ Pass | Set |
| `twitter:description` | ✅ Pass | Set |
| `twitter:image` | ✅ Pass | Set |
| `twitter:site` tag | ❌ Missing | Should add `<meta name="twitter:site" content="@crontinel">` |
| Per-page `og:image` on VS pages | ⚠️ Partial | All pages fall back to `/og-default.png`; VS + use-case pages have no custom OG image |

### Canonical & URLs

| Check | Status | Notes |
|---|---|---|
| `<link rel="canonical">` | ✅ Pass | Auto-generated from `Astro.url.pathname` + `Astro.site` in Base.astro |
| Canonical on all page types | ✅ Pass | Inherited via Base layout |

### Heading Hierarchy

| Page | H1 | H2 | H3 | Status |
|---|---|---|---|---|
| Homepage (index.astro) | ✅ 1 H1 | Multiple H2s for sections | H3s in FAQ-style areas | ✅ Pass |
| Pricing | ✅ "Simple, transparent pricing" | H2 for self-host + FAQ header | H3 for FAQ items | ✅ Pass |
| Features | ✅ "The monitoring your Laravel app actually needs" | H2s per feature section | — | ✅ Pass |
| About | ✅ "About Crontinel" | — | — | ✅ Pass |
| VS pages (better-stack, cronitor, etc.) | ✅ 1 H1 per page | H2s for sections | — | ✅ Pass |

### Sitemap

| Check | Status | Notes |
|---|---|---|
| sitemap.xml exists / generated | ✅ Pass | Dynamic `sitemap.xml.ts` generates XML at build time |
| Static pages included | ✅ Pass | /, /pricing, /features, /about, /changelog, /blog, /legal/* |
| Blog posts included | ✅ Pass | Pulled from `blog` content collection |
| VS pages included | ✅ Pass | Pulled from `vs` collection |
| Use-case pages included | ✅ Pass | Pulled from `use-cases` collection |
| Integrations pages included | ✅ Pass | Pulled from `integrations` collection |
| Sitemap referenced in robots.txt | ✅ Pass | `Sitemap: https://crontinel.com/sitemap.xml` |

### robots.txt

| Check | Status | Notes |
|---|---|---|
| robots.txt present | ✅ Pass | `public/robots.txt` — `User-agent: * Allow: /` |
| Sitemap directive | ✅ Pass | Present |
| No accidental disallow | ✅ Pass | All paths allowed |

### Structured Data (JSON-LD)

| Check | Status | Notes |
|---|---|---|
| Organization schema | ✅ Pass | In Base.astro — all pages get it |
| WebSite schema | ✅ Pass | In Base.astro |
| SoftwareApplication schema | ❌ Missing | Should be on homepage + features page |
| PricingPage / Offer schema | ❌ Missing | Should be on /pricing |
| FAQPage schema | ❌ Missing | Pricing page has FAQ content but no JSON-LD FAQPage |
| BreadcrumbList schema | ❌ Missing | Would help on VS, use-cases, and integrations pages |
| Article schema | ❌ Missing | Blog posts should have Article/BlogPosting schema |

### Internal Linking

| Check | Status | Notes |
|---|---|---|
| Homepage → Features | ✅ Pass | Nav link |
| Homepage → Pricing | ✅ Pass | Nav link |
| Homepage → Blog | ✅ Pass | Nav link |
| Homepage → About | ❌ Missing | About page exists but is not in Nav or footer |
| Homepage → VS pages | ❌ Missing | `/vs/*` pages not linked from nav, homepage, or features page |
| Homepage → Use-case pages | ❌ Missing | `/use-cases/*` not linked from nav or homepage |
| Homepage → Integrations | ❌ Missing | `/integrations/*` not linked from nav or homepage |
| Footer → About | ❌ Missing | Footer has: Docs, Changelog, GitHub, Status, Privacy, Terms — no About link |
| Footer → Pricing | ❌ Missing | Not in footer |
| Footer → Features | ❌ Missing | Not in footer |
| Nav → About | ❌ Missing | Not in Nav.astro `navLinks` array |
| Nav mobile menu | ⚠️ Gap | Nav links are `hidden md:flex` — no mobile hamburger menu; mobile users see only "Get early access" CTA |

### Image Alt Text

| Check | Status | Notes |
|---|---|---|
| Dashboard preview (homepage) | ✅ Pass | Pure HTML/inline styles — no `<img>` tags |
| Logo SVG icons | ✅ Pass | All have `aria-hidden="true"` (decorative) |
| `/og-default.png` | N/A | OG image, not rendered in-page |
| Favicon | N/A | Not inline content |

---

## Quick Wins (< 30 min each)

1. **Add `twitter:site` tag to Base.astro** — one line, improves Twitter card attribution
   ```html
   <meta name="twitter:site" content="@crontinel" />
   ```

2. **Add About to Nav** — add `{ href: '/about', label: 'About' }` to `Nav.astro` `navLinks`

3. **Add About + Pricing + Features to Footer** — 3 links to add to `Footer.astro`

4. **Improve pricing page title** — change from `"Pricing — Crontinel"` to `"Pricing — Crontinel Laravel Monitoring"` to include target keyword

5. **Improve features page title** — change from `"Features — Crontinel"` to `"Features — Crontinel Laravel Cron & Queue Monitoring"`

6. **Add FAQPage JSON-LD to pricing.astro** — the FAQ content is already there; adding the schema block is ~30 min work

---

## Longer Improvements (prioritize by page traffic)

### High priority

- **SoftwareApplication JSON-LD on homepage + features** — Google uses this to show rich results for software tools. Include `name`, `applicationCategory`, `operatingSystem`, `offers` (free tier), `featureList`.

- **Mobile nav hamburger menu** — nav links are hidden on mobile. Users can't navigate to Features, Pricing, or Blog on mobile without typing the URL. This also hurts crawl equity distribution on mobile-first indexing.

- **VS pages internal link discovery** — VS pages exist in sitemap but are orphaned (no links from any navigable page). Add a "Compare alternatives" section to the features page or a sidebar on the pricing page that links to `/vs/better-stack`, `/vs/cronitor`, etc.

- **Use-case pages internal link discovery** — same problem as VS pages. Add a "Use cases" section to homepage or nav.

### Medium priority

- **Per-page og:image for VS and use-cases** — custom social preview images for each comparison page will significantly increase click-through rate when these URLs are shared.

- **Article/BlogPosting JSON-LD** — check `src/pages/blog/[...slug].astro`; add schema to each blog post.

- **BreadcrumbList on VS / use-case / integration pages** — improves SERP display for these pages.

- **Integrations page discovery** — add an `/integrations` index page linked from the nav or footer.

### Lower priority

- **`<meta name="robots">` explicit control** — currently relying on no-robots-meta + robots.txt allow. Explicit `index,follow` on key pages adds clarity.
- **Hreflang** — if multilingual support is ever planned, add early.
- **Performance / Core Web Vitals** — out of scope for static analysis; run Lighthouse on live site.
