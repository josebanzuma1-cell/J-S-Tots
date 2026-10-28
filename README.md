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

## Motion

### The hero and the sheet

On the home page the hero **pins** and the rest of the page rides up over it. That
overlap is plain `position: sticky` plus stacking order, not an animation, so it
works in every browser.

It needs one piece of markup: everything below the hero lives in a single
`<div class="after-hero">` wrapper. It cannot be done per-section — the sections are
transparent, so a pinned hero would show straight through them. **If you add a
section to `index.html`, put it inside that wrapper.**

As the sheet climbs, the hero recedes behind it: the wording lifts and fades, the
card dims and settles back, and the picture pushes in slowly. Three layers at three
speeds, which is what makes it read as depth rather than as a fade.

The timeline for that comes from `.after-hero`, not from the hero itself. A pinned
element never moves, so its own view timeline sits at progress 0 for the whole page;
measuring the sheet climbing over it gives the motion something that actually
travels, and it finishes exactly as the hero disappears. That needs
`timeline-scope: --cover` on `main`, because the hero is a *preceding* sibling of the
element declaring the timeline.

**The hero must stay nearly as tall as the viewport, and that is load-bearing rather
than styling.** The fade is driven by the sheet *entering* the viewport, so a short
hero means the sheet is already on screen at scroll 0 and the hero renders part-faded
before anyone has touched the page. Below roughly 85% of the viewport height it
shows. An earlier `min-height: clamp(470px, 76vh, 720px)` put a 1920x1200 screen at
74% and rendered the headline at 0.81 opacity on load; a 375x812 phone sat at 67%.
It is now `max(470px, 92lvh)`, which holds the ratio at 0.92 from that phone up to a
1600x1440 monitor. **If you change that min-height, check the headline is still fully
opaque at scroll 0 on a tall screen.**

There is a ceiling as well as a floor, and it exists for the opposite reason. The
hero illustration is 1200x740, and with only a `min-height` the image's own ratio
drove the box on wide, short windows: at 1600x620 the hero came out **888px tall
inside a 620px viewport**, which pushed the bottom-aligned wording clean off the
screen. `max-height: 92lvh` caps it, and `min-height` still wins where the two
disagree, so the 470px floor survives on a very short window.

So the hero has two things to hold at once, and they pull against each other: **at
least ~85% of the viewport height**, or it loads part-faded, and **no more than the
viewport height**, or the wording falls below the fold. Both are satisfied at 0.92.
After changing either value, check a wide short window (1600x620) as well as a tall
one (1920x1200) — each catches only one of the two faults.

The hero itself carries only three things: the programme chips, the headline and the
news ticker. A lede paragraph used to sit between the headline and the ticker, but it
repeated the chips (the programmes) and the ticker (hours, place, phone), so it came
out. The page description meta tag still carries that wording for search engines.

### The hero layout

The hero is two columns: the school badge, the class chips, the headline and the
news ticker on the left, and `assets/img/graduate.webp` standing on the floor of the
card on the right. Below 900px they stack, wording above and the photograph beneath,
both pushed to the bottom of the card.

`.hero-media` now carries the hero's height itself, since there is no full-bleed
illustration left to set it, and the photograph is capped (`max-height: 78lvh`)
rather than given a height, so it can never be the thing that makes the hero taller
than the screen.

One more constraint turned up here. The hero is sized against the viewport but its
wording is sized against the text, and on a short window the wording wins: at
1390x536 the column came to 665px inside a 536px viewport and pushed itself off the
bottom. A `@media (max-height: 720px)` block compacts the column — smaller badge,
tighter gaps, smaller headline — which is enough for the hero to keep its promise of
fitting the screen.

### The two photographs

Both cut-outs share one rim: four `drop-shadow()` filters build a white sticker edge,
four more put the brand colours just outside it, and the last lifts the whole thing
off the page. Each drop-shadow applies to the *result* of the previous one, and that
is what makes concentric rings instead of one flat halo. The filter is static, so it
rasterises once and the animations only transform the finished texture.

`pupil.webp` originally straddled the hero seam. The graduate now fills that corner,
and the two overlapped across 72% of her, so she moved into the CTA panel — the one
place on the page with real empty space beside the wording, and its own
`overflow: hidden` crops her cleanly against the panel edge.

Each photograph runs two animations at once: a scroll-linked one and a slow idle so
they do not read as stickers. `animation-timeline` takes a list, one entry per
animation, which is the only way to mix a scroll timeline and the document clock on
a single element. The properties are split deliberately — the pupil's scroll arrival
animates `translate` and `scale`, so her idle may only use `rotate`, while the
graduate's scroll motion is `scale` alone, so hers gets `translate` and `rotate`.
Independent transform properties compose; a second `transform` would simply have won.

**A cascade trap worth knowing about.** The responsive `@media` blocks sit in the
middle of the stylesheet, not at the end, so any component declared below them wins
regardless of the media query — media queries add no specificity. The CTA's mobile
`padding-bottom` was written in the 900px block and silently did nothing, because
`.cta` is declared further down and its `padding` shorthand overrode it. Overrides
for anything declared below the responsive section go in the **late overrides** block
near the foot of the file instead.

### Playful touches

It is a pre-school, so nothing lands quite flat. `--ease-pop` overshoots a little and
drives the scroll reveals, the class chips spring to size one after another, the
hand-drawn doodles drift on a slow loop, icons shake when you point at them, and
buttons squash when pressed.

The school name sits mid-page as a row of toy bricks (`.blocks`), two of them with
eyes that blink and glance about. The row carries `role="img"` and its own label, so
a screen reader hears "J and S Tots" rather than seven loose letters. Below about
430px the bricks stop fitting on one line, so `.block-gap` becomes a full-width flex
break and the name stacks as J&S over TOTS — left to itself, flex-wrap split it as
"T O / T S".

Two things loop forever: the doodle drift and the name blocks. The blocks are much
the busier — seven bricks and four eyes — so if the page ever needs calming, start
there rather than with the doodles. All of it is transform-only and stays on the
compositor.

### Capitals

The site already set small labels in caps (eyebrows, feature headings, footer
headings). That now extends to the class chips, the primary buttons (`.btn-dark` and
`.btn-red`) and a `.shout` accent for a short key phrase inside body copy.

Headings are deliberately left alone. Caps cost reading speed, which is a fair trade
for a three-word label and a bad one for a sentence like "Where every child is known,
loved and ready to learn." Ghost and link buttons stay sentence case as well, so that
the emphasis on the primary action still means something.

### The two guards

1. Every animation rule sits inside `@media (prefers-reduced-motion: no-preference)`,
   so anyone who has asked their system to reduce motion gets a still page. The
   overlap still works for them, because sticky positioning is not an animation.
2. The scroll-linked rules *also* sit inside `@supports (animation-timeline: view())`,
   and **that guard is load-bearing, not politeness.** A browser that does not know
   `animation-timeline` would drop that one declaration, keep the rest, run the
   keyframes on the document timeline with no duration, and leave the hero parked at
   its end state — a card at opacity 0.2 with invisible headline text. Guarded, those
   browsers get the overlap without the dimming, which still looks deliberate.

Ranges are written against the sheet's own travel (`entry 15% entry 100%`) rather
than in pixels, so the effect keeps its shape on a phone and on a desktop with no
media query of its own.

## Accessibility notes

Skip link, one `h1` per page, `aria-current` on the active nav item, labelled form
fields, `aria-expanded` on the menu and accordion, visible focus rings, and reduced-motion
support throughout. Checked at 375 px and 1280 px with no horizontal scroll.
