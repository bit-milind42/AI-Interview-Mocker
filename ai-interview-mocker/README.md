# AI Interview Mocker

An intelligent AI-powered interview practice platform that helps you ace your next job interview with realistic simulations and detailed feedback.

## ✨ Key Features

- 🤖 **AI-Powered Questions** - Generate realistic interview questions using Google Gemini AI
- 📊 **Detailed Feedback** - Get comprehensive analysis of your performance with scoring
- 🎯 **Industry-Specific** - Questions tailored to different job roles and industries
- 🎤 **Speech Recognition** - Practice with voice responses and get real-time feedback
- 💳 **Flexible Pricing** - Free tier available with premium features for serious job seekers

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini API
- **Payments**: Razorpay
- **UI**: Radix UI Components

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)
*Clean and intuitive landing page showcasing the platform's features*

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Comprehensive dashboard to manage your interview sessions and track progress*

### Interview Feedback
![Feedback](./screenshots/feedback.png)
*Detailed feedback analysis with scoring and improvement suggestions*

### Pricing Plans
![Pricing](./screenshots/pricing.png)
*Flexible subscription tiers to match your interview preparation needs*

## 🚀 Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/yourusername/ai-interview-mocker.git
cd ai-interview-mocker
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
```

Add your keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

3. **Run the App**
```bash
npm run db:push
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start practicing!


## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit a pull request.


