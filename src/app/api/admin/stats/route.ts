import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalProducts, pending, approved, rejected, sold] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { status: "APPROVED" } }),
        prisma.product.count({ where: { status: "REJECTED" } }),
        prisma.product.count({ where: { status: "SOLD" } }),
      ]);

    return NextResponse.json({
      stats: { totalUsers, totalProducts, pending, approved, rejected, sold },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
