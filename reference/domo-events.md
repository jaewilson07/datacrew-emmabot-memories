---
description: Domo event pages structure, search tips, and 2026 Connections Tour confirmed dates.
---
# Domo Events

## Domo Connections Tour

### 2026 Dates (Complete — All 9 Cities Confirmed)

Confirmed via individual city pages on the Domo webflow subdomain. The Domo blog confirmed it's a "9-stop tour" (Aug 2026 blog post by Joseph Rendeiro).

| # | City | Date | Venue/Sponsor | Time |
|---|------|------|---------------|------|
| 1 | Austin, TX | Sep 16, 2026 | Blue Yeti, 701 Brazos St, Austin, TX 78701 | 12-6pm CT |
| 2 | Dallas, TX | Sep 17, 2026 | AWS, 13455 Noel Rd 14th Floor, Dallas, TX 75204 | 12-6pm CT |
| 3 | Salt Lake City, UT | Sep 29, 2026 | Domo HQ, 802 E 1050 S, American Fork, UT 84003 | 12-6pm MT |
| 4 | Los Angeles, CA | Oct 7, 2026 | Not yet announced | 12-6pm PT |
| 5 | Atlanta, GA | Oct 13, 2026 | AWS, 3333 Piedmont Road NE Floor 4, Atlanta, GA 30305 | 12-6pm ET |
| 6 | Chicago, IL | Oct 14, 2026 | Miller Cooper, 500 W. Madison Street, Chicago, IL 60661 | 12-6pm CT |
| 7 | Minneapolis, MN | Oct 15, 2026 | DataUp Consulting, 50 S 9th St, Minneapolis, MN 55402 | 12-6pm CT |
| 8 | Toronto, ON | Nov 4, 2026 | AWS, 40 King St West, 47th Floor, Toronto, ON M5H 3Y2 | 12-6pm ET |
| 9 | New York City, NY | Nov 5, 2026 | Not yet announced | 12-6pm ET |

**Sponsors/Venue Hosts:**
- AWS — 3 cities (Dallas, Atlanta, Toronto)
- Blue Yeti — Austin
- Miller Cooper — Chicago
- DataUp Consulting — Minneapolis
- Domo HQ — Salt Lake City
- Not yet announced — Los Angeles, NYC

**Customer Speakers (from blog post):** TD Bank, Six Flags

**Changes from 2025:** Austin and LA are new additions. Dropped from 2025: Menlo Park, Charlotte. Minneapolis, Chicago, Toronto, SLC, Dallas, NYC, Atlanta all return.

**Sources:**
- Individual city pages via `domo-webflow.domo.com/events/connections-tour-[city]`
- Domo blog post "5 Reasons Not to Attend the (Free) AI + Data Tour" (Aug 2026, Joseph Rendeiro) — confirms "9-stop tour"
- Mark Boothe (Domo CMO) podcast (July 2026) confirmed "Connexions tour coming up in the fall"
- Research date: Aug 24, 2026

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
