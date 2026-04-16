import { runBIEMDiagnostic } from "@/lib/biem";
import { BIEMAnswers } from "@/lib/biem/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = (await req.json()) as { answers?: BIEMAnswers };

    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request. Expected { answers: Record<string, value> }." },
        { status: 400 }
      );
    }

    // 🔹 1. Ejecutar BIEM (base lógica)
    const baseDiagnostic = runBIEMDiagnostic(body.answers);

    // 🔹 2. Crear prompt para IA
    const prompt = `Analiza este negocio con base en este diagnóstico:

${JSON.stringify(baseDiagnostic)}

Devuelve SOLO JSON con:
- diagnostico
- problemas_criticos
- oportunidades
- acciones (accion, por_que, como_hacerlo[], resultado_esperado)`;

    // 🔹 3. Llamar OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "Eres un consultor estratégico experto en negocios.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let aiResult;

    try {
      aiResult = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from AI", raw: content },
        { status: 500 }
      );
    }

    // 🔹 4. Respuesta final combinada
    return NextResponse.json({
      base: baseDiagnostic,
      ai: aiResult,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}{ai && (
  <div style={{ marginTop: "40px", padding: "20px", background: "#ffffff", borderRadius: "12px" }}>
    <h2>Diagnóstico Estratégico</h2>

    <p>{ai.diagnostico}</p>

    <h3>Problemas críticos</h3>
    <ul>
      {ai.problemas_criticos?.map((p: string, i: number) => (
        <li key={i}>{p}</li>
      ))}
    </ul>

    <h3>Oportunidades</h3>
    <ul>
      {ai.oportunidades?.map((o: string, i: number) => (
        <li key={i}>{o}</li>
      ))}
    </ul>

    <h3>Acciones</h3>
    {ai.acciones?.map((a: any, i: number) => (
      <div key={i} style={{ marginBottom: "20px" }}>
        <strong>{a.accion}</strong>

        <p><b>Por qué:</b> {a.por_que}</p>

        <ul>
          {a.como_hacerlo?.map((c: string, j: number) => (
            <li key={j}>{c}</li>
          ))}
        </ul>

        <p><b>Resultado esperado:</b> {a.resultado_esperado}</p>
      </div>
    ))}
  </div>
)}
