# BIEM Insight - Foundational Architecture

## 1) System Architecture (Modular / Microservice-Ready)

BIEM Insight is designed as a modular monolith with clear service boundaries that can be extracted into microservices.

### Core modules

1. **Questionnaire Engine** (`lib/biem/questionnaire.ts`)
   - Owns strategic questionnaire definition (30 questions / 5 categories).
2. **Business Intelligence Scoring Engine** (`lib/biem/scoringEngine.ts`)
   - Converts answers to normalized 0–100 scores by strategic dimensions.
3. **Problem Detection Engine** (`lib/biem/problemDetectionEngine.ts`)
   - Runs deterministic rule-based diagnostics for structural weaknesses.
4. **Strategic Route Engine** (`lib/biem/strategicRouteEngine.ts`)
   - Maps detected problems to prioritized strategic routes.
5. **Solution Knowledge Base** (`lib/biem/solutionKnowledgeBase.ts`)
   - Provides a categorized solution library (63 solutions) with metadata.
6. **Reporting Engine** (`lib/biem/reportEngine.ts`)
   - Produces structured JSON report for product and dashboard use.
7. **AI Analysis Preparation Layer** (`lib/biem/aiPreparationLayer.ts`)
   - Produces clean payload for external AI analysis (Google Gemini integration).

### Orchestration layer

- `runBIEMDiagnostic` in `lib/biem/index.ts` executes all engines in sequence:
  1. score calculation
  2. business stage inference
  3. problem detection
  4. route recommendation
  5. report generation
  6. AI payload preparation

### API layer

- `app/api/biem/diagnose/route.ts`
  - `POST /api/biem/diagnose` runs a full diagnostic pipeline.
  - `GET /api/biem/diagnose` returns endpoint metadata.

---

## 2) Data Models

### Questionnaire model

```ts
{
  id: string,
  question: string,
  type: "multiple_choice" | "numeric" | "boolean",
  weight: number,
  category: "market_problem_validation" | "value_proposition_differentiation" | "customer_acquisition_system" | "revenue_structure" | "digitalization_scalability"
}
```

### Score model

```ts
{
  overall_score: number,
  dimension_scores: {
    strategy: number,
    value_proposition: number,
    customer_acquisition: number,
    revenue_structure: number,
    digitalization: number,
    scalability: number
  }
}
```

### Problem model

```ts
{
  id: string,
  problem: string,
  cause: string,
  severity: "low" | "medium" | "high",
  related_dimension: string,
  trigger_rule: string
}
```

### Strategic route model

```ts
{
  id: string,
  title: string,
  description: string,
  complexity_level: "low" | "medium" | "high",
  related_business_dimension: string
}
```

### Solution model

```ts
{
  id: string,
  title: string,
  description: string,
  category: "Market Validation" | "Positioning" | "Customer Acquisition" | "Digital Transformation" | "Offer Structure" | "Monetization" | "Growth Systems" | "Optimization" | "Innovation",
  applicable_problem: string,
  complexity_level: "low" | "medium" | "high",
  maturity_stage: "idea" | "validation" | "early_growth" | "scaling" | "established"
}
```

---

## 3) Example PostgreSQL Schema

```sql
CREATE TABLE biem_questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'numeric', 'boolean')),
  weight NUMERIC(4,2) NOT NULL,
  category TEXT NOT NULL,
  scale_min NUMERIC,
  scale_max NUMERIC,
  contributes_to TEXT[] NOT NULL
);

CREATE TABLE biem_diagnostics (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  business_stage TEXT NOT NULL,
  overall_score INT NOT NULL,
  dimension_scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  report JSONB NOT NULL,
  ai_payload JSONB NOT NULL
);

CREATE TABLE biem_problems (
  id UUID PRIMARY KEY,
  diagnostic_id UUID NOT NULL REFERENCES biem_diagnostics(id) ON DELETE CASCADE,
  problem_code TEXT NOT NULL,
  problem TEXT NOT NULL,
  cause TEXT NOT NULL,
  severity TEXT NOT NULL,
  related_dimension TEXT NOT NULL,
  trigger_rule TEXT NOT NULL
);

CREATE TABLE biem_routes (
  id UUID PRIMARY KEY,
  diagnostic_id UUID NOT NULL REFERENCES biem_diagnostics(id) ON DELETE CASCADE,
  route_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  complexity_level TEXT NOT NULL,
  related_business_dimension TEXT NOT NULL
);

CREATE TABLE biem_solutions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  applicable_problem TEXT NOT NULL,
  complexity_level TEXT NOT NULL,
  maturity_stage TEXT NOT NULL
);
```

---

## 4) Service Structure (Scalable)

### Current modular monolith boundaries

- `biem-questionnaire-service`
- `biem-scoring-service`
- `biem-problem-service`
- `biem-route-service`
- `biem-solution-catalog-service`
- `biem-report-service`
- `biem-ai-payload-service`
- `biem-api-gateway`

### Suggested extraction path

1. Keep all modules in-process (current).
2. Move scoring + problem detection into stateless services.
3. Move solution knowledge base into dedicated catalog service.
4. Add async eventing (`diagnostic.created`) for downstream AI enrichment.

---

## 5) API Endpoints

### `POST /api/biem/diagnose`

**Request body**

```json
{
  "answers": {
    "Q01": 4,
    "Q02": 3,
    "Q03": 15,
    "Q04": true
  }
}
```

**Response body (shape)**

```json
{
  "report": {
    "business_score": 45,
    "problems_detected": [],
    "opportunities": [],
    "recommended_routes": [],
    "dimension_analysis": {}
  },
  "ai_payload": {
    "business_stage": "validation",
    "user_responses": {},
    "calculated_scores": {},
    "detected_problems": [],
    "recommended_routes": [],
    "metadata": {
      "generated_at": "2026-01-01T00:00:00.000Z",
      "engine_version": "1.0.0",
      "format": "biem_ai_payload_v1"
    }
  },
  "solutions_catalog_matches": []
}
```

### `GET /api/biem/diagnose`

Returns metadata describing available BIEM diagnostic endpoint(s).

---

## 6) AI Analysis Preparation Output

Payload for Google Gemini or other external AI is normalized to include:

- original user responses,
- computed score model,
- rule-detected structural problems,
- strategic routes,
- inferred business stage,
- generation metadata/versioning.

This avoids prompt contamination and allows deterministic + explainable pre-analysis before AI reasoning.
