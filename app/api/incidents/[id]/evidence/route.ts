import { NextResponse } from "next/server";
import { getIncidentEvidence } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const evidence = await getIncidentEvidence(id);
    return NextResponse.json(evidence);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
