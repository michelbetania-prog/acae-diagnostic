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

const SYSTEM_PROMPT = `Eres un consultor estratégico basado en el método ACAE.

CAPA DE EJECUCIÓN (CRÍTICO):

Cuando indiques una acción, debes expandirla en 4 partes:

1. Acción
2. Por qué
3. Cómo hacerlo (pasos claros)
4. Resultado esperado

No puedes dar acciones abstractas.

Debes devolver SOLO JSON válido con esta estructura exacta:

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

No escribas texto fuera del JSON.
`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = await request.json();

  if (!body.answers || !body.score) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const userPrompt = `Analiza este negocio:

Respuestas: ${JSON.stringify(body.answers)}
Score: ${JSON.stringify(body.score)}
Contexto: ${JSON.stringify(body.context ?? {})}`;

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "acae_response",
          schema: {
            type: "object",
            properties: {
              diagnostico: { type: "string" },
              problemas_criticos: {
                type: "array",
                items: { type: "string" }
              },
              oportunidades: {
                type: "array",
                items: { type: "string" }
              },
              acciones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    accion: { type: "string" },
                    por_que: { type: "string" },
                    como_hacerlo: {
                      type: "array",
                      items: { type: "string" }
                    },
                    resultado_esperado: { type: "string" }
                  },
                  required: ["accion", "por_que", "como_hacerlo", "resultado_esperado"]
                }
              },
              estructuras_internas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    recomendacion: { type: "string" },
                    cuando_aplicar: { type: "string" },
                    version_simple: { type: "string" }
                  }
                }
              }
            },
            required: ["diagnostico", "problemas_criticos", "oportunidades", "acciones"]
          }
        }
      },

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    })
  });

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text();
    return NextResponse.json(
      { error: "OpenAI request failed", detail: errorText },
      { status: 500 }
    );
  }

  const data = await openaiResponse.json();

  try {
    const parsed: AiDiagnosticResponse = JSON.parse(
      data.choices[0].message.content
    );

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid JSON from model",
        raw: data.choices?.[0]?.message?.content
      },
      { status: 500 }
    );
  }
}
