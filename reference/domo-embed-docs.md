---
description: Verified Domo documentation URLs for App Studio embedding and Domo Everywhere embed.
---
# Domo Embed Documentation

Verified doc URLs for App Studio embedding and Domo Everywhere embed questions.

## App Studio Embed (deploying apps outside dashboard cards)

- **App Studio Overview (includes embed steps):** https://www.domo.com/docs/s/article/000005295
  - Covers Distribute > Embed Domo App workflow
  - Private embed (authenticated, supports PDP) vs Public embed (open access)
  - Lists unsupported features in embedded apps

- **Embed Content Outside of Domo:** https://www.domo.com/docs/s/article/360043437993
  - General guide for embedding cards and dashboards externally
  - iFrame vs JavaScript embed approaches
  - SSO + PDP setup for private embeds

- **App Embed Authentication:** https://www.domo.com/docs/portal/embed/embed-in-sites-and-apps/app-embed-authentication
  - Token-based auth for embedded apps (future-proof as cookies get blocked)
  - Public-assets folder for static resources
  - IDP domain whitelisting pattern: `.domoapps.{environment}.domo.com`

- **URL Parameters in Embedded Content:** https://www.domo.com/docs/portal/embed/embed-in-sites-and-apps/url-parameters-in-embedded-content
  - `viewId` — deep-link to specific App Studio page view
  - `appData` — pre-populate app controls
  - `Pfilters` — pass filter state across embedded navigation

- **Embedding Into Sites and Web Portals:** https://www.domo.com/docs/portal/embed/embed-in-sites-and-apps/embedding-into-sites-and-web-portals
  - Overview of Domo Everywhere embed capabilities
  - Branding, interactivity, personalization

## Key Points for Community Questions

- App Studio apps CAN be embedded outside the dashboard card container via Distribute > Embed
- Private embed: authenticated, supports personalized filters (PDP)
- Public embed: open access, no personalized filters
- Embed gives you a share link (direct URL) or embed code (iframe/JS)
- CLI deploy + manifest changes may require card resave when using dashboard cards, but direct embed sidesteps this
- Some features not available in embedded apps (Clear All filters button, certain widgets)
