import { NextResponse } from "next/server";
import { GatewayConfigError, GatewayRequestError } from "@/lib/gateway";

export function gatewayErrorResponse(err: unknown) {
  if (err instanceof GatewayConfigError) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  if (err instanceof GatewayRequestError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  return NextResponse.json({ error: "Unexpected error contacting the Gateway" }, { status: 502 });
}
