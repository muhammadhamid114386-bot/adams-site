# Bergen County Sell & Move

Responsive HTML, CSS and JavaScript recreation of the supplied landing-page PDF, including its desktop and mobile layouts. Original laptop, phone, book and profile artwork is extracted from the provided reference. The approved brand font is Jost, selected as a free alternative to Futura, and the primary accent is `#0090FF`. No package dependencies or external font requests are required.

## Brand typography

Jost is hosted locally in `assets/fonts/jost-variable.woff2`, preloaded by the page, and used for the site's headings, body text and buttons. The embedded GHL form controls its own typography. Jost's variable weights cover 100–900. Source: [Google Fonts](https://fonts.google.com/specimen/Jost), designed by [indestructible type](https://indestructibletype.com/Jost.html). Its SIL Open Font License is included in `assets/fonts/JOST-LICENSE.txt`.

The brand color is defined once as `--blue` in `styles.css`. Buttons, icons, numbered points, focus rings and favicon use `#0090FF`; supporting tints and darker hover states are derived from it. Existing reference artwork is embedded as images.

## Run locally

Use Node.js 24.x, matching `.nvmrc`, GitHub Actions and the Vercel build.

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

For Vercel, the repository-root `vercel.json` selects the Other/static preset, installs with `npm ci --ignore-scripts`, builds with `npm run build`, and publishes `dist/`. This overrides a stale `public` output-directory setting. The Vercel project Root Directory should be the repository root, where `package.json` and `vercel.json` live. No Node server or framework adapter is required in production.

GitHub Actions runs the JavaScript checks and production build for pushes to `main` and pull requests. Generated output, local reference files and verification captures are excluded from Git.

## Files

- `index.html`: page content and accessible markup.
- `styles.css`: reference styling, desktop and mobile layouts.
- `app.js`: video playback, privacy dialog and scroll reveals.
- `site.config.js`: production destinations.
- `assets/`: original reference artwork and locally hosted font.

## Connected services

The guide card contains the supplied GoHighLevel/LeadConnector form `uhIa4K9dXfwiYIrGfaTY`, loaded directly from `https://api.leadconnectorhq.com/widget/form/uhIa4K9dXfwiYIrGfaTY`. The official `https://link.msgsndr.com/js/form_embed.js` script handles iframe resizing. The supplied activation, layout and cookie-consent attributes are preserved. The native form currently includes Full Name, Email, Phone and Town. Validation, lead submission and the post-submit destination are controlled by that GHL form; there is no duplicate local submission handler or separate endpoint to configure. Live test leads were not submitted during verification.

The site's clay card, heading and privacy note surround the original hosted form. Its internal fields and button are styled in GHL's form builder, because the cross-origin iframe cannot inherit this site's CSS. A direct form link remains available if the embed cannot load.

Update `site.config.js` when these assets and destinations change:

| Setting | Expected value |
| --- | --- |
| `instagramUrl` | The testimonial URL included in the source PDF. |
| `adamStoryVideoUrl` | Direct MP4 or WebM played inside the Meet Adam phone. Defaults to the local `assets/adam-story.mp4`, sourced from the Instagram post already linked in the supplied reference. Both story buttons use this player. |
| `adamStoryPosterUrl` | Real video poster for the Meet Adam phone. Defaults to a frame extracted from the original supplied walkthrough. |
| `privacyPolicyUrl` | The business's approved privacy policy. |

The privacy policy shows an unavailable message until its destination is configured. No keys or passwords belong in the public configuration.

The hero VSL uses the supplied Wistia Aurora embed, media ID `oo9ztma0o2`, in a responsive frame with a thin blue border, rounded corners and a soft shadow. Its native poster uses `assets/hero-adam-thumbnail.jpg`, an unaltered frame at 31.4 seconds showing Adam facing the camera. `app.js` resolves the image to an absolute URL for Wistia on both local and deployed hosts. The same image fills the reserved 16:9 screen while the component loads. Wistia's scripts load asynchronously from `fast.wistia.com`; its original controls play the video from the beginning. The Meet Adam phone video is independent.

The layout follows the reference; PDF print-page gaps are intentionally removed. The mobile layout follows page 6, including the form above the guide cover. The source reference, extractions and local verification captures are kept in ignored development folders and are excluded from `dist/`.

The Meet Adam section uses a centered heading and action group, with the phone and introduction/card between them. Its phone, information card, icons, calendar and actions are live markup. The local video plays inline inside the phone, with native controls and a stop/return-to-preview button; it never opens a modal or new tab during the normal flow. The secondary story button scrolls back to the phone and starts/resumes playback. Escape also stops playback and returns keyboard focus to the play button. The source video is the public Instagram post already linked in the supplied reference: https://www.instagram.com/p/DPFWOPkAcvM/. It loads only when requested. A no-JavaScript link to that original post is provided.

The phone poster uses the existing walkthrough frame, rather than the concept portrait. Its decorative property thumbnails come from the supplied design and are not represented as actual listings. The cost graphic says “Cost review”; no unverified sale-cost percentage is displayed. The FAQ leads directly to the footer. Card hover feedback uses gentle movement/shadow rather than color changes, with reduced-motion support.
