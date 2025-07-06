# AI Interview Mocker

An intelligent AI-powered interview practice platform built with Next.js, featuring realistic interview simulations, detailed feedback analysis, and integrated payment processing.

## Features

### 🤖 AI-Powered Interviews
- Generate realistic interview questions using Google Gemini AI
- Industry-specific question sets
- Personalized feedback and scoring
- Speech-to-text interview responses

### 💳 Integrated Payment System
- Multiple subscription tiers (Free, Pro, Enterprise)
- Razorpay payment integration
- Secure webhook handling
- Subscription management

### 🎯 Smart Analytics
- Performance tracking over time
- Detailed feedback analysis
- Interview session history
- Progress monitoring

### 🔐 Authentication & Security
- Clerk authentication integration
- Secure user management
- Protected routes and features
- Role-based access control

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI**: Google Gemini API
- **Payments**: Razorpay
- **UI Components**: Radix UI, Lucide React
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Google Gemini API key
- Razorpay account for payments

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-interview-mocker.git
cd ai-interview-mocker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_neon_database_url

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Set up the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Subscription Plans

### Free Plan (₹0/month)
- 3 AI interview sessions
- Basic feedback analysis
- Common interview questions
- Email support

### Pro Plan (₹999/month)
- Unlimited AI interview sessions
- Advanced feedback analysis
- Industry-specific questions
- Priority support
- Detailed analytics
- Custom scenarios

### Enterprise Plan (₹4999/month)
- Everything in Pro
- Team management
- Custom branding
- API access
- Dedicated support
- Advanced reporting

## Payment Integration

The application uses Razorpay for secure payment processing. For detailed setup instructions, see [RAZORPAY_INTEGRATION.md](./RAZORPAY_INTEGRATION.md).

### Testing Payments
Use test cards for development:
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   │   ├── interviews/      # Interview management
│   │   └── payment/         # Payment processing
│   ├── dashboard/           # Dashboard pages
│   │   ├── upgrade/         # Pricing page
│   │   └── interview/       # Interview components
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # UI components
│   ├── SubscriptionProvider.jsx
│   └── UpgradePrompt.jsx
├── lib/                     # Utility libraries
├── utils/                   # Database and AI utilities
└── public/                  # Static assets
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio

### Adding New Features
1. Create new components in `/components`
2. Add API routes in `/app/api`
3. Update subscription logic in `SubscriptionProvider`
4. Test payment flows thoroughly

## Deployment

### Environment Setup
1. Set up production database
2. Configure Clerk for production domain
3. Set up Razorpay webhooks
4. Update environment variables
5. Deploy to Vercel or your preferred platform

### Vercel Deployment
The easiest deployment option:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- 📧 Email: support@aiinterviewmocker.com
- 📚 Documentation: [View Docs](./RAZORPAY_INTEGRATION.md)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-interview-mocker/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
