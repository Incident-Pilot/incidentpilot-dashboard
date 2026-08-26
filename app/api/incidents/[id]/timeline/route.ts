import { NextResponse } from "next/server";
import { getIncidentTimeline } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const timeline = await getIncidentTimeline(id);
    return NextResponse.json(timeline);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
