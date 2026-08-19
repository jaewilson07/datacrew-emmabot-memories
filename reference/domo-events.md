---
description: Domo event pages structure, search tips, and 2026 Connections Tour confirmed dates.
---
# Domo Events

## Domo Connections Tour

### 2026 Dates (Confirmed)

These dates have been confirmed via individual city pages on the Domo webflow subdomain. This is a partial list — the complete schedule was not accessible from the main Domo events page (JS-rendered).

| City | Date | Venue/Sponsor |
|------|------|---------------|
| Austin, TX | Sep 16, 2026 | Blue Yeti |
| Dallas, TX | Sep 17, 2026 | AWS |
| Salt Lake City, UT | Sep 29, 2026 | Domo HQ (American Fork) |
| Los Angeles, CA | Oct 7, 2026 | — |

**Note:** The 2025 tour had 9 cities (Minneapolis, Chicago, Toronto, SLC, Dallas, Menlo Park, NYC, Charlotte, Atlanta). 2026 appears to have a different mix — Austin and LA are new additions; some 2025 cities may not return.

**Sources:**
- Individual city pages via `domo-webflow.domo.com/events/connections-tour-[city]`
- Mark Boothe (Domo CMO) podcast (July 2026) confirmed "Connexions tour coming up in the fall"

### Event Page Structure

- Main landing page: `https://www.domo.com/domo-connections-tour` — JS-rendered, hard to scrape
- Webflow subdomain: `https://domo-webflow.domo.com/events/connections-tour` — also JS-rendered at the list level
- Individual city pages: `domo-webflow.domo.com/events/connections-tour-[city]` — contain rich structured data (JSON-LD) with dates, venues, schedules
- Domo events hub: `https://www.domo.com/events` — shows upcoming events but details may be behind JS-rendered "Learn more" links

### How to Find Event Info

When researching Domo events:
1. Try `site:domo.com "connections tour" 2026` for web search
2. Try `site:domo-webflow.domo.com/events/connections-tour 2026` for individual city pages
3. Check the Domo blog (blog posts from Domo staff often announce dates)
4. LinkedIn posts from Domo employees (search for `domo.com/events/connections-tour` on LinkedIn)
5. The Domo Community Forum — but it's JS-rendered, so web scraping won't work

## Domopalooza

- `#public-dp-2026` channel exists in DUG Slack (128 members as of research date)

## Search Gotchas

- **"Domo tour" on web search returns music tours** — DOMi & JD Beck, a jazz fusion duo, has a 25-city US tour in fall 2026. This consistently pollutes search results for Domo event queries. Use more specific terms like `"Domo Connections" "AI Data Tour"` or `site:domo.com` to avoid.
- **Domo events pages are heavily JS-rendered** — curl/fetch of event pages returns minimal HTML. JSON-LD structured data may be present but is often empty or contains 2025 data on 2026 pages.
- **Event sponsor info is inconsistent** — Some city pages show venue/sponsor, others don't. The main tour page doesn't aggregate sponsors.
- **Past event dates linger** — The main tour page sometimes shows past (2025) dates prominently while hiding current info behind JS-rendered "Learn more" buttons.
