import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const [users, products, categories] = await Promise.all([
  p.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  }),
  p.product.findMany({
    select: {
      id: true, name: true, price: true, status: true,
      condition: true, createdAt: true,
      seller: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  }),
  p.category.findMany({
    select: { id: true, name: true, icon: true, _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  }),
]);

console.log("\n===== USERS (" + users.length + ") =====");
console.table(users.map(u => ({ id: u.id.slice(0,8), name: u.name, email: u.email, role: u.role, joined: u.createdAt.toISOString().split("T")[0] })));

console.log("\n===== CATEGORIES (" + categories.length + ") =====");
console.table(categories.map(c => ({ icon: c.icon, name: c.name, products: c._count.products })));

console.log("\n===== PRODUCTS (" + products.length + ") =====");
console.table(products.map(p => ({ name: p.name.slice(0,30), price: "₹"+p.price, status: p.status, condition: p.condition, seller: p.seller.name, category: p.category.name })));

await p.$disconnect();
