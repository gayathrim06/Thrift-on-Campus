import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function isAdmin(session: any) {
  return session?.user?.role === "ADMIN";
}

// PUT /api/admin/products/[id] — approve, reject, mark sold
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason } = body;

    if (!["APPROVED", "REJECTED", "SOLD"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = { status: action };

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        seller: { select: { name: true, email: true } },
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
