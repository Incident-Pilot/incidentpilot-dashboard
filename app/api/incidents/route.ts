import { NextResponse } from "next/server";
import { listIncidents } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const incidents = await listIncidents();
    return NextResponse.json({ incidents });
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
