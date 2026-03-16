# BIEM Insight Web Application Architecture

## Product flow
1. Landing page
2. Email capture
3. Conversational diagnostic (10 questions)
4. Analysis screen (3–4 seconds simulation)
5. Multi-step report (result, strengths, challenges, strategic focus)
6. Email report decision
7. Strategic session booking

## Core modules
- `lib/conversation-engine/index.ts`
- `lib/scoring-engine/index.ts`
- `lib/diagnostic-engine/index.ts`
- `lib/report-engine/index.ts`
- `lib/biem-insight/types.ts`

## API routes
- `POST /api/insight/lead` — captures lead info.
- `POST /api/insight/diagnose` — returns structured strategic report JSON.

## Report output JSON
```json
{
  "stage": "PROJECT",
  "strengths": ["..."],
  "challenges": ["..."],
  "recommendation": "...",
  "potential_level": "Moderate potential"
}
```

## Database schema proposal
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  business_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE diagnostic_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  stage TEXT,
  potential_level TEXT
);

CREATE TABLE answers (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer_option_id TEXT NOT NULL,
  answer_score INT NOT NULL
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  report_json JSONB NOT NULL,
  sent_by_email BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
