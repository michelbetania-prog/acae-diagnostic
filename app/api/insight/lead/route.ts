import { Lead } from "@/lib/biem-insight/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as Lead;

  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Lead captured successfully.",
    lead: body
  });
}
