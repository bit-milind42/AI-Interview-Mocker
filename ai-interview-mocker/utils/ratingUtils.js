// Rating utility functions for interview feedback

/**
 * Define minimum rating thresholds for different categories
 */
export const RATING_THRESHOLDS = {
    MINIMUM_PASSING_RATING: 3, // Questions below this need improvement
    GOOD_RATING: 4, // Good performance threshold
    EXCELLENT_RATING: 5, // Excellent performance
    OVERALL_MINIMUM: 2.5, // Minimum overall interview rating to be considered passing
};

/**
 * Rating categories and their descriptions
 */
export const RATING_CATEGORIES = {
    1: {
        label: "Poor",
        description: "Needs significant improvement",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
    },
    2: {
        label: "Below Average",
        description: "Requires improvement",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
    },
    3: {
        label: "Average",
        description: "Meets basic expectations",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
    },
    4: {
        label: "Good",
        description: "Solid performance",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    5: {
        label: "Excellent",
        description: "Outstanding performance",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
    }
};

/**
 * Check if a question rating meets minimum threshold
 * @param {number} rating - The rating to check (1-5)
 * @returns {boolean} - Whether the rating meets minimum threshold
 */
export const meetsMinimumRating = (rating) => {
    return rating >= RATING_THRESHOLDS.MINIMUM_PASSING_RATING;
};

/**
 * Check if overall interview rating is passing
 * @param {number} overallRating - The overall interview rating
 * @returns {boolean} - Whether the overall rating is passing
 */
export const isPassingOverallRating = (overallRating) => {
    return overallRating >= RATING_THRESHOLDS.OVERALL_MINIMUM;
};

/**
 * Get rating category information
 * @param {number} rating - The rating (1-5)
 * @returns {object} - Rating category information
 */
export const getRatingCategory = (rating) => {
    const roundedRating = Math.round(rating);
    return RATING_CATEGORIES[roundedRating] || RATING_CATEGORIES[1];
};

/**
 * Get questions that need improvement (below minimum threshold)
 * @param {array} feedbackList - Array of feedback items with ratings
 * @returns {array} - Questions that need improvement
 */
export const getQuestionsNeedingImprovement = (feedbackList) => {
    return feedbackList.filter(item => {
        const rating = parseInt(item.rating) || 0;
        return !meetsMinimumRating(rating);
    });
};

/**
 * Calculate performance statistics
 * @param {array} feedbackList - Array of feedback items with ratings
 * @returns {object} - Performance statistics
 */
export const calculatePerformanceStats = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) {
        return {
            totalQuestions: 0,
            averageRating: 0,
            questionsNeedingImprovement: 0,
            passedQuestions: 0,
            overallPass: false
        };
    }

    const ratings = feedbackList.map(item => parseInt(item.rating) || 0);
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = totalRating / ratings.length;
    
    const questionsNeedingImprovement = getQuestionsNeedingImprovement(feedbackList);
    const passedQuestions = feedbackList.length - questionsNeedingImprovement.length;

    return {
        totalQuestions: feedbackList.length,
        averageRating: Math.round(averageRating * 10) / 10,
        questionsNeedingImprovement: questionsNeedingImprovement.length,
        passedQuestions,
        overallPass: isPassingOverallRating(averageRating),
        needsImprovementQuestions: questionsNeedingImprovement
    };
};

/**
 * Generate improvement recommendations based on performance
 * @param {object} stats - Performance statistics
 * @returns {array} - Array of recommendation strings
 */
export const generateRecommendations = (stats) => {
    const recommendations = [];

    if (!stats.overallPass) {
        recommendations.push("Focus on improving your overall interview performance. Consider more practice sessions.");
    }

    if (stats.questionsNeedingImprovement > 0) {
        recommendations.push(`${stats.questionsNeedingImprovement} question(s) need improvement. Review the feedback carefully.`);
    }

    if (stats.questionsNeedingImprovement > stats.totalQuestions / 2) {
        recommendations.push("Consider studying the fundamentals more thoroughly before your next practice session.");
    }

    if (stats.averageRating >= RATING_THRESHOLDS.GOOD_RATING) {
        recommendations.push("Great job! You're performing well. Keep practicing to maintain this level.");
    }

    return recommendations;
};
