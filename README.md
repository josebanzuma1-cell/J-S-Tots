# J & S Tots Pre-School — Munyonyo

A five-page marketing site for J & S Tots Pre-School, Munyonyo, Kampala.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies —
copy the folder onto any host (Hostinger, Netlify, cPanel, GitHub Pages) and it works.

## Run it locally

```bash
node server.js
```

Then open <http://localhost:4188>. Pass a port as an argument to use a different one.

## Pages

| File | What's on it |
| --- | --- |
| `index.html` | Hero, why-choose-us, mission, class carousel, day flow, values, enrol CTA |
| `about.html` | Mission, vision, focus, the approach, the five values |
| `programmes.html` | Playing Class, Nursery, Primary One, Kids Activity, typical day |
| `admissions.html` | How to enrol, what to bring, enquiry form, FAQ |
| `contact.html` | Phone, WhatsApp, location, hours, enquiry form, directions |
| `404.html` | Served by `server.js` for unknown paths |

## Where the content came from

Everything factual on the site comes from the school's own two posters:

- **The flyer** — name, Munyonyo, Playing / Nursery–P.1 / Kids Activity, admissions
  open, "colourful classrooms, experienced staff, activity-based learning",
  8:00 am – 5:00 pm Mon–Fri, 0774 197 708, opposite Munyonyo C.O.U. Church.
- **The mission board** — the mission, vision, focus and the five values, quoted
  almost word for word (spelling tidied, meaning unchanged).

Anything the posters did not state is either framed as an outline (the daily
timetable) or sent to a phone call (fees, uniform, term dates, exact class ages).
**There are no invented facts, no fake parent testimonials and no made-up figures.**
The "What we stand for" carousel on the home page quotes the school's real values
rather than inventing reviews — swap it for genuine parent quotes once you have them.

## Things to update before going live

1. **Map link** — `contact.html` currently searches Google Maps for *Munyonyo C.O.U.
   Church* as a landmark. Replace that `href` with the school's own map pin.
2. **Fees and term dates** — deliberately not published. If you want them on the
   site, add them to the FAQ in `admissions.html`.
3. **Email address** — there isn't one on the posters, so the site uses phone and
   WhatsApp only. If the school has an email, add it to the footer and contact page.
4. **Social links** — the footer has WhatsApp and phone. Add Facebook/Instagram if
   the school has accounts.

## Swapping the illustrations for photos

The pictures are hand-drawn SVGs in `assets/img/` so the site looks finished without
using stock photos of other people's children. Replacing them with real photos is a
one-line change each — the CSS already crops and rounds whatever you drop in:

```html
<!-- before -->
<img src="assets/img/illus-play.svg" alt="" width="800" height="600">
<!-- after -->
<img src="assets/img/playing-class.jpg" alt="Playing Class children building with blocks" width="1600" height="1200">
```

Suggested sizes: hero `1600×1000`, card and split images `1200×900`. Write a real
`alt` description for each, and get parents' permission before putting children's
photographs online.

## Design system

Taken from the reference site in the brief, re-pitched around the school's own badge
colours (red, navy, green from the logo; the flyer's amber).

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#faf3e6` | Page background |
| `--sand` | `#f7e3bc` | Footer, CTA panel |
| `--ink` | `#3b2217` | Text, dark bands, primary buttons |
| `--red` | `#d3262c` | Brand accent, numbers, primary CTA |
| `--navy` | `#24386f` | Brand accent |
| `--green` / `--gold` | `#2e8b57` / `#f2a71b` | Brand accents |
| `--lav` `--sage` `--peach` `--sky` `--butter` | pastels | Icon tints, tilt cards |

Type is **Quicksand** for headings and **Nunito** for body, both from Google Fonts.
All tokens live at the top of `assets/css/style.css`.

## Behaviour

`assets/js/main.js` is dependency-free and everything degrades without it:

- Mobile menu (click, Escape, click-outside to close)
- Scroll reveals via `IntersectionObserver`, skipped under `prefers-reduced-motion`
- Carousels scroll to real snap positions, with arrows that disable at each end
- Rotating news ticker in the hero
- FAQ accordion
- Enquiry form composes a WhatsApp message and opens it — **nothing is sent until
  the parent presses send inside WhatsApp.** There is no server and no database, so
  no personal data is stored anywhere.

## Accessibility notes

Skip link, one `h1` per page, `aria-current` on the active nav item, labelled form
fields, `aria-expanded` on the menu and accordion, visible focus rings, and reduced-motion
support throughout. Checked at 375 px and 1280 px with no horizontal scroll.
