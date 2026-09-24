import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "APPROVED";
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: any = { status };

    if (category) where.category = { name: category };
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy: any =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        seller: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, icon: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
