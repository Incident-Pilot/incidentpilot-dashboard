import { NextResponse } from "next/server";
import { listInvestigations } from "@/lib/investigation";

export async function GET() {
  try {
    const investigations = await listInvestigations();
    return NextResponse.json(investigations);
  } catch {
    return NextResponse.json({ error: "Unexpected error contacting the agent API" }, { status: 502 });
  }
}
