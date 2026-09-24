import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Categories
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Clothing", icon: "👕" },
    { name: "Books", icon: "📚" },
    { name: "Bags", icon: "🎒" },
    { name: "Hostel", icon: "🏠" },
    { name: "Sports", icon: "⚽" },
    { name: "Entertainment", icon: "🎮" },
    { name: "Miscellaneous", icon: "📦" },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: { icon: c.icon },
      create: c,
    });
    catMap[c.name] = cat.id;
  }
  console.log("✅ Categories created");

  // Users
  const adminHash = await bcrypt.hash("admin123", 12);
  const studentHash = await bcrypt.hash("student123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@campus.edu" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@campus.edu",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const students = await Promise.all([
    prisma.user.upsert({ where: { email: "student@campus.edu" }, update: {}, create: { name: "Demo Student", email: "student@campus.edu", passwordHash: studentHash, role: "STUDENT" } }),
    prisma.user.upsert({ where: { email: "arjun@campus.edu" }, update: {}, create: { name: "Arjun Sharma", email: "arjun@campus.edu", passwordHash: studentHash, role: "STUDENT" } }),
    prisma.user.upsert({ where: { email: "priya@campus.edu" }, update: {}, create: { name: "Priya Patel", email: "priya@campus.edu", passwordHash: studentHash, role: "STUDENT" } }),
    prisma.user.upsert({ where: { email: "rahul@campus.edu" }, update: {}, create: { name: "Rahul Verma", email: "rahul@campus.edu", passwordHash: studentHash, role: "STUDENT" } }),
    prisma.user.upsert({ where: { email: "sneha@campus.edu" }, update: {}, create: { name: "Sneha Gupta", email: "sneha@campus.edu", passwordHash: studentHash, role: "STUDENT" } }),
  ]);
  console.log("✅ Users created");

  // Products
  const products = [
    { name: "iPhone 13 (128GB, Midnight)", description: "Used for 1 year, excellent condition. No scratches, original box included with all accessories.", categoryId: catMap["Electronics"], price: 38000, image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80", condition: "EXCELLENT", status: "APPROVED", sellerId: students[1].id },
    { name: "Sony WH-1000XM4 Headphones", description: "Noise cancelling headphones, 8 months old. Comes with carrying case and cable.", categoryId: catMap["Electronics"], price: 9500, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", condition: "EXCELLENT", status: "APPROVED", sellerId: students[2].id },
    { name: "Casio fx-991EX Scientific Calculator", description: "All functions working perfectly. Ideal for engineering exams. Comes with slide case.", categoryId: catMap["Electronics"], price: 650, image: "/images/products/casio-calculator.jpg", condition: "GOOD", status: "APPROVED", sellerId: students[3].id },
    { name: "Mechanical Keyboard (TKL, Brown Switch)", description: "Compact tenkeyless keyboard. Tactile brown switches. Used 6 months for coding.", categoryId: catMap["Electronics"], price: 3200, image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[4].id },
    { name: "Nike Dri-FIT Hoodie (Size L)", description: "Only worn a few times. Washed and clean. Perfect for morning runs or casual wear.", categoryId: catMap["Clothing"], price: 800, image: "/images/products/nike-hoodie.jpg", condition: "EXCELLENT", status: "APPROVED", sellerId: students[1].id },
    { name: "Levi's 511 Slim Jeans (32x30)", description: "Dark blue denim. Worn a handful of times, no fading or damage.", categoryId: catMap["Clothing"], price: 950, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[2].id },
    { name: "Introduction to Algorithms (CLRS, 4th Ed)", description: "Bible of algorithms. Minimal highlighting. Perfect for CS students.", categoryId: catMap["Books"], price: 500, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[3].id },
    { name: "Engineering Mathematics (B.V. Ramana)", description: "Complete textbook, all chapters. Some pencil marks but fully usable.", categoryId: catMap["Books"], price: 280, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80", condition: "FAIR", status: "APPROVED", sellerId: students[4].id },
    { name: "Wildcraft Campus Backpack 45L", description: "Solid backpack with laptop sleeve. 2 years old, well maintained.", categoryId: catMap["Bags"], price: 900, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[0].id },
    { name: "LED Study Table Lamp", description: "3 brightness modes, USB port on base. Works perfectly. Hostel essential.", categoryId: catMap["Hostel"], price: 380, image: "/images/products/study-lamp.jpg", condition: "GOOD", status: "APPROVED", sellerId: students[1].id },
    { name: "Cosco Cricket Kit (Full Set)", description: "Bat, pads, gloves, helmet — complete kit. Used for inter-college tournament.", categoryId: catMap["Sports"], price: 2800, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[2].id },
    { name: "Yonex Badminton Racket Pair", description: "Two rackets + 3 shuttlecocks. Light use, great for campus courts.", categoryId: catMap["Sports"], price: 850, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[3].id },
    { name: "PS4 DualShock Controller", description: "Black controller, slight thumbstick wear. Tested and works perfectly.", categoryId: catMap["Entertainment"], price: 1900, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80", condition: "FAIR", status: "APPROVED", sellerId: students[4].id },
    { name: "Lab Coat (Medium)", description: "White lab coat, used for 1 semester practical labs. Washed, good condition.", categoryId: catMap["Clothing"], price: 220, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80", condition: "GOOD", status: "APPROVED", sellerId: students[0].id },
    { name: "XP-Pen Drawing Tablet (Small)", description: "Digital drawing tablet for design students. Light use, pen + USB included.", categoryId: catMap["Electronics"], price: 2100, image: "/images/products/drawing-tablet.jpg", condition: "EXCELLENT", status: "APPROVED", sellerId: students[1].id },
    // SOLD
    { name: "Samsung M34 5G (128GB)", description: "Midnight blue. Excellent condition, original box.", categoryId: catMap["Electronics"], price: 14500, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", condition: "EXCELLENT", status: "SOLD", sellerId: students[2].id },
    { name: "NCERT Chemistry Part 1 & 2", description: "Class 12 NCERT. Good condition.", categoryId: catMap["Books"], price: 160, image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&q=80", condition: "GOOD", status: "SOLD", sellerId: students[3].id },
    // PENDING
    { name: "HP Laptop 15s (Ryzen 5, 8GB RAM)", description: "512GB SSD, 1 year old. All original accessories. Great for coding/design.", categoryId: catMap["Electronics"], price: 34000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", condition: "EXCELLENT", status: "PENDING", sellerId: students[4].id },
    { name: "Gym Dumbbell Set (2x5kg)", description: "Iron dumbbells, great for hostel workouts.", categoryId: catMap["Sports"], price: 750, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", condition: "GOOD", status: "PENDING", sellerId: students[0].id },
    // REJECTED
    { name: "Old Earphones", description: "Some earphones.", categoryId: catMap["Electronics"], price: 50, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", condition: "POOR", status: "REJECTED", sellerId: students[1].id },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p as any });
  }

  console.log("✅ Products seeded (20 products)");
  console.log("\n🎉 Seeding complete!\n");
  console.log("═══ TEST ACCOUNTS ═══");
  console.log("Admin   : admin@campus.edu / admin123");
  console.log("Student : student@campus.edu / student123");
  console.log("Others  : arjun@campus.edu, priya@campus.edu ... / student123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
