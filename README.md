# Intel Sustainability Summit: Event Check-In

A responsive event check-in demo built with HTML, CSS, and JavaScript. Enter an attendee name and select a team to update the total attendance, team counts, and progress toward a goal of 50 attendees.

## Run locally

Open `index.html` with VS Code Live Server, or use the included development server:

```sh
npm install
npm run dev
```

Visit http://localhost:3000. Set `PORT` to use another port. GitHub Pages can serve the static files directly without Node.js.

## Behavior

- Each valid submission counts as one check-in and logs the name and team in the browser console.
- Fields reset and focus returns to the name input after check-in.
- The progress bar fills at 50; additional attendees still count.
- Counts reset on refresh. This demo has no database or duplicate-attendee detection and does not synchronize across devices.
- Both fields have labels, keyboard focus indicators, and accessible feedback. The layout stacks on smaller screens and respects reduced-motion preferences.

## Files

`index.html`, `style.css`, and `script.js` provide the interface and check-in behavior. `img/` contains the branding assets. `server.js` and `package.json` support local previews. `.devcontainer/` and `.github/` contain project tooling. `prompts.md` retains the assignment's AI prompt notes.

## Check syntax

```sh
npm run check
```
