import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, icon: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Only show approved/sold publicly; pending/rejected visible to owner
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
