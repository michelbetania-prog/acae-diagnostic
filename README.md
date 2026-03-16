# BIEM Insight

BIEM Insight is a strategic diagnostic web application for founders and businesses.

It guides users through a mentor-like strategic conversation, diagnoses structural business issues, and delivers a multi-step report that drives conversion to a free BIEM strategy session.

## Stack
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS

## Core architecture
- `lib/conversation-engine` — conversational flow and questions
- `lib/scoring-engine` — stage + potential scoring
- `lib/diagnostic-engine` — structural challenge detection and recommendation logic
- `lib/report-engine` — structured strategic report generation
- `app/api/insight/*` — backend routes for lead capture and diagnostic processing

## Run locally
```bash
npm install
npm run dev
npm run lint
npm run build
```

## Documentation
- `docs/BIEM_APP_ARCHITECTURE.md`
