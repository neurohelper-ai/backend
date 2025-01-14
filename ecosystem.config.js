module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/src/main.js', // Ensure this points to the compiled entry point
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        JWT_SECRET: 'ADMIN',
        OPENAI_API_KEY: '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',
        FIREBASE_API_KEY: 'AIzaSyAdM4EPp_Jx39mS-rxpdbmaVARAUIo4el4',
        FIREBASE_AUTH_DOMAIN: 'neurohelper-ai.firebaseapp.com',
        FIREBASE_PROJECT_ID: 'neurohelper-ai',
        FIREBASE_STORAGE_BUCKET: 'neurohelper-ai.appspot.com',
        FIREBASE_MESSAGING_SENDER_ID: '650536591804',
        FIREBASE_APP_ID: '1:650536591804:web:71c6a7dd72a79c55c60bb9',
        DATABASE_URL: 'mongodb+srv://admin:J7oxyO1InjA7MQTN@cluster0.iq82l.mongodb.net/neurohelper?retryWrites=true&w=majority&appName=Cluster0'
      },
    },
  ],
};