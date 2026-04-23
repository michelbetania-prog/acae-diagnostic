import { NextRequest, NextResponse } from "next/server";

type AiAction = {
  accion: string;
  por_que: string;
  como_hacerlo: string[];
  resultado_esperado: string;
};

type AiDiagnosticResponse = {
  diagnostico: string;
  problemas_criticos: string[];
  oportunidades: string[];
  acciones: AiAction[];
  estructuras_internas?: Array<{
    recomendacion: string;
    cuando_aplicar: string;
    version_simple: string;
  }>;
};

const SYSTEM_PROMPT = `CAPA DE EJECUCIÓN (CRÍTICO):

Cuando indiques una acción, debes expandirla en 4 partes:

1. Acción:
Qué debe hacer exactamente el usuario

2. Por qué:
Explica por qué esta acción impacta directamente en su negocio (ventas, claridad o estructura)

3. Cómo hacerlo:
Da pasos concretos, simples y ejecutables hoy.
Si aplica, incluye formato, plantilla o ejemplo.

4. Resultado esperado:
Describe cómo se ve cuando está bien hecho.

---

REGLA:

No puedes dar acciones abstractas como:
"define tu cliente ideal" o "mejora tu oferta"

Debes convertirlas en instrucciones guiadas paso a paso.

Debes devolver JSON válido con esta estructura exacta:
{
  "diagnostico": "string",
  "problemas_criticos": ["string"],
  "oportunidades": ["string"],
  "acciones": [
    {
      "accion": "string",
      "por_que": "string",
      "como_hacerlo": ["string"],
      "resultado_esperado": "string"
    }
  ],
  "estructuras_internas": [
    {
      "recomendacion": "string",
      "cuando_aplicar": "string",
      "version_simple": "string"
    }
  ]
}

Si el problema detectado requiere estructura interna, puedes recomendar sistemas de trabajo, modelos operativos u organigramas básicos,
pero explica cuándo aplicar cada uno y adáptalo al nivel del negocio sin sobrecomplicar.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = (await request.json()) as {
    answers?: Record<string, number>;
    score?: Record<string, number>;
    context?: Record<string, unknown>;
  };

  if (!body.answers || !body.score) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const userPrompt = `Analiza este diagnóstico ACAE y responde según las reglas:\n\nRespuestas: ${JSON.stringify(
    body.answers
  )}\nScore: ${JSON.stringify(body.score)}\nContexto: ${JSON.stringify(body.context ?? {})}`;

  const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    })
  });

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text();
    return NextResponse.json({ error: "OpenAI request failed", detail: errorText }, { status: 500 });
  }

  const data = (await openaiResponse.json()) as { output_text?: string };
  if (!data.output_text) {
    return NextResponse.json({ error: "No output_text returned by model" }, { status: 500 });
  }

  let parsed: AiDiagnosticResponse;
  try {
    parsed = JSON.parse(data.output_text) as AiDiagnosticResponse;
  } catch {
    return NextResponse.json({ error: "Model did not return valid JSON", raw: data.output_text }, { status: 500 });
  }

  return NextResponse.json(parsed);
}
