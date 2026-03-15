import { runBIEMDiagnostic } from "@/lib/biem";
import { BIEMAnswers } from "@/lib/biem/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as { answers?: BIEMAnswers };

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "Invalid request. Expected { answers: Record<string, value> }." }, { status: 400 });
  }

  const diagnostic = runBIEMDiagnostic(body.answers);
  return NextResponse.json(diagnostic, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      service: "BIEM Insight Diagnostic API",
      endpoints: [
        {
          method: "POST",
          path: "/api/biem/diagnose",
          description: "Runs BIEM diagnostic engine and returns report + AI payload"
        }
      ]
    },
    { status: 200 }
  );
}
