import { offlineDb, offlineFiles } from "./offlineDb";
import { randomUUID } from "crypto";

const categories = [
  { id: "vehicles" }, { id: "realestate" }, { id: "electronics" }, { id: "jewelry" }, { id: "mens-clothes" }
];

const cities = [
  { id: "kabul" }, { id: "herat" }, { id: "balkh" }, { id: "kandahar" }, { id: "nangarhar" }
];

const fileTypes = [
  { ext: "pdf", mime: "application/pdf" },
  { ext: "jpg", mime: "image/jpeg" },
  { ext: "png", mime: "image/png" },
  { ext: "txt", mime: "text/plain" },
  { ext: "doc", mime: "application/msword" }
];

const sampleFiles = [
  "document", "image", "report", "photo", "manual", "guide", "invoice", "receipt", "contract", "presentation"
];

export async function seedOfflineFiles() {
  const files = [];
  
  categories.forEach(category => {
    cities.forEach(city => {
      for (let i = 0; i < 5; i++) {
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const fileName = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
        
        files.push({
          id: randomUUID(),
          filename: `${category.id}_${city.id}_${fileName}_${i + 1}.${fileType.ext}`,
          filepath: `/uploads/sample_${randomUUID()}.${fileType.ext}`,
          filesize: Math.floor(Math.random() * 1000000) + 1000,
          mimetype: fileType.mime,
          userId: `user_${category.id}_${city.id}`,
          createdAt: new Date()
        });
      }
    });
  });

  await offlineDb.insert(offlineFiles).values(files);
  console.log(`Seeded ${files.length} offline files`);
}

seedOfflineFiles().catch(console.error);