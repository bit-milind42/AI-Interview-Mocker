
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

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

export const schema = {
    MockInterview
};
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