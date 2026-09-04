# IRL Adventure

A platform for playing adventure-style games in the real world, on mobile.

## Structure (pnpm monorepo)

```
apps/
  admin/    # Vue 3 + TypeScript + Vite SPA, PrimeVue - game management dashboard
  player/   # Vue 3 + TypeScript + Vite SPA + PWA, PrimeVue - mobile game client
.github/workflows/  # CI + deploy pipelines
firebase.json, .firebaserc  # Firebase Hosting config (multi-site: admin + player)
```

Frontends access Firestore directly (no backend API).

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