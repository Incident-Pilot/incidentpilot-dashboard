import { NextResponse } from "next/server";
import { getIncidentTimeline } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const timeline = await getIncidentTimeline(params.id);
    return NextResponse.json(timeline);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
