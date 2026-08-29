import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { existsSync } from "fs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const incidentId = decodeURIComponent(id);

    // Get the agentic_layer directory path
    // Try environment variable first, then fall back to relative path from cwd
    let agenticLayerDir = process.env.AGENTIC_LAYER_DIR;

    if (!agenticLayerDir) {
      // Fall back to relative path: from dashboard -> parent -> agentic_layer
      agenticLayerDir = path.resolve(
        process.cwd(),
        "..",
        "..",
        "..",
        "agentic_layer"
      );
    }

    // Validate the directory exists
    if (!existsSync(agenticLayerDir)) {
      console.error(`Agentic layer directory not found: ${agenticLayerDir}`);
      return NextResponse.json(
        {
          error: "Agentic layer directory not found. Please set AGENTIC_LAYER_DIR environment variable.",
        },
        { status: 500 }
      );
    }

    console.log(
      `[${incidentId}] Starting investigation with agentic_layer at ${agenticLayerDir}`
    );

    // Spawn the Python process to run investigation
    // python -m incident_pilot_agent run <INC-id> --llm bedrock --source gateway
    const pythonProcess = spawn(
      "python3",
      [
        "-m",
        "incident_pilot_agent",
        "run",
        incidentId,
        "--llm",
        "bedrock",
        "--source",
        "gateway",
      ],
      {
        cwd: agenticLayerDir,
        detached: true,
        stdio: "ignore",
        env: {
          ...process.env,
        },
      }
    );

    // Handle process errors
    pythonProcess.on("error", (err) => {
      console.error(`[${incidentId}] Failed to spawn investigation process:`, err);
    });

    // Unref the process so Node doesn't wait for it
    pythonProcess.unref();

    // Return 202 Accepted immediately without waiting for investigation to complete
    return NextResponse.json(
      {
        message: "Investigation started in background",
        incident_id: incidentId,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Failed to start investigation:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start investigation",
      },
      { status: 500 }
    );
  }
}
