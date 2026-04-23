import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettings(session.user.id);
    const formatted = settings.map((row: any) => ({
      id: row.id,
      game: row.game,
      dpi: row.dpi,
      sensitivity: row.sensitivity,
      edpi: row.edpi,
      cm360: row.cm360,
      mouseGrip: row.mouseGrip,
      aimStyle: row.aimStyle,
      isCurrent: row.isCurrent,
      createdAt: row.createdAt.toISOString(),
    }));

    return NextResponse.json({ settings: formatted });
  } catch (error) {
    console.error("Failed to get settings:", error);
    return NextResponse.json({ settings: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await saveSettings(session.user.id, {
      game: body.game,
      dpi: body.dpi,
      sensitivity: body.sensitivity,
      edpi: body.edpi,
      cm360: body.cm360,
      mouseGrip: body.mouseGrip,
      aimStyle: body.aimStyle,
      isCurrent: body.isCurrent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}