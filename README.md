# ACAE Growth System

ACAE Growth System es un SaaS en Next.js que conecta este flujo estratégico:

**diagnóstico → matriz ACAE → plan de acción → tareas → progreso**

## Componentes del sistema

### 1) Diagnóstico
- El usuario responde el cuestionario ACAE.
- El motor procesa respuestas y calcula scores por dimensión.
- Archivo principal: `lib/diagnosticEngine.ts`.

### 2) Matriz ACAE
La matriz estratégica define niveles de madurez (1 a 5) para:
- Atracción
- Conversión
- Automatización
- Escala

Cada nivel define:
- foco estratégico,
- tareas sugeridas.

Archivo principal: `lib/acaeMatrix.ts`.

### 3) Plan de acción automático
A partir del diagnóstico, el motor genera:
- prioridades,
- foco estratégico,
- tareas recomendadas,
- etapa del negocio (`IDEA`, `VALIDATION`, `GROWTH`, `SYSTEMIZATION`, `SCALE`).

Archivo principal: `lib/actionPlanEngine.ts`.

### 4) Progreso
El sistema mide:
- progreso de tareas completadas,
- evolución del negocio entre diagnósticos.

Archivo principal: `lib/progressEngine.ts`.

### 5) Integración del sistema
`lib/growthSystem.ts` integra todos los motores y conserva la API pública para el dashboard:
- `getDefaultGrowthState`
- `canRunDiagnostic`
- `getAllTasks`
- `getTaskProgress`
- `getLatestDiagnostic`
- `getSessionsAvailable`

## Comandos

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
