import { NextResponse } from "next/server";
import { getIncident } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const incident = await getIncident(id);
    return NextResponse.json(incident);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
