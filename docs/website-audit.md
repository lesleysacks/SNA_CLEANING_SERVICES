# SNA Cleaning Services — Website Audit

**Scope:** `index.html`, `about.html`, `services.html`, `gallery.html`, `contact.html`, `css/*`, `js/*`, images, `robots.txt`, `sitemap.xml`, and the company profile PDF (Dec 2022) as the source of truth for business facts.
**Method:** Full code read, plus rendering every page in Chromium at desktop (1366px) and mobile (390px).
**Date:** 25 November 2026

---

## 1. Critical — broken today

| # | Issue | Where | Impact | Fix |
|---|-------|-------|--------|-----|
| C1 | **Quote form doesn't send anything.** No `action` or backend. The submit button wraps an `<a href="mailto:…">` and an orphan `</li>`, which is invalid HTML. | `contact.html` (form + submit button) | Every enquiry typed into the form is lost. This is the site's main conversion point. | Hook the form up to a form service (Formspree, Netlify Forms, Web3Forms), or send it as a prefilled WhatsApp message. Add a success/error state and a plain "Send request" button. |
| C2 | **Footer text is invisible.** `.site-footer p, .site-footer li` is `rgba(0,0,0,0.8)` (black) on the navy footer. | `css/style.css:321-324` | The tagline and © line can't be read on any page, and it looks broken. | Set the colour to `rgba(255,255,255,0.75)`. |
| C2b | **Card descriptions are invisible on dark sections.** The same rule colours `.why-card p` and `.value-card p` black, and those cards sit on the navy sections ("Why clients choose SNA" on Home, "Core values" on About). | `css/style.css` (same rule as C2) | Visitors only see the headings, not the selling points under them. | Give text on dark sections a light colour. |
| C3 | **Content stays hidden until the visitor scrolls.** `.reveal { opacity: 0 }` is only cleared by a scroll handler. In testing, nothing marked `.reveal` was visible on first load, including the section right under the hero. | `css/style.css:667`, `js/main.js` | Blank-looking pages on load, in print and on slow or JS-failing phones. Some crawlers and preview tools see empty sections. | Use `IntersectionObserver`, show content by default (only hide it once JS has added a `js` class), and respect `prefers-reduced-motion`. |
| C4 | **Contact page scrolls sideways on phones.** The map iframe has a fixed `width="600"`. | `contact.html` map | The page is 682px wide on a 390px phone. | Set the iframe to `width:100%` with an aspect-ratio wrapper. |
| C5 | **Map pins the wrong address.** The embed points to "70 Lady Grey St, Lemoenkloof". The business is at No. 06 Millree Court, Lady Grey St. | `contact.html` | Clients may go to the wrong place, and it weakens local trust. | Regenerate the embed from the correct Google Business Profile listing. |
| C6 | **Mobile visitors see only one testimonial.** The slider arrows are hidden at ≤720px, so there's no way to move to the next one. | `css/responsive.css` (`.slider-btn {display:none}`) | Two of the three testimonials are unreachable on mobile. | On mobile, stack the cards or make them swipeable/auto-rotating. |
| C7 | **Logo missing in the Services page footer.** The `<a class="logo">` is empty. | `services.html` footer | Inconsistent branding. | Add the `<img>`. |

## 2. Trust and content

- **Stock photos are shown as "our work."** The Gallery, the home page's "Recent work" section, the hero background and the social-share (OG) image are all Unsplash stock photos, hot-linked from unsplash.com. Visitors who notice will lose trust, and the images break if Unsplash changes its URLs. Real photos already exist in the repo (`images/team/1-3.png`, `images/image_1-3.jpg`, several unused). → Replace them with real before/after photos from SNA jobs and host all images locally.
- **Stats can't be backed up and will go stale.**
  - "100% Customer Satisfaction" has no source.
  - "16 Years" is hard-coded. 2009 to 2026 is 17 years, and the number will drift every year.
  - "467 clients" comes from the Dec 2022 profile.

  → Update the figures with the client, work out the years from 2009 automatically, and change "100%" to something that can be backed up (e.g. a Google rating).
- **Testimonials look unfinished.** "Christain - Betafench - *Current*" and "Mrs Shermon - *Domestic*" have typos and read like internal notes. KFC is named, and there's no record of permission to use its name. → Confirm written permission, fix the names and roles, and add star ratings or links to Google reviews.
- **The brand voice is inconsistent.** The site says "premium / luxury / boutique". The company profile and the logo strapline say "Contract cleaning for all business" and give *affordability* as a competitive advantage. The About copy is pasted from the profile, with a stray `<br>` and an unclosed `<p>`, and the Mission line has grammar errors ("best reputable cleaning company"). → Align on a single positioning: professional, reliable and affordable, for business and homes.
- **The services list doesn't match everywhere.** The footer "Services" list is different on every page. The profile lists mattress, car-seat, blinds, lounge-suite, sign & logo cleaning and "undercover" (cleaning while the owner is away) cleaning, but none of these are on the site. Pressure washing and upholstery are on the site but not in the profile. → Confirm the real list with the client and use it everywhere.
- **The strongest proof for business clients is buried.** SNA serves schools and government departments (Social Development, SASSA), but the site doesn't highlight it. There's no mention of B-BBEE level, CSD registration, public liability insurance or COIDA, which procurement teams ask for.
- **The business email is a personal Gmail address** (`andremuller093@gmail.com`). → Set up `info@snacleaning.co.za` (or similar) on the domain.

