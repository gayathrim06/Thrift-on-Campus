import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET my own listings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, icon: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("My listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
