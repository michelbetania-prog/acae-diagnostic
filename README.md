# ACAE Growth System

ACAE Growth System es una aplicación SaaS construida con Next.js para diagnosticar negocios y convertir los resultados en un plan de crecimiento automático.

## ¿Cómo funciona?

1. El usuario completa un diagnóstico ACAE (12 preguntas).
2. El sistema calcula el score por dimensión.
3. La MATRIZ ACAE interpreta el nivel de madurez del negocio.
4. Se genera automáticamente:
   - etapa del negocio,
   - prioridades estratégicas,
   - plan de acción,
   - tareas accionables.
5. El dashboard muestra progreso, tareas y evolución entre diagnósticos.

## Núcleo del sistema

### Diagnóstico
Evalúa 4 dimensiones:

- Atracción
- Conversión
- Autoridad / Automatización
- Escalabilidad / Escala

### Matriz ACAE
La matriz transforma resultados en reglas de decisión por dimensión y nivel (1 a 5):

- problemas típicos,
- foco estratégico,
- tareas sugeridas.

Archivo principal: `lib/acaeMatrix.ts`.

### Plan de acción
El motor genera un `ActionPlan` con:

- `businessStage` (IDEA, VALIDATION, GROWTH, SYSTEMIZATION, SCALE),
- prioridades,
- foco estratégico,
- tareas para ejecutar.

### Dashboard
El panel muestra:

- Growth Score,
- tareas activas y progreso,
- disponibilidad de nuevos diagnósticos según plan,
- sesiones disponibles,
- evolución del score entre diagnósticos.

## Ejecución local

```bash
npm install
npm run dev
npm run build
```

## Stack

- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- Recharts
