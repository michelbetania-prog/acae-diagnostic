import { buildStrategicReport } from "@/lib/report-engine";
import { Answers, Lead } from "@/lib/biem-insight/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as { lead?: Lead; answers?: Answers };

  if (!body.lead?.name || !body.lead?.email || !body.answers) {
    return NextResponse.json({ error: "Invalid payload. Expected lead and answers." }, { status: 400 });
  }

  const report = buildStrategicReport(body.lead, body.answers);
  return NextResponse.json(report);
}
