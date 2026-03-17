# SmartBin Cebu / CebuEcoGuard MVP

Pitch-ready scaffold for a smart waste + urban resilience platform targeting SDG 11.

## Stack
- **Mobile:** Flutter (camera-based TFLite classification, rewards, pickup notifications, bin status)
- **Web:** Next.js 15 + Tailwind (dashboard with heatmap, fill-levels, VRP stub)
- **Backend:** NestJS-style API (bins, rewards, schedules, analytics, AI placeholder, MQTT ingest) + Prisma schema for Postgres/PostGIS
- **IoT:** MQTT simulator for ESP32 smart bins

## Quickstart
1) **Mobile:** `flutter pub get` then `flutter run` inside `cebu_clean_ai/`. Update `lib/services/api_service.dart` `API_BASE_URL` env if backend not on localhost.
2) **Backend:** `cd backend && npm install && npm run start:dev` (requires Node 18+). Copy `.env.example` to `.env` and set `DATABASE_URL` / `MQTT_URL`.
3) **IoT sim:** `npm run simulate:iot` (needs local Mosquitto or AWS IoT Core credentials).
4) **Web dashboard:** `cd web-dashboard && npm install && npm run dev` then open http://localhost:3000 (expects backend at `localhost:3001/api` or set `NEXT_PUBLIC_API`).

## Platform notes
- **Camera scanning:** Supported on iOS, Android, and macOS (desktop). Not supported on web in this scaffold; web shows an info message instead of a preview. If you want web camera, add `camera_web`, serve over HTTPS, and request permissions.
- **Permissions:** iOS/macOS `Info.plist` already includes `NSCameraUsageDescription`. Accept the prompt on first launch or the preview stays black.
- **API base URL:** Flutter uses `API_BASE_URL` (default `http://localhost:3001/api`). Pass `--dart-define=API_BASE_URL=<url>` to override.
- **Offline demos:** Mobile screens fall back to mock data if the backend is down.

## Notable Endpoints
- `GET /api/bins` — live bin status (mock + MQTT feed)
- `GET /api/rewards/points` — resident reward balance
- `GET /api/schedules` — barangay pickup windows
- `POST /api/ai/classify` — placeholder waste classifier

## Extend
- Replace `backend/src/ai/ai.controller.ts` with TF Lite or SageMaker inference.
- Connect Prisma to PostGIS for spatial routing, then expose VRP results to `web-dashboard`.
- Wire push notifications (FCM/SNS) in `lib/screens/schedule_screen.dart`.
