export const mockListings = [
  {
    id: "1",
    title: "خانه دو طبقه در کابل",
    description: "خانه زیبا با امکانات کامل در منطقه امن",
    price: 50000,
    currency: "USD",
    category: "realestate",
    city: "kabul",
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
    userId: "user5",
    approved: true,
    createdAt: new Date()
  }
];

export const mockUsers = [
  { id: "admin", name: "ادمین", phone: "admin123", password: "admin@secure2024", role: "admin", createdAt: new Date() },
  { id: "user1", name: "احمد", phone: "0700001", password: "123", role: "user", createdAt: new Date() },
  { id: "user2", name: "فاطمه", phone: "0700002", password: "123", role: "user", createdAt: new Date() },
  { id: "user3", name: "علی", phone: "0700003", password: "123", role: "user", createdAt: new Date() },
  { id: "user4", name: "کاربر تست", phone: "+93 700500500", password: "1234", role: "user", createdAt: new Date() },
  { id: "user5", name: "محمد رضا", phone: "+93 700600600", password: "5678", role: "user", createdAt: new Date() }
];