# HappyHourHunt Denver: SEO Implementation Brief

> Reference brief. Strategic + tactical. Most items deferred until app matures past beta. See "Quick Hits" section at bottom for what's worth doing now.

## Read this first

You are being asked to produce an SEO implementation plan for HappyHourHunt.net, a Denver happy hour directory built in Next.js. The strategic research has already been done (summarized below). Your job is to inspect the actual codebase, map the current state to the strategic plan, and produce a concrete implementation plan that an engineer can act on.

Do not write code yet. Do not deploy anything. Produce the plan first, surface open questions, and wait for human review before implementing.

---

## Project context

**Site**: https://www.happyhourhunt.net
**Stack**: Next.js (App Router based on the build output observed)
**Status**: In beta, soft-launched
**Geographic scope**: Denver, Colorado (single city for now)
**Brand promise**: Every Denver happy hour, sorted by time and neighborhood. Verified weekly. Free, no signup.
**Owner**: Joshua Duncan / DigitalNova LLC

---

## Current SEO state (as of the latest Semrush pull)

- Authority Score: 6
- Indexed organic keywords: 61
- Estimated monthly organic visits: 3
- Backlinks: 152 from 83 referring domains, only 22 unique class C IPs
- No paid keywords
- WebSite and Organization schema present
- Restaurant, ItemList, Place, OpeningHoursSpecification, Offer, FAQPage schema NOT present
- Hero is autoplay video (likely Core Web Vitals impact, needs measurement)
- FAQ section is collapsed by default with no exposed answers in DOM
- Site labels itself "Currently in beta"

### Current ranking pattern

Most rankings split between `/` (homepage) and `/search`. Same keywords appear at two positions on two different URLs, indicating keyword cannibalization. Examples:

- "happy hour denver" (volume 1,000): position 52 on `/search`, position 93 on `/`
- "best happy hours denver" (170): position 24 on `/`, no clear primary
- "denver happy hours" (320): position 41 and 56, both on `/`
- "happy hour in denver colorado" (volume 1,900): positions 35 and 83 on different URLs

### Keywords currently ranking with realistic upside

Position 16 to 30 (one push from page 1):
- "best happy hour in denver" (140) at 16
- "happy hour finder" (210) at 16
- "good happy hour denver" (90) at 17
- "best denver happy hours" (50) at 22
- "best happy hours denver" (170) at 24
- "good happy hours denver" (720) at 25
- "happy hour food denver" (40) at 26
- "happy hour spots denver" (50) at 27
- "good happy hours downtown denver" (170) at 28
- "happy hours in denver" (90) at 30

Position 30+ but high volume:
- "best happy hour denver" (1,600) at 35
- "happy hour in denver colorado" (1,900) at 35
- "happy hour denver" (1,000) at 52
- "saturday happy hour denver" (260) at 77
- "happy hour downtown denver" (260) unranked
- "sunday happy hour denver" (210) unranked

### Target keyword universe

**Head terms (high volume, hard):**
- happy hour denver (1,000)
- best happy hour denver (1,600)
- happy hour in denver colorado (1,900)
- denver happy hour (720)

**Day-of-week:**
- saturday happy hour denver (260)
- happy hour downtown denver (260)
- sunday happy hour denver (210)
- monday happy hour denver (110)
- late night happy hour denver (110)

**Neighborhood:**
- cherry creek happy hour (170)
- happy hour cherry creek denver (110)
- highlands happy hour denver (90)
- lohi happy hour (90)
- happy hour lodo (50)
- rino happy hour (10)

**Branded/utility:**
- happy hour finder (210)
- hh denver (320)

---

## Competitive landscape

**Editorial competitors (own page 1 for head terms):**
- do303.com - neighborhood guide, 40,248 keywords, 65,110 traffic
- denver.eater.com - "best happy hours" map post
- 5280.com - 99,125 keywords, 78,771 traffic
- westword.com - annual best-of feature
- newdenizen.com - best-of list
- workfromdenver.com - 321 keywords, 668 traffic
- ingoodtastedenver.com - 9,220 keywords, 6,743 traffic
- coloradobites.com - top happy hours downtown
- reddit.com (r/denverfood) - hard to dislodge

**Functional competitors (similar aggregator model):**
- denver.goldenbuzz.social - 12,275 keywords, 8,608 traffic. Closest analog. Has /happy-hour-map page and neighborhood/category sub-pages
- thedrinknation.com - multi-city HH directory, 8,125 keywords
- thehappyhourfinder.com - 27,060 keywords
- kingofhappyhour.com - 16,732 keywords, 48,640 traffic
- denver-happy-hour-finder.lovable.app
- appyhourmobile.com
- ultimatehappyhours.com
- anyhappyhour.com
- yelp.com

