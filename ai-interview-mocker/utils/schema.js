
import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdAt:text('createdAt').notNull(),
    createdBy:varchar('createdBy'),
    mockId:varchar('mockId').notNull(),
})

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt: varchar('createdAt'),
})

export const QuestionBank = pgTable('questionBank', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    answer: text('answer'),
    category: varchar('category').notNull(), // 'hr', 'technical', 'company-specific'
    difficulty: varchar('difficulty').notNull(), // 'easy', 'medium', 'hard'
    jobRole: varchar('jobRole'),
    technology: varchar('technology'),
    company: varchar('company'),
    isPopular: boolean('isPopular').default(false),
    viewCount: integer('viewCount').default(0),
    practiceCount: integer('practiceCount').default(0),
    successRate: integer('successRate').default(0),
    tags: text('tags'), // JSON array of tags
    estimatedTime: varchar('estimatedTime'),
    isRealQuestion: boolean('isRealQuestion').default(false), // true for actual company questions
    questionSource: varchar('questionSource'), // 'AI-Generated', 'Company-Verified', 'User-Reported', etc.
    interviewYear: varchar('interviewYear'), // year when question was asked
    interviewRound: varchar('interviewRound'), // 'Technical Round 1', 'HR Round', etc.
    verificationStatus: varchar('verificationStatus').default('unverified'), // 'verified', 'unverified', 'disputed'
    reportedBy: varchar('reportedBy'), // user who reported this real question
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    createdBy: varchar('createdBy'),
})

export const Companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    logo: varchar('logo'),
    industry: varchar('industry'),
    description: text('description'),
    websiteUrl: varchar('websiteUrl'),
    questionCount: integer('questionCount').default(0),
    isPopular: boolean('isPopular').default(false),
    createdAt: timestamp('createdAt').defaultNow(),
})

export const UserQuestionActivity = pgTable('userQuestionActivity', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    questionId: integer('questionId').notNull(),
    isBookmarked: boolean('isBookmarked').default(false),
    isPracticed: boolean('isPracticed').default(false),
    difficulty: varchar('difficulty'),
    timeTaken: integer('timeTaken'), // in seconds
    userRating: integer('userRating'), // 1-5 stars
    practiceDate: timestamp('practiceDate').defaultNow(),
})

export const schema = {
    MockInterview,
    UserAnswer,
    QuestionBank,
    Companies,
    UserQuestionActivity
};