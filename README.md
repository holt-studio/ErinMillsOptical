# Erin Mills Optical — website

One-page static site for Erin Mills Optical, an independent optical store at
C10 – 6435 Erin Mills Pkwy, Mississauga, ON L5N 4H4 (905-858-2066).

**Live:** https://holt-studio.github.io/ErinMillsOptical/

## Stack

- Static HTML + CSS + vanilla JS — no build step, no framework.
- Self-hosted fonts (Jost, Source Serif 4 — latin woff2 subsets in `fonts/`).
- Booking form posts to [Web3Forms](https://web3forms.com) (free email relay).
- Hosted on GitHub Pages; every push to `main` deploys.

## Activate the booking form

The form currently shows a "call us" fallback because no Web3Forms key is set.

1. Go to https://web3forms.com and create a free access key using the store's
   email address (submissions will be delivered there).
2. In `js/main.js`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key.
3. Commit and push. The access key is designed to be public — no secret leaks.

## Content still owed by the owner

- Storefront / interior / frame photos (replace the frame-style tiles in the
  `#frames` section).
- Frame brand list.
- Full list of insurers for direct billing (Sun Life is confirmed).
- Facebook page URL for the footer, if wanted.
- Custom domain, if wanted (`CNAME` file + DNS A/AAAA records → GitHub Pages).

## Editing

Everything lives in three files: `index.html` (content), `css/style.css`
(design tokens at the top), `js/main.js` (nav, form, date rules). Hours appear
in four places: hero booking panel, visit section, footer, and the JSON-LD
schema in `index.html` — update all four when hours change.