## 3. SEO and technical

- No structured data (`LocalBusiness` / `CleaningService` JSON-LD with address, hours, phone and area served).
- No `<link rel="canonical">` or `og:url`. Only the home page has an OG image, and it's a stock photo.
- There's one generic services page. There are no individual pages per service (e.g. "Office Cleaning in Paarl") or per area (Paarl, Wellington, Stellenbosch, Franschhoek, Cape Winelands), which are the searches that bring in local leads.
- No link to a Google Business Profile, no reviews, no analytics, no `404.html`.
- `sitemap.xml` has no `<lastmod>`. Need to confirm `www.snacleaning.co.za` is live and resolves.
- **Image weight:** `images/gallery/1.png` is 980 KB and `images/team/1.png` is 445 KB. There are no WebP/AVIF versions and no `width`/`height` attributes, which causes layout shift. The 2.8 MB profile PDF sits in `/docs` but isn't linked anywhere.
- **Page loader:** a full-screen loader waits for `window.load`, which includes fonts and remote images. This delays the first view and hurts Core Web Vitals (LCP). → Remove it.
- **Fonts:** 2 families and 8 weights are loaded. → Cut down to about 4 weights, or self-host.
- **Accessibility:**
  - The menu toggle has no `aria-expanded` / `aria-controls`, and the menu doesn't close after a link is tapped.
  - Gallery items can't be reached by keyboard.
  - The lightbox doesn't trap focus or return it when closed.
  - There's no skip link and no `:focus-visible` styling.
  - The "Service Needed" select has no placeholder option.
  - Arrow glyphs (← →) are used as button text.
- **Maintainability:** the header and footer are copy-pasted into 5 files. That's the root cause of the inconsistent footers and the missing logo. → Use a tiny build step (e.g. Eleventy) or a single JS include.

## 4. Conversion

- No sticky **WhatsApp / Call** button on mobile, even though WhatsApp is the main enquiry channel for SA service businesses.
- The quote form asks for name, email, service and message only. A quote needs a **phone number, suburb/area, property type and size, how often, and a preferred date**.
- No "How it works" (request → site visit/quote → clean → quality check), no FAQ, no service-area section, and no indication of starting prices or minimum call-out.
- The "Get Free Quote" and "Book Your Consultation" CTAs lead to a form that doesn't work (see C1).

---

## 5. Prioritised fix list

**Quick wins (1–2 days)**
1. Make the quote form work, and add phone, area and frequency fields (C1).
2. Fix the footer text colour, the missing logo, map width and map address (C2, C4, C5, C7).
3. Make reveal content visible by default and add reduced-motion support (C3).
4. Make testimonials work on mobile and fix the names (C6).
5. Add a sticky WhatsApp / Call button on mobile.
6. Remove the page loader, compress images and add width/height.

**Phase 2 — Trust and local SEO (1–2 weeks)**
7. Replace all stock imagery with real job photos and host them locally.
8. Agree on one positioning and one services list, and rewrite About/Services copy.
9. Add LocalBusiness JSON-LD, canonical/OG tags, `404.html` and sitemap `lastmod`.
10. Set up and optimise the Google Business Profile, and add a reviews link.
11. Add individual service pages and service-area pages.
12. Set up analytics (GA4 or Plausible) with form/WhatsApp click events.
13. Set up a business email on the domain.

**Phase 3 — Growth**
14. Add a "Commercial & Government" page: B-BBEE, CSD, insurance and a downloadable profile PDF (compressed).
15. Run a review-collection routine, with a review request link sent after each job.
16. Do the accessibility pass (menu ARIA, lightbox focus, keyboard gallery, focus styles).
17. Move the header and footer into a shared template, and set up monthly maintenance and reporting.

---

## Status — Phase 1 applied (26 Nov 2026)

The Phase 1 quick wins above, plus real photos and copy from the company profile, are applied on branch `claude/client-audit-proposal-ghv40s`. Still to confirm with the client:
- Testimonial spelling ("Christian, Betafence") and permission to name KFC and Betafence.
- Whether pressure washing is still offered.
- Higher-resolution job photos. Two of the current photos are only about 250–350px wide.
- The quote form sends requests through WhatsApp for now. It can be switched to a form service such as Formspree once there's an account.
