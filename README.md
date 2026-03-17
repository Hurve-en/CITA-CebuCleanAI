# CebuCleanAI / SmartBin Cebu
High-impact smart waste & urban resilience MVP for Cebu City, aligned with **SDG 11 – Sustainable Cities and Communities**.

## Why we built this
- Cebu’s landfill pressure and illegal dumping are rising; barangays need real-time visibility to act before overflow and flooding.
- Residents want simple guidance and incentives for proper segregation—without extra friction.
- City and barangay officials need spatial analytics (fill-levels, hotspots, flood-risk) and optimized routes to stretch limited trucks and budgets.

## What’s innovative
- **On-device AI waste scan** (Flutter + TFLite) for low-latency, low-data classification at the point of disposal.
- **Smart-bin telemetry + MQTT** to surface fill-levels, temperature, and GPS for live operations and flood/dumping risk.
- **Gamified rewards** tied to correct segregation and community reporting.
- **Route optimization stub** ready to plug into VRP/OR-Tools with PostGIS data.
- **Dual UX**: mobile-first for residents; web dashboard for officials with heatmaps and SDG-11 scorecards.

## Tech stack
- **Mobile:** Flutter (camera, TFLite, rewards, schedules, bin status)
- **Web dashboard:** Next.js 15 + Tailwind + SWR (heatmap, fill-levels, VRP stub)
- **Backend:** NestJS-style Node API (bins, rewards, schedules, analytics, AI placeholder, MQTT ingest) + Prisma schema for Postgres/PostGIS
- **AI:** TensorFlow Lite placeholder for on-device; can swap in PyTorch/SageMaker endpoint
- **IoT:** MQTT integration + simulator for ESP32 smart bins
- **Data:** PostgreSQL/PostGIS (planned), Redis for caching (planned)

## Overview of features
- **Resident app:** scan waste, see immediate classification, earn points, view pickup schedules, and check nearby bin status.
- **Operations dashboard:** live bin fill bars, illegal-dump/flood-risk heatmap, SDG 11 metrics, and route list for collections.
- **IoT & simulation:** ingest bin telemetry over MQTT; dev simulator publishes realistic fill/temperature/GPS events.

## Run the MVP (summary)
- Mobile: `flutter pub get && flutter run --dart-define=API_BASE_URL=http://localhost:3001/api`
- Backend: `cd backend && npm install && npm run start:dev` (copy `.env.example` to `.env`)
- IoT sim: `npm run simulate:iot` (with local Mosquitto/AWS IoT broker)
- Web: `cd web-dashboard && npm install && npm run dev` (set `NEXT_PUBLIC_API` if not localhost)
