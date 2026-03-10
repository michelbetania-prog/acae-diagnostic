# ACAE Diagnostic

Aplicación web para diagnosticar la salud estratégica de un negocio usando el método ACAE:

- A → Atracción
- C → Conversión
- A → Autoridad
- E → Escalabilidad

## Stack

- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- Recharts

## Flujo

Landing → Diagnóstico (12 preguntas) → Resultados → Recomendaciones

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Estructura

```text
app/
  layout.tsx
  page.tsx
  diagnostic/page.tsx
  results/page.tsx
components/
  Navbar.tsx
  Container.tsx
  QuestionCard.tsx
  ProgressBar.tsx
  RadarChart.tsx
  ResultSummary.tsx
  RecommendationBox.tsx
lib/
  questions.ts
  calculateACAE.ts
  recommendations.ts
styles/
  globals.css
```