**Reference architecture to study (for inspiration, not copying):**
- yelp.com - gold standard for programmatic SEO at scale
- denver.goldenbuzz.social - closest functional comparable
- denver.eater.com - how editorial sites structure city food content

---

## Strategic goal

Replicate the Yelp architectural pattern at a smaller, focused scale:

1. One unique indexable URL per restaurant happy hour
2. One unique URL per neighborhood (LoDo, RiNo, Cherry Creek, LoHi, Highlands, Capitol Hill, Downtown)
3. One unique URL per day of week (Monday through Sunday)
4. One unique URL per category (rooftop, late night, brewery, wine, food-focused, etc.)
5. Programmatic intersection pages for long-tail (e.g. /denver/lodo/happy-hour/saturday)
6. Each URL has unique on-page content, not just filtered output
7. Aggressive internal linking with breadcrumbs
8. Comprehensive schema markup on every page type
9. Sharded sitemap with lastmod dates that reflect weekly verification
10. "Verified weekly" surfaced as both a UX trust signal and an SEO content asset

The "verified weekly" claim is the unique moat against Yelp and is the brand promise. Surface it on every restaurant page as a "Last verified: [date]" badge with structured data.

---

## Codebase investigation tasks

Before producing recommendations, inspect the actual code and answer these questions. Document findings.

### 1. Routing and page structure

- Map the full App Router directory under `app/`
- List every existing page route
- Identify which routes are statically generated vs dynamic vs server-rendered
- Find the `/search` page implementation. Is it client-side filtered? Server-rendered? URL-driven?
- Check whether filter combinations produce indexable URLs or query strings

### 2. Data layer

- Identify the data source for restaurants (Supabase, Postgres, JSON file, CMS, etc.)
- Document the restaurant data schema: what fields exist, what's missing for SEO
- Check if neighborhoods, categories, and day-of-week data are first-class entities or derived
- Find where weekly verification is tracked (timestamp field, audit log, etc.)
- Confirm whether existing data has restaurant slugs, neighborhood slugs, category slugs

### 3. Metadata and SEO infrastructure

- Find where `generateMetadata` or static metadata is defined
- Document the current title and description patterns
- Locate the JSON-LD structured data implementation (currently WebSite + Organization)
- Check for OpenGraph and Twitter card setup
- Find the canonical URL handling

### 4. Sitemap and crawl directives

- Locate `sitemap.xml` generation (static file, route handler, library?)
- Check `robots.txt` content and source
- Identify if there are any noindex directives in use
- Confirm Google Search Console is connected (this is an external task)

### 5. Internal linking

- Map current internal link patterns: header, footer, in-page
- Check if restaurant cards link to anything indexable
- Identify breadcrumb component if any
- Look for related-content patterns

### 6. Performance and Core Web Vitals

- Inspect the hero video implementation (autoplay, file size, poster, lazy loading)
- Check image optimization (Next.js Image component usage, sizes, formats)
- Identify any render-blocking resources
- Note the LCP candidate element on key pages

### 7. Content infrastructure

- Check for blog/MDX/CMS infrastructure for editorial content
- Identify if there's a way to attach editorial copy to restaurant, neighborhood, or category entities
- Find FAQ component implementation and whether answers are in DOM

### 8. URL hygiene

- Confirm whether URLs are stable and slug-based or ID-based
- Check trailing slash handling
- Look for any existing 301 redirect logic

---

## Deliverables (what the plan should contain)

Produce a single markdown document with these sections.

### Section 1: Current state findings
What's in the codebase right now. Bullet list of facts, no recommendations yet.

### Section 2: Information architecture proposal
Full proposed URL structure. For each new route pattern, specify:
- The URL pattern
- The page purpose
- Target keywords
- Required content blocks
- Required schema markup
- Internal linking inputs and outputs

Recommended starting structure (revise based on codebase findings):

```
/                                              homepage
/denver/happy-hour                             city hub
/denver/[neighborhood]/happy-hour              neighborhood pages
/denver/happy-hour/[day]                       day-of-week pages
/denver/happy-hour/[category]                  category pages
/denver/[neighborhood]/happy-hour/[day]        neighborhood-day intersections
/denver/happy-hour/right-now                   time-aware page
/denver/spots/[restaurant-slug]                individual restaurant pages
/best/[topic-slug]                             editorial articles
/about, /submit, /contact, /privacy, /terms    utility
```

### Section 3: Page-by-page implementation plan
For each new page type, provide:
- File path under `app/`
- Required props/data fetching
- Required components (new vs existing)
- Metadata generation logic
- Schema markup blocks (with actual JSON-LD code snippets)
- Word count targets for editorial copy
- Internal link slots

### Section 4: Schema markup plan
For each schema type, document:
- Where it goes (which routes/components)
- Required fields and where the data comes from
- Code snippets ready to drop in
- Validation steps

