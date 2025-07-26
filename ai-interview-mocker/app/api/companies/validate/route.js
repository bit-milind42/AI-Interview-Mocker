import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Known valid companies to bypass AI validation for common ones
const KNOWN_VALID_COMPANIES = {
    'google': { isValid: true, companyName: 'Google', industry: 'Technology', reason: 'Major tech company' },
    'microsoft': { isValid: true, companyName: 'Microsoft', industry: 'Technology', reason: 'Major tech company' },
    'amazon': { isValid: true, companyName: 'Amazon', industry: 'E-commerce/Cloud', reason: 'Major tech company' },
    'meta': { isValid: true, companyName: 'Meta', industry: 'Social Media', reason: 'Major tech company' },
    'facebook': { isValid: true, companyName: 'Meta (Facebook)', industry: 'Social Media', reason: 'Major tech company' },
    'apple': { isValid: true, companyName: 'Apple', industry: 'Technology', reason: 'Major tech company' },
    'netflix': { isValid: true, companyName: 'Netflix', industry: 'Entertainment', reason: 'Major streaming company' },
    'tesla': { isValid: true, companyName: 'Tesla', industry: 'Automotive/Energy', reason: 'Major electric vehicle company' },
    'spotify': { isValid: true, companyName: 'Spotify', industry: 'Music Streaming', reason: 'Major music streaming company' },
    'uber': { isValid: true, companyName: 'Uber', industry: 'Transportation', reason: 'Major ride-sharing company' },
    'airbnb': { isValid: true, companyName: 'Airbnb', industry: 'Hospitality', reason: 'Major accommodation platform' },
    'linkedin': { isValid: true, companyName: 'LinkedIn', industry: 'Professional Network', reason: 'Major professional network' },
    'twitter': { isValid: true, companyName: 'X (Twitter)', industry: 'Social Media', reason: 'Major social media platform' },
    'x': { isValid: true, companyName: 'X (Twitter)', industry: 'Social Media', reason: 'Major social media platform' },
    'salesforce': { isValid: true, companyName: 'Salesforce', industry: 'Cloud Software', reason: 'Major CRM company' },
    'oracle': { isValid: true, companyName: 'Oracle', industry: 'Database/Cloud', reason: 'Major database company' },
    'ibm': { isValid: true, companyName: 'IBM', industry: 'Technology', reason: 'Major tech company' },
    'intel': { isValid: true, companyName: 'Intel', industry: 'Semiconductors', reason: 'Major chip manufacturer' },
    'nvidia': { isValid: true, companyName: 'NVIDIA', industry: 'Graphics/AI', reason: 'Major GPU manufacturer' },
    'adobe': { isValid: true, companyName: 'Adobe', industry: 'Software', reason: 'Major creative software company' },
    'paypal': { isValid: true, companyName: 'PayPal', industry: 'Fintech', reason: 'Major payment platform' },
    'stripe': { isValid: true, companyName: 'Stripe', industry: 'Fintech', reason: 'Major payment processing company' },
    'shopify': { isValid: true, companyName: 'Shopify', industry: 'E-commerce', reason: 'Major e-commerce platform' },
    'zoom': { isValid: true, companyName: 'Zoom', industry: 'Communication', reason: 'Major video conferencing company' },
    'slack': { isValid: true, companyName: 'Slack', industry: 'Communication', reason: 'Major workplace communication platform' },
    'dropbox': { isValid: true, companyName: 'Dropbox', industry: 'Cloud Storage', reason: 'Major cloud storage company' },
    'github': { isValid: true, companyName: 'GitHub', industry: 'Developer Tools', reason: 'Major code hosting platform' },
    'gitlab': { isValid: true, companyName: 'GitLab', industry: 'Developer Tools', reason: 'Major DevOps platform' },
    'atlassian': { isValid: true, companyName: 'Atlassian', industry: 'Software', reason: 'Major collaboration software company' },
    'twilio': { isValid: true, companyName: 'Twilio', industry: 'Communication APIs', reason: 'Major communication platform' },
    'mongodb': { isValid: true, companyName: 'MongoDB', industry: 'Database', reason: 'Major NoSQL database company' },
    'redis': { isValid: true, companyName: 'Redis', industry: 'Database', reason: 'Major in-memory database company' },
    'elastic': { isValid: true, companyName: 'Elastic', industry: 'Search/Analytics', reason: 'Major search and analytics company' },
    'databricks': { isValid: true, companyName: 'Databricks', industry: 'Data Analytics', reason: 'Major data analytics platform' },
    'snowflake': { isValid: true, companyName: 'Snowflake', industry: 'Cloud Data', reason: 'Major cloud data platform' },
    'palantir': { isValid: true, companyName: 'Palantir', industry: 'Data Analytics', reason: 'Major data analytics company' },
    'jpmorgan': { isValid: true, companyName: 'JPMorgan Chase', industry: 'Banking', reason: 'Major investment bank' },
    'goldman sachs': { isValid: true, companyName: 'Goldman Sachs', industry: 'Investment Banking', reason: 'Major investment bank' },
    'morgan stanley': { isValid: true, companyName: 'Morgan Stanley', industry: 'Investment Banking', reason: 'Major investment bank' },
    'deloitte': { isValid: true, companyName: 'Deloitte', industry: 'Consulting', reason: 'Major consulting firm' },
    'accenture': { isValid: true, companyName: 'Accenture', industry: 'Consulting', reason: 'Major consulting firm' },
    'mckinsey': { isValid: true, companyName: 'McKinsey & Company', industry: 'Consulting', reason: 'Major consulting firm' },
    'bain': { isValid: true, companyName: 'Bain & Company', industry: 'Consulting', reason: 'Major consulting firm' },
    'bcg': { isValid: true, companyName: 'Boston Consulting Group', industry: 'Consulting', reason: 'Major consulting firm' },
};

