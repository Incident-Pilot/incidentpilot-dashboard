import { NextResponse } from "next/server";
import { getInvestigation } from "@/lib/investigation";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const investigation = await getInvestigation(id);
    return NextResponse.json(investigation);
  } catch {
    return NextResponse.json(
      { error: "Unexpected error contacting the agent API" },
      { status: 502 },
    );
  }
}
