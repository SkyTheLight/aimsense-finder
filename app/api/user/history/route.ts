import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getHistory, addHistory } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await getHistory(session.user.id);
    const formatted = history.map((row: any) => ({
      id: row.id,
      game: row.game,
      dpi: row.dpi,
      sensitivity: row.sensitivity,
      edpi: row.edpi,
      cm360: row.cm360,
      createdAt: row.createdAt.toISOString(),
    }));

    return NextResponse.json({ history: formatted });
  } catch (error) {
    console.error("Failed to get history:", error);
    return NextResponse.json({ history: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await addHistory(session.user.id, {
      game: body.game,
      dpi: body.dpi,
      sensitivity: body.sensitivity,
      edpi: body.edpi,
      cm360: body.cm360,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to add history:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}