Schemas required:
- `WebSite` with SearchAction (already exists, audit only)
- `Organization` (already exists, audit only)
- `BreadcrumbList` on every nested page
- `Restaurant` + `LocalBusiness` on individual restaurant pages
- `OpeningHoursSpecification` for happy hour windows
- `Offer` for specific deals
- `ItemList` on neighborhood, day, category pages
- `FAQPage` on homepage and any FAQ-bearing page
- `Place` where applicable

### Section 5: Sitemap strategy
- Sharding plan (single vs split sitemaps)
- Generation approach (static, route handler, library)
- `lastmod` strategy tied to verification timestamps
- Submission and monitoring plan

### Section 6: Internal linking plan
- Header navigation changes
- Footer sitemap section
- Breadcrumb implementation
- "Related" component for restaurant pages (similar nearby spots)
- Cross-links between neighborhood, day, and category pages
- Hub-and-spoke pattern from `/denver/happy-hour`

### Section 7: Cannibalization fix
The current `/` and `/search` both rank for the same queries. Propose a resolution:
- Which page should own which keyword set
- Use of canonical tags vs `noindex` vs content differentiation
- Migration approach that doesn't lose existing positions

### Section 8: Editorial content plan
- List of best-of articles to produce (e.g. "Best LoDo Happy Hours 2026", "Best Sunday Happy Hour Denver", "Best Rooftop Happy Hours in Denver")
- Suggested editorial calendar
- Where they live (`/best/[slug]` or `/blog/[slug]`)
- Internal linking implications

### Section 9: Core Web Vitals action items
- Whether to keep, defer, or replace the hero video
- Image optimization audit findings
- Specific Lighthouse / PageSpeed tasks

### Section 10: Phased rollout
Phase 1 (quick wins, 1 to 2 weeks):
- Cannibalization fix
- Homepage content expansion
- FAQ schema and exposed answers
- "Verified weekly" badge implementation
- Basic ItemList schema on /search
- Drop or relocate "in beta" messaging

Phase 2 (foundation, 3 to 6 weeks):
- Neighborhood landing pages
- Day-of-week pages
- Restaurant detail page architecture
- Restaurant + Offer + OpeningHoursSpecification schema
- Breadcrumbs everywhere
- Sharded sitemap
- Internal linking implementation

Phase 3 (depth, 6 to 12 weeks):
- Category pages
- Intersection pages
- Editorial content production
- "Right now" time-aware page
- Author pages if multi-author
- Outreach for backlinks (separate workstream, not engineering)

### Section 11: Migration and risk
- Redirects required to preserve existing rankings
- URLs that should NOT change
- Pages that need 301s if URL structure changes
- Search Console monitoring plan during rollout

### Section 12: Open questions for human review
List anything you couldn't determine from the code that requires Josh's input. Examples:
- Is there budget/appetite for editorial content production
- Who owns weekly verification and can it be timestamped per restaurant
- What's the data backfill plan for restaurant descriptions
- Are there existing partnerships with restaurants
- Should "in beta" messaging stay or go

### Section 13: Definition of done
A clear checklist for what "Phase 1 complete" looks like, in measurable terms (e.g. "all rankings consolidated to single URL," "FAQ schema validates in Rich Results test," "homepage word count above 800").

---

## Constraints and preferences

- Do not break existing rankings during migration. Use 301s, not 404s. Preserve URL stability where possible.
- Do not auto-deploy or apply changes without human review.
- Do not modify the database schema without surfacing the change in the open-questions section.
- Maintain the UX quality of `/search`. It's a strength of the product.
- "Verified weekly" is core brand. Surface it everywhere with structured data.
- Avoid em dashes and en dashes in any user-facing copy you suggest. Use commas, periods, or "and" instead.
- Keep the tone of suggested copy in line with the existing site: practical, no-nonsense, slightly anti-corporate.
- Single-city for now (Denver). Architect routes so multi-city expansion (`/[city]/...`) is possible later without rewriting.

---

## Working approach

1. Start by reading the codebase. Don't recommend things until you've seen what exists.
2. Produce the plan as a single markdown file.
3. Include code snippets where they clarify intent (JSON-LD examples, route handler signatures, metadata patterns).
4. Be honest about trade-offs. If something is high-effort and low-payoff, say so.
5. Surface ambiguity in the "open questions" section instead of making silent assumptions.
6. When you're done with the plan, stop. Wait for review before implementation.

---

## Reference materials

- Semrush research summary: included above
- Live site: https://www.happyhourhunt.net
- Closest functional competitor: https://denver.goldenbuzz.social
- Editorial reference: https://denver.eater.com/maps/best-happy-hours-denver-restaurants-bars
- Programmatic SEO reference: yelp.com (study URL patterns and schema)
