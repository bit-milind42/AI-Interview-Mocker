import { sql } from 'drizzle-orm';
import { db } from '../utils/db.js';

async function addRealQuestionColumns() {
  try {
    console.log('Adding new columns to QuestionBank table...');
    
    // Add new columns for real question tracking
    await db.execute(sql`
      ALTER TABLE "questionBank" 
      ADD COLUMN IF NOT EXISTS "isRealQuestion" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "questionSource" VARCHAR,
      ADD COLUMN IF NOT EXISTS "interviewYear" VARCHAR,
      ADD COLUMN IF NOT EXISTS "interviewRound" VARCHAR,
      ADD COLUMN IF NOT EXISTS "verificationStatus" VARCHAR DEFAULT 'unverified',
      ADD COLUMN IF NOT EXISTS "reportedBy" VARCHAR
    `);

    console.log('Successfully added new columns to QuestionBank table!');
    
    // Update existing questions to mark them as AI-generated
    await db.execute(sql`
      UPDATE "questionBank" 
      SET 
        "isRealQuestion" = false,
        "questionSource" = 'AI-Generated',
        "verificationStatus" = 'verified'
      WHERE "isRealQuestion" IS NULL OR "questionSource" IS NULL
    `);

    console.log('Updated existing questions as AI-generated!');
    
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addRealQuestionColumns();
}

export { addRealQuestionColumns };
