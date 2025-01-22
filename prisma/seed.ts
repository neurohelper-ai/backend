import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient();

async function main() {
  const filePath = 'prisma/Category.json';

  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} not found.`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data: Array<{
    _id: string;
    locale: string;
    level: number;
    name: string;
    description?: string;
    chatPrompt?: string;
    imageName: string;
    parentId: string;
    createdAt: { $date: string };
    updatedAt: { $date: string };
  }> = JSON.parse(fileContent);

  for (const category of data) {
    try {
      await prisma.category.create({
        data: {
          id: category._id,
          key: category._id,
          locale: category.locale,
          level: category.level,
          name: category.name,
          description: category.description,
          chatPrompt: category.chatPrompt,
          imageName: category.imageName,
          parentId: category.parentId,
          createdAt: new Date(category.createdAt.$date),
          updatedAt: new Date(category.updatedAt.$date),
        },
      });
      console.log(`Category "${category.name}" added successfully.`);
    } catch (error) {
      console.error(`Error adding category "${category.name}":`, error);
    }
  }
}

main()
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
