import { NextRequest, NextResponse } from "next/server";

type AiDiagnosticResponse = {
  diagnostico: string;
  problemas_criticos: string[];
  oportunidades: string[];
  acciones: {
    accion: string;
    por_que: string;
    como_hacerlo: string[];
    resultado_esperado: string;
  }[];
  estructuras_internas?: {
    recomendacion: string;
    cuando_aplicar: string;
    version_simple: string;
  }[];
};

const SYSTEM_PROMPT = `Eres un consultor estratégico basado en el método ACAE.

Cuando indiques una acción, debes estructurarla en:
1. Acción
2. Por qué
3. Cómo hacerlo (pasos claros y ejecutables)
4. Resultado esperado

REGLAS:
- No puedes dar acciones abstractas
- Todo debe ser accionable hoy
- Responde SOLO en JSON válido con la estructura indicada
- No escribas texto fuera del JSON
`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!body?.answers || !body?.score) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const userPrompt = `Analiza este negocio:

Respuestas: ${JSON.stringify(body.answers)}
Score: ${JSON.stringify(body.score)}
Contexto: ${JSON.stringify(body.context ?? {})}`;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
                    items: { type: "string" },
                  },
                  oportunidades: {
                    type: "array",
                    items: { type: "string" },
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
                          items: { type: "string" },
                        },
                        resultado_esperado: { type: "string" },
                      },
                      required: [
                        "accion",
                        "por_que",
                        "como_hacerlo",
                        "resultado_esperado",
                      ],
                    },
                  },
                  estructuras_internas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        recomendacion: { type: "string" },
                        cuando_aplicar: { type: "string" },
                        version_simple: { type: "string" },
                      },
                    },
                  },
                },
                required: [
                  "diagnostico",
                  "problemas_criticos",
                  "oportunidades",
                  "acciones",
                ],
              },
            },
          },
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      return NextResponse.json(
        { error: "OpenAI request failed", detail: errorText },
        { status: 500 }
      );
    }

    const data = await openaiResponse.json();

    let parsed: AiDiagnosticResponse;

    try {
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from model");
      }

      parsed = JSON.parse(content);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid JSON from model",
          raw: data.choices?.[0]?.message?.content,
        },
        { status: 500 }
      );
    }

    // Validación mínima (evita respuestas rotas)
    if (!parsed.diagnostico || !parsed.acciones) {
      return NextResponse.json(
        { error: "Malformed AI response", raw: parsed },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
