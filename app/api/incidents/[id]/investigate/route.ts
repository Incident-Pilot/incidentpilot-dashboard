import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const incidentId = decodeURIComponent(id);

    // Get the Agent API URL from environment
    const agentApiUrl = process.env.AGENT_API_URL;

    if (!agentApiUrl) {
      console.error("AGENT_API_URL environment variable not set");
      return NextResponse.json(
        {
          error: "Agent API not configured. Please set AGENT_API_URL environment variable to point to the agentic_layer investigation API (e.g., http://agent-service:8100).",
        },
        { status: 500 }
      );
    }

    const agentApiKey = process.env.AGENT_API_KEY;

    console.log(
      `[${incidentId}] Triggering investigation via Agent API at ${agentApiUrl}`
    );

    // Call the Agent API to trigger investigation
    // POST /investigations/{incident_id} starts the investigation process as a background task
    const triggerUrl = `${agentApiUrl.replace(/\/$/, "")}/investigations/${encodeURIComponent(incidentId)}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (agentApiKey) {
      headers["Authorization"] = `Bearer ${agentApiKey}`;
    }

    const response = await fetch(triggerUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `[${incidentId}] Agent API returned ${response.status}: ${errorBody}`
      );

      // If the endpoint doesn't exist, provide helpful guidance
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "Agent API investigation endpoint not found. Ensure AGENT_API_URL points to the agentic_layer investigation API (the watch service).",
          },
          { status: 502 }
        );
      }

      if (response.status === 409) {
        // Incident already being investigated or not ready
        const detail = await response.json().catch(() => ({}));
        return NextResponse.json(
          {
            error: detail.detail?.message || "Investigation already in progress or incident not ready",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: `Failed to trigger investigation: ${response.status} ${errorBody || response.statusText}`,
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    // Return 202 Accepted to indicate investigation was triggered
    return NextResponse.json(
      {
        message: "Investigation triggered",
        incident_id: incidentId,
        ...result,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Failed to trigger investigation:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to trigger investigation",
      },
      { status: 500 }
    );
  }
}
