import { NextResponse } from "next/server";
import { getInvestigation } from "@/lib/investigation";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const investigation = await getInvestigation(params.id);
    return NextResponse.json(investigation);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error contacting the agent API" },
      { status: 502 },
    );
  }
}
