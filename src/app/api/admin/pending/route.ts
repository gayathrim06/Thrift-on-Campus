import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function isAdmin(session: any) {
  return session?.user?.role === "ADMIN";
}

// GET all pending products for admin review
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        seller: { select: { id: true, name: true, email: true } },
        category: { select: { name: true, icon: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin pending error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
