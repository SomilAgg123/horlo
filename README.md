# Horlo

A personal watch collection and discovery project by [SomilAgg123](https://github.com/SomilAgg123).

Horlo is being rebuilt as a self-contained interactive demo for GitHub Pages. Explore a watch catalogue, curate a collection, and try the experience without an account.

Implementation is delivered through focused pull requests. The earlier React and FastAPI experiments informed this edition; historical credentials and backend services are not part of this repository.

## Run locally

Use Node.js 24 (or `nvm use`), then run:

```sh
npm ci
npm run dev
```

Open the printed `/horlo/` URL. `npm run check` runs TypeScript, unit tests, and a production build. No environment variables, accounts, database, or external API are needed.

See [catalogue sources and artwork credits](docs/CATALOGUE-SOURCES.md).