export async function POST(req) {
    try {
        const { companyName } = await req.json();

        if (!companyName || typeof companyName !== 'string') {
            return NextResponse.json({
                isValid: false,
                reason: 'Invalid company name provided'
            }, { status: 400 });
        }

        const normalizedName = companyName.trim().toLowerCase();

        // Check against known valid companies first
        if (KNOWN_VALID_COMPANIES[normalizedName]) {
            return NextResponse.json(KNOWN_VALID_COMPANIES[normalizedName]);
        }

        // Use AI validation for unknown companies
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = `
            Validate if "${companyName.trim()}" is a legitimate, real company that exists and conducts interviews.
            
            Consider these criteria:
            1. Is it a real, established company (not fictional)?
            2. Does it hire employees and conduct interviews?
            3. Is it a recognizable business entity?
            4. Is it not a made-up or test company name?
            
            Be generous in validation - if it could be a legitimate company name, even if smaller or regional, validate it as true.
            Only reject obviously fake names like "Test Company", "XYZ Corp", "ABC Inc", or clearly fictional names.
            
            Respond with ONLY a JSON object in this exact format:
            {
                "isValid": true/false,
                "companyName": "Corrected/Official company name",
                "industry": "Industry sector",
                "reason": "Brief explanation"
            }
            
            Examples:
            - "Google" -> {"isValid": true, "companyName": "Google", "industry": "Technology", "reason": "Major tech company"}
            - "XYZ Corp" -> {"isValid": false, "companyName": "XYZ Corp", "industry": "", "reason": "Generic/fictional company name"}
            - "Local Restaurant Group" -> {"isValid": true, "companyName": "Local Restaurant Group", "industry": "Food Service", "reason": "Could be a legitimate restaurant business"}
            `;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Clean and parse the JSON response
            let cleanedResponse = text.replace(/```json\n?|\n?```/g, '').trim();
            
            // Handle cases where AI might add extra text
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanedResponse = jsonMatch[0];
            }
            
            const validation = JSON.parse(cleanedResponse);
            
            // Ensure the response has the required structure
            if (typeof validation.isValid !== 'boolean') {
                throw new Error('Invalid response format from AI');
            }
            
            return NextResponse.json(validation);
            
        } catch (error) {
            console.error('Error validating company with AI:', error);
            
            // Improved fallback validation
            const fallbackValid = isLikelyValidCompanyName(companyName.trim());
            
            return NextResponse.json({
                isValid: fallbackValid,
                companyName: companyName.trim(),
                industry: 'Unknown',
                reason: fallbackValid 
                    ? 'Fallback validation - appears to be a legitimate company name' 
                    : 'Fallback validation - appears to be a test or fictional name'
            });
        }
        
    } catch (error) {
        console.error('Company validation error:', error);
        return NextResponse.json({
            error: 'Failed to validate company',
            isValid: false,
            reason: 'Validation service error'
        }, { status: 500 });
    }
}

// Improved fallback validation logic
function isLikelyValidCompanyName(name) {
    const normalizedName = name.toLowerCase().trim();
    
    // Too short
    if (normalizedName.length < 2) return false;
    
    // Obviously fake patterns
    const fakePatterns = [
        /^(test|example|sample|demo|fake|mock)\s*(company|corp|inc|ltd)?$/i,
        /^[xyz]+\s*(corp|company|inc|ltd)?$/i,
        /^(abc|123)\s*(corp|company|inc|ltd)?$/i,
        /^company\s*[0-9]*$/i,
        /^(my|our|the)\s*company$/i,
        /lorem ipsum/i,
        /placeholder/i,
        /dummy/i
    ];
    
    for (const pattern of fakePatterns) {
        if (pattern.test(normalizedName)) return false;
    }
    
    // Has at least one letter
    if (!/[a-zA-Z]/.test(normalizedName)) return false;
    
    // Not just numbers
    if (/^[0-9\s\-\.]+$/.test(normalizedName)) return false;
    
    // Looks like it could be a real company name
    return true;
}
