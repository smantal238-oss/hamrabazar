import { storage } from "./storage";
import { categories, cities } from "@shared/schema";

const sampleListings = [
  "خانه", "ماشین", "موبایل", "لپ تاپ", "کتاب", "لباس", "کفش", "ساعت", "دوچرخه", "میز"
];

export async function seedDatabase() {
  try {
    // Create sample users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await storage.createUser({
        name: `کاربر ${i}`,
        phone: `0700000${i.toString().padStart(3, '0')}`,
        password: "123456",
        role: "user"
      });
      users.push(user);
    }

    // Create listings for each category and city
    for (const category of categories.slice(0, 5)) {
      for (const city of cities.slice(0, 5)) {
        for (let i = 0; i < 5; i++) {
          const user = users[Math.floor(Math.random() * users.length)];
          const item = sampleListings[Math.floor(Math.random() * sampleListings.length)];
          
          await storage.createListing({
            title: `${item} ${category.nameFA} در ${city.nameFA}`,
            description: `توضیحات ${item} در شهر ${city.nameFA}`,
            price: Math.floor(Math.random() * 1000000) + 10000,
            category: category.id,
            city: city.id,
            imageUrl: null
          }, user.id);
        }
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedDatabase();