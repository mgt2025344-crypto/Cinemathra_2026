# CINEMATHRA 2026 — Digital Invitation

Responsive comic-editorial invitation built with plain HTML, CSS and JavaScript.
Works on phones, tablets, laptops and big screens (portrait and landscape).

## Files
- `index.html` — page structure and content
- `style.css` — design, responsive layout and all animations
- `app.js` — event details, personalised lecturer name/title, animation triggers
- `assets/` — CINEMATHRA, BITSA and Information Systems logos

## What's animated on page 2
- **THE BIG SCREEN AWAITS.** — letters drop in one by one, a yellow marker sweeps under BIG, BIG keeps pulsing,
  SCREEN / AWAITS ripple like a wave, a camera viewfinder (with blinking REC) focuses in around the title,
  a projector beam flickers and a "YOU'RE INVITED!" sticker pops in.
- **Date** — a calendar tile flips in and the day counts up (00 → 05), the month letters pop in.
- **Time** — red card with a live ticking clock icon.
- **Venue** — yellow card with a bouncing map pin and ripple.
- Animations start when each page scrolls into view (so on a phone the details animate as you scroll down).
- Users who enable "reduce motion" on their device get a calm version automatically.

## Change the date / time / venue
Open `app.js` and edit the `EVENT_DETAILS` object near the top:
```js
const EVENT_DETAILS = {
  date: "05 November 2026",      // format:  DD Month YYYY  (weekday is worked out automatically)
  time: "TIME TO BE ANNOUNCED",  // when ready use e.g. "6:00 PM" → shows as big numerals
  venue: "Andara Wawa Theatre"
};
```

## Personalised lecturer links
After publishing, append `?name=...&title=...` to the site URL. Example:
`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?name=Dr.%20Perera&title=Senior%20Lecturer`

For a different lecturer, change both `name` and `title`. Spaces should be URL-encoded as `%20`.

## Publish with GitHub Pages
Upload `index.html`, `style.css`, `app.js`, and the entire `assets` folder into the repository root.
Enable Settings → Pages → Deploy from a branch → `main` → `/(root)`.

No Firebase is needed for this version because RSVP collection is not included.
