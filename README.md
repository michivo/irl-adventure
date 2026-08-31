# IRL Adventure

A platform for playing adventure-style games in the real world, on mobile.

## Structure (pnpm monorepo)

```
apps/
  admin/    # Vue 3 + TypeScript + Vite SPA, PrimeVue - game management dashboard
  player/   # Vue 3 + TypeScript + Vite SPA + PWA, PrimeVue - mobile game client
api/        # Go REST API, deployed to Google App Engine Standard
.github/workflows/  # CI + deploy pipelines
firebase.json, .firebaserc  # Firebase Hosting config (multi-site: admin + player)
```

## Local development

```powershell
pnpm install
pnpm dev:admin    # http://localhost:5173
pnpm dev:player   # http://localhost:5174

cd api
go run .          # http://localhost:8080
```

## Deployment

- **API** deploys to App Engine Standard via [.github/workflows/deploy-api.yml](.github/workflows/deploy-api.yml), authenticating with Workload Identity Federation.
- **Admin** and **Player** frontends deploy to Firebase Hosting (same GCP project as the API) via [.github/workflows/deploy-admin.yml](.github/workflows/deploy-admin.yml) and [.github/workflows/deploy-player.yml](.github/workflows/deploy-player.yml).
- Everything deploys straight to production on merge to `main` (no staging environment yet).

### One-time manual setup (not covered by these files)

1. Create/select a GCP project, enable App Engine (Standard) and pick a region.
2. Run `gcloud app deploy` once manually or via console to initialize the App Engine app.
3. Add Firebase to the **same** GCP project (`firebase init` or via the Firebase console).
4. Create two Firebase Hosting sites (one for admin, one for player), then fill in [.firebaserc](.firebaserc) with the GCP project ID and the two Hosting site IDs, and run `firebase target:apply hosting admin <admin-site-id>` / `firebase target:apply hosting player <player-site-id>`.
5. Set up Workload Identity Federation for GitHub Actions → App Engine deploy, and store `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`, `GCP_PROJECT_ID` as repo secrets.
6. Run `firebase init hosting:github` (or create a scoped service account manually) to generate the `FIREBASE_SERVICE_ACCOUNT` secret, and add `FIREBASE_PROJECT_ID` as a repo secret.
7. Replace the placeholder PWA icons in `apps/player` (`pwa-192x192.png`, `pwa-512x512.png`) with real artwork.