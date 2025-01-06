import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {


  const categoriesData = [
    { name: 'Life quality & Health' },
    { name: 'Business & Management' },
    { name: 'Finance & Investement' },
    { name: 'Content making & Socials' },
    { name: 'Technology & Development' },
    { name: 'Education & Science' },
    { name: 'Rights & Laws' },
  ];


  const createdCategories = [];
  for (const catData of categoriesData) {
    const category = await prisma.category.create({
      data: catData,
    });
    createdCategories.push(category);
  }


  const scenariosData = [
    {
      name: 'Daily Health Tips',
      prompt: 'Create a personalized routine for healthy living',
      categoryName: 'Life quality & Health',
    },
    {
      name: 'Fitness at Home',
      prompt: 'Plan a workout routine for busy individuals',
      categoryName: 'Life quality & Health',
    },

    {
      name: 'Project Management Plan',
      prompt: 'Outline a step-by-step approach to manage a new project',
      categoryName: 'Business & Management',
    },
    {
      name: 'Leadership Tips',
      prompt: 'Provide best practices for leading a small team',
      categoryName: 'Business & Management',
    },

    {
      name: 'Personal Budgeting',
      prompt: 'Help create a monthly budgeting plan',
      categoryName: 'Finance & Investement',
    },
    {
      name: 'Basic Investment Strategies',
      prompt: 'Describe how to invest small sums for beginners',
      categoryName: 'Finance & Investement',
    },

    {
      name: 'Social Media Content Plan',
      prompt: 'Outline daily content ideas for Instagram',
      categoryName: 'Content making & Socials',
    },
    {
      name: 'Video Script Ideas',
      prompt: 'Give me 5 ideas for short YouTube videos on cooking',
      categoryName: 'Content making & Socials',
    },

    {
      name: 'Introduction to Python',
      prompt: 'Explain the basics of Python for a beginner developer',
      categoryName: 'Technology & Development',
    },
    {
      name: 'Debugging Tips',
      prompt: 'How to systematically debug a Node.js application',
      categoryName: 'Technology & Development',
    },

    {
      name: 'Study Plan for Exams',
      prompt: 'Create a study schedule for upcoming science exams',
      categoryName: 'Education & Science',
    },
    {
      name: 'Science Fair Ideas',
      prompt: 'Suggest 3 interesting science fair projects for high school',
      categoryName: 'Education & Science',
    },

    {
      name: 'Intellectual Property Basics',
      prompt: 'Explain trademark vs copyright in simple terms',
      categoryName: 'Rights & Laws',
    },
    {
      name: 'GDPR Overview',
      prompt: 'Summarize the main points of GDPR for a small business website',
      categoryName: 'Rights & Laws',
    },
  ];

  for (const scen of scenariosData) {

    const category = createdCategories.find(
      (cat) => cat.name === scen.categoryName
    );
    if (!category) {
      console.log(`Category not found for scenario: ${scen.name}`);
      continue;
    }

    await prisma.scenario.create({
      data: {
        name: scen.name,
        prompt: scen.prompt,
        params: {},
        Category: {
            connect: { id: category.id },
        },
      },
    });
  }
}

main()
  .then(async () => {
    console.log('Seeding success!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });