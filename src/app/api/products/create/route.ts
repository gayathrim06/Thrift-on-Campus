import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  categoryId: z.string(),
  price: z.number().positive(),
  image: z.string().url().optional().default("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        sellerId: session.user.id!,
        status: "PENDING",
      },
      include: {
        category: { select: { name: true, icon: true } },
        seller: { select: { name: true } },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
