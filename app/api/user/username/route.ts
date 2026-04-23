import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();
    const cleanedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (cleanedUsername.length < 3 || cleanedUsername.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }

    if (/^[0-9_]+$/.test(cleanedUsername)) {
      return NextResponse.json({ error: "Username cannot be all numbers" }, { status: 400 });
    }

    const exists = await prisma.user.findFirst({
      where: { username: cleanedUsername, NOT: { id: session.user.id } },
    });

    if (exists) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: cleanedUsername },
    });

    return NextResponse.json({ success: true, username: cleanedUsername });
  } catch (error) {
    console.error("Failed to update username:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}