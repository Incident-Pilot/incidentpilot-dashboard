import { NextResponse } from "next/server";
import { updateIncidentStatus } from "@/lib/gateway";
import { gatewayErrorResponse } from "@/lib/api-error";

// The dashboard's first write action. Two independent auth layers sit in
// front of the Gateway call this makes:
//   1. proxy.ts's dashboard-level session cookie (see lib/session.ts) --
//      gates every route in this app, this one included, before a
//      request ever reaches here.
//   2. GATEWAY_API_KEY (lib/gateway.ts) -- authorizes this server to talk
//      to the Gateway at all; it identifies the dashboard backend, not
//      the end user.
// Neither of those is a real access-control decision about *who* gets to
// resolve/cancel incidents -- with a single shared dashboard login there
// is only one "who". Revisit this before the dashboard is ever exposed
// beyond localhost to more than one trusted operator.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const status = body?.status;

    if (status !== "resolved" && status !== "closed") {
      return NextResponse.json(
        { error: 'status must be "resolved" or "closed"' },
        { status: 400 },
      );
    }

    const updated = await updateIncidentStatus(id, status);
    return NextResponse.json(updated);
  } catch (err) {
    return gatewayErrorResponse(err);
  }
}
