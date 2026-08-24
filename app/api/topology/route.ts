import { NextResponse } from "next/server";
import { getTopology } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const topology = await getTopology();
    return NextResponse.json(topology);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
