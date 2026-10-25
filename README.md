# CINEMATHRA 2026 — Digital Invitation

Responsive comic-editorial invitation built with plain HTML, CSS and JavaScript.

## Files
- `index.html` — page structure and content
- `style.css` — design, responsive layout, camera and page-opening animations
- `app.js` — event details and personalised lecturer name/title
- `assets/` — the original CINEMATHRA, BITSA and Information Systems logos supplied for this project

## Preview
Open `index.html` in a browser, or use VS Code's Live Server extension.

## Change the time / venue
Open `app.js` and edit the `EVENT_DETAILS` object near the top:
```js
const EVENT_DETAILS = {
  date: "05 November 2026",
  time: "TIME TO BE ANNOUNCED",
  venue: "Andara Wawa Theatre"
};
```
The time is currently a placeholder because no time was provided yet.

## Personalised lecturer links
After publishing, append `?name=...&title=...` to the site URL. Example:
`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?name=Dr.%20Perera&title=Senior%20Lecturer`

For a different lecturer, change both `name` and `title`. Spaces should be URL-encoded as `%20`.
Example:
`...?name=Professor%20Silva&title=Professor`

## Publish with GitHub Pages
Upload `index.html`, `style.css`, `app.js`, and the entire `assets` folder into the repository root. Enable Settings → Pages → Deploy from a branch → `main` → `/(root)`.

No Firebase is needed for this version because RSVP collection is not included.
