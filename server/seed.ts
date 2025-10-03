import { db } from "./db";
import { users, listings, categories, cities } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting seed...");
  
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const testUsers = await db.insert(users).values([
    { name: "احمد رحیمی", phone: "+93700111222", password: hashedPassword },
    { name: "فاطمه کریمی", phone: "+93700222333", password: hashedPassword },
    { name: "محمد حسینی", phone: "+93700333444", password: hashedPassword },
    { name: "زینب احمدی", phone: "+93700444555", password: hashedPassword },
  ]).returning();

  console.log(`✅ Created ${testUsers.length} test users`);

  const sampleListings = [];
  let count = 0;

  for (const city of cities.slice(0, 10)) {
    for (const category of categories) {
      for (let i = 0; i < 4; i++) {
        const user = testUsers[count % testUsers.length];
        const basePrice = Math.floor(Math.random() * 9000) + 1000;
        
        const titles: Record<string, string[]> = {
          "vehicles": ["تویوتا کرولا ۲۰۱۵", "هوندا سیویک ۲۰۱۸", "موتر جدید", "موتر کارکرده"],
          "realestate": ["خانه ۳ خوابه", "آپارتمان مدرن", "زمین تجارتی", "منزل دو طبقه"],
          "electronics": ["لپ تاپ Dell", "موبایل Samsung", "تلویزیون LED", "کمپیوتر دسکتاپ"],
          "jewelry": ["انگشتر طلا", "گردنبند نقره", "ساعت رولکس", "دستبند الماس"],
          "mens-clothes": ["کت و شلوار", "پیراهن رسمی", "جین", "کفش چرم"],
          "womens-clothes": ["لباس مجلسی", "مانتو زنانه", "شال و روسری", "کفش پاشنه بلند"],
          "kids-clothes": ["لباس بچگانه", "کفش کودک", "کلاه بچگانه", "ژاکت زمستانی"],
          "books": ["کتاب آموزشی", "رمان فارسی", "کتاب مذهبی", "دایره المعارف"],
          "kids": ["اسباب بازی", "ماشین کنترلی", "عروسک", "دوچرخه کودک"],
          "home": ["مبل راحتی", "میز نهارخوری", "فرش", "یخچال"],
          "jobs": ["استخدام راننده", "کار اداری", "مهندس نرم افزار", "معلم خصوصی"],
          "services": ["تعمیر موبایل", "نقاشی ساختمان", "تدریس خصوصی", "آرایشگاه"],
          "games": ["پلی استیشن ۵", "بازی FIFA", "Xbox Series X", "کنسول بازی"],
          "sports": ["دوچرخه کوهستان", "توپ فوتبال", "راکت تنیس", "وسایل بدنسازی"],
        };

        const descriptions = [
          "در حالت عالی و تمیز",
          "کاملاً نو و استفاده نشده",
          "قیمت مناسب برای فروش سریع",
          "با گارانتی معتبر",
        ];

        const categoryTitles = titles[category.id] || ["محصول با کیفیت", "فروش فوری", "قیمت مناسب", "محصول جدید"];
        const title = `${categoryTitles[i]} - ${city.nameFA}`;
        const description = `${descriptions[Math.floor(i % descriptions.length)]}. ${category.nameFA} با کیفیت عالی در ${city.nameFA}. تماس: ${user.phone}`;

        sampleListings.push({
          title,
          description,
          price: basePrice,
          category: category.id,
          city: city.id,
          imageUrl: null,
          userId: user.id,
        });
        count++;
      }
    }
  }

  const batchSize = 100;
  for (let i = 0; i < sampleListings.length; i += batchSize) {
    const batch = sampleListings.slice(i, i + batchSize);
    await db.insert(listings).values(batch);
    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} listings)`);
  }

  console.log(`🎉 Seed completed! Created ${sampleListings.length} sample listings`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
