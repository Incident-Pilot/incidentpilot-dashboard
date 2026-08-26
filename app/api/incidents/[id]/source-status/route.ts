import { NextResponse } from "next/server";
import { getIncidentSourceStatus } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sourceStatus = await getIncidentSourceStatus(id);
    return NextResponse.json(sourceStatus);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
