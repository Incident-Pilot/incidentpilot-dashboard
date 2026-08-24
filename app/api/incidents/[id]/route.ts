import { NextResponse } from "next/server";
import { getIncident } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const incident = await getIncident(params.id);
    return NextResponse.json(incident);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
