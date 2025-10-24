export const mockListings = [
  {
    id: "1",
    title: "خانه دو طبقه در کابل",
    description: "خانه زیبا با امکانات کامل در منطقه امن",
    price: 50000,
    currency: "USD",
    category: "realestate",
    city: "kabul",
    imageUrl: "/png/kabul.png",
    userId: "user1",
    approved: true,
    createdAt: new Date()
  },
  {
    id: "2", 
    title: "ماشین تویوتا کرولا",
    description: "ماشین در حالت عالی، کم کارکرد",
    price: 1200000,
    currency: "AFN",
    category: "vehicles",
    city: "herat",
    imageUrl: "/png/herat.png",
    userId: "user2",
    approved: true,
    createdAt: new Date()
  },
  {
    id: "3",
    title: "موبایل سامسونگ",
    description: "موبایل نو و سالم با گارانتی",
    price: 300,
    currency: "USD",
    category: "electronics", 
    city: "balkh",
    imageUrl: "/png/balkh.png",
    userId: "user3",
    approved: true,
    createdAt: new Date()
  },
  {
    id: "4",
    title: "لپ تاپ دل",
    description: "لپ تاپ قوی برای کار و بازی",
    price: 65000,
    currency: "AFN",
    category: "electronics",
    city: "kabul",
    imageUrl: "/png/kabul.png",
    userId: "user1",
    approved: true,
    createdAt: new Date()
  },
  {
    id: "5",
    title: "دوچرخه کوهستان",
    description: "دوچرخه مناسب برای کوهنوردی",
    price: 200,
    currency: "USD",
    category: "sports",
    city: "herat",
    imageUrl: "/png/herat.png",
    userId: "user2",
    approved: true,
    createdAt: new Date()
  },
  {
    id: "6",
    title: "آپارتمان فروشی در شهر نو",
    description: "آپارتمان ۳ خوابه با نمای زیبا، پارکینگ و آسانسور. منطقه امن و دسترسی آسان به مراکز خرید. قیمت قابل مذاکره.",
    price: 85000,
    currency: "USD",
    category: "realestate",
    city: "kabul",
    imageUrl: "/png/kabul.png",
    userId: "user5",
    approved: true,
    createdAt: new Date()
  }
];

export const mockUsers = [
  { id: "admin", name: "ادمین", phone: "+93700999999", password: "admin123", role: "admin", createdAt: new Date() },
  { id: "admin2", name: "ادمین جدید", phone: "+93700111111", password: "123456", role: "admin", createdAt: new Date() },
  { id: "user1", name: "احمد", phone: "0700001", password: process.env.TEST_PASSWORD || "123", role: "user", createdAt: new Date() },
  { id: "user2", name: "فاطمه", phone: "0700002", password: process.env.TEST_PASSWORD || "123", role: "user", createdAt: new Date() },
  { id: "user3", name: "علی", phone: "0700003", password: process.env.TEST_PASSWORD || "123", role: "user", createdAt: new Date() },
  { id: "user4", name: "کاربر تست", phone: "+93 700500500", password: process.env.TEST_PASSWORD || "1234", role: "user", createdAt: new Date() },
  { id: "user5", name: "محمد رضا", phone: "+93 700600600", password: process.env.TEST_PASSWORD || "5678", role: "user", createdAt: new Date() }
];