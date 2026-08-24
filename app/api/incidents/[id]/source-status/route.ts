import { NextResponse } from "next/server";
import { getIncidentSourceStatus } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sourceStatus = await getIncidentSourceStatus(params.id);
    return NextResponse.json(sourceStatus);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
