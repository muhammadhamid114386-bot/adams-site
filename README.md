# Bergen County Sell & Move

Responsive HTML, CSS and JavaScript recreation of the supplied landing-page PDF, including its desktop and mobile layouts. Original laptop, phone, book and profile artwork is extracted from the provided reference. The approved brand font is Jost, selected as a free alternative to Futura, and the primary accent is `#0090FF`. No package dependencies or external font requests are required.

## Brand typography

Jost is hosted locally in `assets/fonts/jost-variable.woff2`, preloaded by the page, and used for all live headings, body text, buttons and form controls. Its variable weights cover 100–900. Source: [Google Fonts](https://fonts.google.com/specimen/Jost), designed by [indestructible type](https://indestructibletype.com/Jost.html). Its SIL Open Font License is included in `assets/fonts/JOST-LICENSE.txt`.

The brand color is defined once as `--blue` in `styles.css`. Buttons, icons, numbered points, selected calendar states, focus rings and favicon use `#0090FF`; supporting tints and darker hover states are derived from it. Existing reference artwork is embedded as images.

## Run locally

Requires Node.js 20 or newer.

```sh
git clone https://github.com/muhammadhamid114386-bot/adams-site.git
cd adams-site
npm ci --ignore-scripts
```

```sh
npm run dev
```

Open http://localhost:5173. Refresh the browser after editing files.

```sh
npm run check
npm run build
npm run preview
```

The production preview opens at http://localhost:4173. Deploy the contents of `dist/` to any static host.

GitHub Actions runs the JavaScript checks and production build for pushes to `main` and pull requests. Generated output, local reference files and verification captures are excluded from Git.

## Files

- `index.html`: page content and accessible markup.
- `styles.css`: reference styling, desktop and mobile layouts.
- `app.js`: guide form, modal controls and day/time selections.
- `site.config.js`: production destinations.
- `assets/`: original reference artwork and locally hosted font.

## Connect the original services

Update `site.config.js` when these assets and destinations are available:

| Setting | Expected value |
| --- | --- |
| `heroVideoUrl` | A direct MP4 or WebM URL for Adam's actual walkthrough. |
| `instagramUrl` | The testimonial URL included in the source PDF. |
| `adamStoryVideoUrl` | Optional direct MP4 or WebM for the Meet Adam section. When set, both story actions open the accessible video modal; otherwise they open the existing Instagram destination. |
| `adamStoryPosterUrl` | Real video poster for the Meet Adam phone. Defaults to a frame extracted from the original supplied walkthrough. |
| `guideUrl` | URL to the actual Sell & Move Guide PDF. The supplied landing-page reference is not the guide. |
| `formEndpoint` | A POST endpoint accepting JSON lead data. |
| `bookingUrl` | A real calendar or appointment-booking link. |
| `privacyPolicyUrl` | The business's approved privacy policy. |

The form sends `{ firstName, email, town, preferredDay, preferredTime }`. The endpoint should return a successful HTTP status and may return `{ "guideUrl": "https://..." }`. Apply validation and abuse prevention on the receiving service. Third-party endpoints must permit this site's origin. No keys or passwords belong in the public configuration.

Until a guide URL or endpoint is configured, valid form submissions show an honest unavailable message and do not send, save or pretend to submit personal data. With only a guide URL configured, the form opens the guide without transmitting lead details. Calendar buttons select a preference; they do not reserve an appointment. The main video and privacy policy show an unavailable message until their actual destinations are configured.

The layout follows the reference; PDF print-page gaps are intentionally removed. The mobile layout follows page 6, including the form above the guide cover. The source reference, extractions and local verification captures are kept in ignored development folders and are excluded from `dist/`.

The Meet Adam section follows the separately approved editorial reference. Its phone, information card, icons, calendar and actions are live markup, with reduced-motion and no-JavaScript fallbacks. The phone poster uses the existing walkthrough frame, rather than the concept portrait. Its decorative property thumbnails come from the supplied design and are not represented as actual listings. The cost graphic says “Cost review”; no unverified sale-cost percentage is displayed.
