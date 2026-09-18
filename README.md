# IRL Adventure

A platform for playing adventure-style games in the real world, on mobile.

## Structure (pnpm monorepo)

```
apps/
  admin/    # Vue 3 + TypeScript + Vite SPA, NuxtUI - game management dashboard
  player/   # Vue 3 + TypeScript + Vite SPA + PWA, NuxtUI - mobile game client
agents/     # Node/TypeScript scripts that use the OpenAI Agents SDK to generate game content
.github/workflows/  # CI + deploy pipelines
firebase.json, .firebaserc  # Firebase Hosting config (multi-site: admin + player)
```

Frontends access Firestore directly (no backend API).

## Agents

The [agents/](agents/) folder holds standalone scripts built on the [`@openai/agents`](https://www.npmjs.com/package/@openai/agents) SDK for authoring game content offline.

- **Tour Builder** ([agents/tourbuilder.ts](agents/tourbuilder.ts)) — the first agent added to the repo. It prompts for a location, plans a walking tour of 3-5 nearby points of interest, generates an audio description for each POI using the text-to-speech tool ([agents/ttstool.ts](agents/ttstool.ts), via `@andresaya/edge-tts`), and assembles the result into a `Game` JSON file (stages with `PLAY_AUDIO` actions and location-based preconditions) written to `agents/output/`.

Run it from the `agents/` package with:

```powershell
pnpm start:tourbuilder
```

## Local development

```powershell
pnpm install
pnpm dev:admin    # http://localhost:5173
pnpm dev:player   # http://localhost:5174
```

## Deployment

- **Admin** and **Player** frontends deploy to Firebase Hosting via [.github/workflows/deploy-admin.yml](.github/workflows/deploy-admin.yml) and [.github/workflows/deploy-player.yml](.github/workflows/deploy-player.yml).
- Everything deploys straight to production on merge to `main` (no staging environment yet).

### One-time manual setup (not covered by these files)

1. Create a Firebase project (`firebase init` or via the Firebase console) and enable Firestore.
2. Create two Firebase Hosting sites (one for admin, one for player), then fill in [.firebaserc](.firebaserc) with the GCP project ID and the two Hosting site IDs, and run `firebase target:apply hosting admin <admin-site-id>` / `firebase target:apply hosting player <player-site-id>`.
3. Run `firebase init hosting:github` (or create a scoped service account manually) to generate the `FIREBASE_SERVICE_ACCOUNT` secret, and add `FIREBASE_PROJECT_ID` as a repo secret.
4. Replace the placeholder PWA icons in `apps/player` (`pwa-192x192.png`, `pwa-512x512.png`) with real artwork.
