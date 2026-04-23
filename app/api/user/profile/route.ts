import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        favoriteGame: true,
        country: true,
        isPro: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            settings: true,
            history: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to get profile:", error);
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio, favoriteGame, country } = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: bio?.slice(0, 500),
        favoriteGame,
        country,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}