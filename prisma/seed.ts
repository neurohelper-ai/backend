import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {


  const categoriesData = [
    {
      key: 'life_quality_health',
      name: 'Life Quality & Health',
      translations: {
        en: 'Life Quality & Health',
        fr: 'Qualité de vie et santé',
        vi: 'Chất lượng cuộc sống & Sức khỏe',
        cn: '生活质量与健康',
        ar: 'جودة الحياة والصحة',
      },
    },
    {
      key: 'business_management',
      name: 'Business & Management',
      translations: {
        en: 'Business & Management',
        fr: 'Affaires & Gestion',
        vi: 'Kinh doanh & Quản lý',
        cn: '商业与管理',
        ar: 'الأعمال والإدارة',
      },
    },
    {
      key: 'finance_investment',
      name: 'Finance & Investment',
      translations: {
        en: 'Finance & Investment',
        fr: 'Finance & Investissement',
        vi: 'Tài chính & Đầu tư',
        cn: '金融与投资',
        ar: 'التمويل والاستثمار',
      },
    },
    {
      key: 'content_socials',
      name: 'Content Making & Socials',
      translations: {
        en: 'Content Making & Socials',
        fr: 'Création de contenu & Réseaux sociaux',
        vi: 'Sáng tạo nội dung & Mạng xã hội',
        cn: '内容创作与社交',
        ar: 'إنشاء المحتوى ووسائل التواصل الاجتماعي',
      },
    },
    {
      key: 'technology_development',
      name: 'Technology & Development',
      translations: {
        en: 'Technology & Development',
        fr: 'Technologie & Développement',
        vi: 'Công nghệ & Phát triển',
        cn: '技术与发展',
        ar: 'التكنولوجيا والتطوير',
      },
    },
    {
      key: 'education_science',
      name: 'Education & Science',
      translations: {
        en: 'Education & Science',
        fr: 'Éducation & Science',
        vi: 'Giáo dục & Khoa học',
        cn: '教育与科学',
        ar: 'التعليم والعلوم',
      },
    },
    {
      key: 'rights_laws',
      name: 'Rights & Laws',
      translations: {
        en: 'Rights & Laws',
        fr: 'Droits & Lois',
        vi: 'Quyền & Luật pháp',
        cn: '权利与法律',
        ar: 'الحقوق والقوانين',
      },
    },
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
      key: 'daily_health_tips',
      name: 'Daily Health Tips',
      translations: {
        en: 'Daily Health Tips',
        fr: 'Conseils quotidiens pour la santé',
        ar: 'نصائح يومية للصحة',
        cn: '每日健康提示',
        vi: 'Lời khuyên sức khỏe hàng ngày',
      },
      prompt: 'Create a personalized routine for healthy living',
      categoryName: 'Life Quality & Health',
    },
    {
      key: 'fitness_at_home',
      name: 'Fitness at Home',
      translations: {
        en: 'Fitness at Home',
        fr: 'Fitness à domicile',
        ar: 'اللياقة البدنية في المنزل',
        cn: '家庭健身',
        vi: 'Thể dục tại nhà',
      },
      prompt: 'Plan a workout routine for busy individuals',
      categoryName: 'Life Quality & Health',
    },
    {
      key: 'project_management_plan',
      name: 'Project Management Plan',
      translations: {
        en: 'Project Management Plan',
        fr: 'Plan de gestion de projet',
        ar: 'خطة إدارة المشروع',
        cn: '项目管理计划',
        vi: 'Kế hoạch quản lý dự án',
      },
      prompt: 'Outline a step-by-step approach to manage a new project',
      categoryName: 'Business & Management',
    },
    {
      key: 'leadership_tips',
      name: 'Leadership Tips',
      translations: {
        en: 'Leadership Tips',
        fr: 'Conseils en leadership',
        ar: 'نصائح القيادة',
        cn: '领导技巧',
        vi: 'Mẹo lãnh đạo',
      },
      prompt: 'Provide best practices for leading a small team',
      categoryName: 'Business & Management',
    },
    {
      key: 'personal_budgeting',
      name: 'Personal Budgeting',
      translations: {
        en: 'Personal Budgeting',
        fr: 'Gestion budgétaire personnelle',
        ar: 'إعداد الميزانية الشخصية',
        cn: '个人预算',
        vi: 'Lập ngân sách cá nhân',
      },
      prompt: 'Help create a monthly budgeting plan',
      categoryName: 'Finance & Investment',
    },
    {
      key: 'basic_investment_strategies',
      name: 'Basic Investment Strategies',
      translations: {
        en: 'Basic Investment Strategies',
        fr: 'Stratégies d’investissement de base',
        ar: 'استراتيجيات الاستثمار الأساسية',
        cn: '基础投资策略',
        vi: 'Chiến lược đầu tư cơ bản',
      },
      prompt: 'Describe how to invest small sums for beginners',
      categoryName: 'Finance & Investment',
    },
    {
      key: 'social_media_content_plan',
      name: 'Social Media Content Plan',
      translations: {
        en: 'Social Media Content Plan',
        fr: 'Plan de contenu pour les réseaux sociaux',
        ar: 'خطة محتوى وسائل التواصل الاجتماعي',
        cn: '社交媒体内容计划',
        vi: 'Kế hoạch nội dung truyền thông xã hội',
      },
      prompt: 'Outline daily content ideas for Instagram',
      categoryName: 'Content Making & Socials',
    },
    {
      key: 'video_script_ideas',
      name: 'Video Script Ideas',
      translations: {
        en: 'Video Script Ideas',
        fr: 'Idées de scripts vidéo',
        ar: 'أفكار نصوص الفيديو',
        cn: '视频脚本创意',
        vi: 'Ý tưởng kịch bản video',
      },
      prompt: 'Give me 5 ideas for short YouTube videos on cooking',
      categoryName: 'Content Making & Socials',
    },
    {
      key: 'introduction_to_python',
      name: 'Introduction to Python',
      translations: {
        en: 'Introduction to Python',
        fr: 'Introduction à Python',
        ar: 'مقدمة إلى بايثون',
        cn: 'Python简介',
        vi: 'Giới thiệu về Python',
      },
      prompt: 'Explain the basics of Python for a beginner developer',
      categoryName: 'Technology & Development',
    },
    {
      key: 'debugging_tips',
      name: 'Debugging Tips',
      translations: {
        en: 'Debugging Tips',
        fr: 'Conseils pour le débogage',
        ar: 'نصائح تصحيح الأخطاء',
        cn: '调试技巧',
        vi: 'Mẹo gỡ lỗi',
      },
      prompt: 'How to systematically debug a Node.js application',
      categoryName: 'Technology & Development',
    },
    {
      key: 'study_plan_for_exams',
      name: 'Study Plan for Exams',
      translations: {
        en: 'Study Plan for Exams',
        fr: 'Plan d’étude pour les examens',
        ar: 'خطة الدراسة للامتحانات',
        cn: '考试学习计划',
        vi: 'Kế hoạch học tập cho kỳ thi',
      },
      prompt: 'Create a study schedule for upcoming science exams',
      categoryName: 'Education & Science',
    },
    {
      key: 'science_fair_ideas',
      name: 'Science Fair Ideas',
      translations: {
        en: 'Science Fair Ideas',
        fr: 'Idées pour une foire scientifique',
        ar: 'أفكار معرض العلوم',
        cn: '科学博览会创意',
        vi: 'Ý tưởng cho hội chợ khoa học',
      },
      prompt: 'Suggest 3 interesting science fair projects for high school',
      categoryName: 'Education & Science',
    },
    {
      key: 'intellectual_property_basics',
      name: 'Intellectual Property Basics',
      translations: {
        en: 'Intellectual Property Basics',
        fr: 'Principes de la propriété intellectuelle',
        ar: 'أساسيات الملكية الفكرية',
        cn: '知识产权基础',
        vi: 'Những điều cơ bản về sở hữu trí tuệ',
      },
      prompt: 'Explain trademark vs copyright in simple terms',
      categoryName: 'Rights & Laws',
    },
    {
      key: 'gdpr_overview',
      name: 'GDPR Overview',
      translations: {
        en: 'GDPR Overview',
        fr: 'Aperçu du RGPD',
        ar: 'نظرة عامة على GDPR',
        cn: 'GDPR概述',
        vi: 'Tổng quan về GDPR',
      },
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
        key: scen.key,
        name: scen.name,
        translations: scen.translations,
        prompt: scen.prompt,
        params: {},
        category: {
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