import { db } from "@/utils/db";
import { Companies } from "@/utils/schema";
import { desc, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit')) || 50;

        let query = db.select().from(Companies);

        if (search) {
            query = query.where(ilike(Companies.name, `%${search}%`));
        }

        const companies = await query
            .orderBy(desc(Companies.isPopular), desc(Companies.questionCount))
            .limit(limit);

        return NextResponse.json(companies);

    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json(
            { error: "Failed to fetch companies" }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { name, logo, industry, description, websiteUrl } = await request.json();

        const result = await db.insert(Companies).values({
            name,
            logo,
            industry,
            description,
            websiteUrl
        }).returning();

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('Error creating company:', error);
        return NextResponse.json(
            { error: "Failed to create company" }, 
            { status: 500 }
        );
    }
}
