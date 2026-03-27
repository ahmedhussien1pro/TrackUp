# TrackUp

Career guidance platform. Discover your track, build your roadmap, grow with mentors.

## Stack

- HTML + TailwindCSS + Vanilla JS (no frameworks)
- Modular component-based architecture
- Multi-language: EN / AR (RTL)
- Dark / Light mode

## Structure

```
trackup/
├── index.html
├── styles/          # tokens, base, animations, components
└── src/
    ├── app.js       # entry point + router bootstrap
    ├── state.js     # pub/sub global store
    ├── router.js    # hash-based SPA router
    ├── i18n.js      # translation utility
    ├── utils.js     # helpers
    ├── data/        # mock data + API stubs
    ├── services/    # business logic layer
    ├── components/  # reusable UI
    └── screens/     # page-level views
```

## Dev

Open `index.html` directly in browser or serve with any static server.
