import { NextResponse } from "next/server";
import { getIncidentEvidence } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const evidence = await getIncidentEvidence(params.id);
    return NextResponse.json(evidence);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
