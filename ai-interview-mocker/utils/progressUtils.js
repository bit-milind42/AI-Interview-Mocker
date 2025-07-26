// Utility functions for progress tracking and analytics

/**
 * Extract technology stack from job description
 * @param {string} jobDesc - Job description text
 * @returns {string[]} - Array of detected technologies
 */
export const extractTechStack = (jobDesc) => {
  if (!jobDesc) return ['General'];
  
  const commonTech = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 
    'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'Dart', 'R', 'MATLAB',
    
    // Frontend Frameworks/Libraries
    'React', 'Angular', 'Vue.js', 'Vue', 'Svelte', 'jQuery', 'Bootstrap', 
    'Tailwind', 'Material-UI', 'Sass', 'SCSS', 'Less',
    
    // Backend Frameworks
    'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring', 
    'Spring Boot', 'Laravel', 'Symfony', 'Ruby on Rails', 'ASP.NET', 
    'Nest.js', 'Koa.js',
    
    // Databases
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 
    'Oracle', 'Microsoft SQL Server', 'MariaDB', 'Cassandra', 
    'DynamoDB', 'Firebase', 'Firestore',
    
    // Cloud Platforms
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'Vercel', 
    'Netlify', 'DigitalOcean',
    
    // DevOps & Tools
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 
    'Terraform', 'Ansible', 'Puppet', 'Chef', 'Vagrant',
    
    // Version Control
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
    
    // Testing
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Pytest', 
    'JUnit', 'TestNG', 'PHPUnit',
    
    // API Technologies
    'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'JSON', 'XML',
    
    // Mobile Development
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova',
    
    // Data Science & ML
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 
    'Matplotlib', 'Seaborn', 'Jupyter', 'Apache Spark',
    
    // Other Technologies
    'Microservices', 'Serverless', 'PWA', 'WebAssembly', 'Blockchain', 
    'Machine Learning', 'AI', 'DevOps', 'CI/CD', 'Agile', 'Scrum'
  ];
  
  const found = [];
  const lowerDesc = jobDesc.toLowerCase();
  
  commonTech.forEach(tech => {
    const techVariations = [
      tech.toLowerCase(),
      tech.toLowerCase().replace('.', ''),
      tech.toLowerCase().replace(/[\s-]/g, ''),
      tech.toLowerCase().replace('js', 'javascript')
    ];
    
    if (techVariations.some(variation => lowerDesc.includes(variation))) {
      if (!found.includes(tech)) {
        found.push(tech);
      }
    }
  });
  
  return found.length > 0 ? found : ['General'];
};

/**
 * Calculate progress trend for a specific role
 * @param {Array} interviews - Array of interviews for the role
 * @param {Array} answers - Array of all user answers
 * @returns {number} - Trend percentage
 */
export const calculateRoleTrend = (interviews, answers) => {
  if (interviews.length < 2) return 0;
  
  const interviewsWithRatings = interviews
    .map(interview => {
      const interviewAnswers = answers.filter(a => a.mockIdRef === interview.mockId);
      if (interviewAnswers.length === 0) return null;
      
      const avgRating = interviewAnswers.reduce((sum, answer) => {
        return sum + (parseFloat(answer.rating) || 0);
      }, 0) / interviewAnswers.length;
      
      return {
        rating: avgRating,
        date: new Date(interview.createdAt)
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => a.date - b.date);
  
  if (interviewsWithRatings.length < 2) return 0;
  
  const midpoint = Math.floor(interviewsWithRatings.length / 2);
  const earlierInterviews = interviewsWithRatings.slice(0, midpoint);
  const recentInterviews = interviewsWithRatings.slice(midpoint);
  
  const earlierAvg = earlierInterviews.reduce((sum, item) => sum + item.rating, 0) / earlierInterviews.length;
  const recentAvg = recentInterviews.reduce((sum, item) => sum + item.rating, 0) / recentInterviews.length;
  
  if (earlierAvg === 0) return 0;
  return ((recentAvg - earlierAvg) / earlierAvg * 100);
};

/**
 * Calculate overall improvement trend
 * @param {Array} answers - Array of user answers sorted by date
 * @returns {number} - Overall trend percentage
 */
export const calculateOverallTrend = (answers) => {
  if (answers.length < 4) return 0;
  
  const sortedAnswers = answers
    .filter(a => a.rating && a.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(a => parseFloat(a.rating))
    .filter(rating => !isNaN(rating));
    
  if (sortedAnswers.length < 4) return 0;
  
  const midpoint = Math.floor(sortedAnswers.length / 2);
  const firstHalf = sortedAnswers.slice(0, midpoint);
  const secondHalf = sortedAnswers.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length;
  
  if (firstAvg === 0) return 0;
  return ((secondAvg - firstAvg) / firstAvg * 100);
};

/**
 * Group interviews by job role
 * @param {Array} interviews - Array of interviews
 * @param {Array} answers - Array of user answers
 * @returns {Array} - Array of job role statistics
 */
export const groupByJobRole = (interviews, answers) => {
  const roleGroups = {};
  
  interviews.forEach(interview => {
    const role = interview.jobPosition;
    
    if (!roleGroups[role]) {
      roleGroups[role] = {
        role: role,
        count: 0,
        interviews: [],
        totalRating: 0,
        ratedAnswers: 0,
        averageRating: 0,
        trend: 0
      };
    }
    
    roleGroups[role].count++;
    roleGroups[role].interviews.push(interview);
  });
  
  // Calculate ratings and trends
  Object.values(roleGroups).forEach(roleData => {
    roleData.interviews.forEach(interview => {
      const interviewAnswers = answers.filter(a => a.mockIdRef === interview.mockId);
      interviewAnswers.forEach(answer => {
        const rating = parseFloat(answer.rating);
        if (!isNaN(rating)) {
          roleData.totalRating += rating;
          roleData.ratedAnswers++;
        }
      });
    });
    
    roleData.averageRating = roleData.ratedAnswers > 0 ? 
      roleData.totalRating / roleData.ratedAnswers : 0;
    roleData.trend = calculateRoleTrend(roleData.interviews, answers);
  });
  
  return Object.values(roleGroups).sort((a, b) => b.count - a.count);
};

/**
 * Group interviews by technology stack
 * @param {Array} interviews - Array of interviews
 * @param {Array} answers - Array of user answers
 * @returns {Array} - Array of tech stack statistics
 */
export const groupByTechStack = (interviews, answers) => {
  const techGroups = {};
  
  interviews.forEach(interview => {
    const techStack = extractTechStack(interview.jobDesc);
    
    techStack.forEach(tech => {
      if (!techGroups[tech]) {
        techGroups[tech] = {
          tech: tech,
          count: 0,
          totalRating: 0,
          ratedAnswers: 0,
          averageRating: 0
        };
      }
      
      techGroups[tech].count++;
      
      // Add ratings for this tech
      const interviewAnswers = answers.filter(a => a.mockIdRef === interview.mockId);
      interviewAnswers.forEach(answer => {
        const rating = parseFloat(answer.rating);
        if (!isNaN(rating)) {
          techGroups[tech].totalRating += rating;
          techGroups[tech].ratedAnswers++;
        }
      });
    });
  });
  
  // Calculate averages
  Object.values(techGroups).forEach(techData => {
    techData.averageRating = techData.ratedAnswers > 0 ? 
      techData.totalRating / techData.ratedAnswers : 0;
  });
  
  return Object.values(techGroups).sort((a, b) => b.averageRating - a.averageRating);
};

/**
 * Calculate monthly progress statistics
 * @param {Array} interviews - Array of interviews
 * @param {Array} answers - Array of user answers
 * @returns {Array} - Array of monthly statistics
 */
export const calculateMonthlyProgress = (interviews, answers) => {
  const monthlyStats = {};
  
  interviews.forEach(interview => {
    const month = new Date(interview.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        month: month,
        count: 0,
        totalRating: 0,
        ratedAnswers: 0,
        averageRating: 0
      };
    }
    
    monthlyStats[month].count++;
    
    // Add ratings for this month
    const interviewAnswers = answers.filter(a => a.mockIdRef === interview.mockId);
    interviewAnswers.forEach(answer => {
      const rating = parseFloat(answer.rating);
      if (!isNaN(rating)) {
        monthlyStats[month].totalRating += rating;
        monthlyStats[month].ratedAnswers++;
      }
    });
  });
  
  // Calculate averages
  const monthlyArray = Object.values(monthlyStats).map(monthData => ({
    ...monthData,
    averageRating: monthData.ratedAnswers > 0 ? 
      monthData.totalRating / monthData.ratedAnswers : 0
  }));
  
  // Sort by date
  return monthlyArray.sort((a, b) => new Date(a.month) - new Date(b.month));
};

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get performance color based on rating
 * @param {number} rating - Rating value (0-10)
 * @returns {string} - CSS color class
 */
export const getPerformanceColor = (rating) => {
  if (rating >= 8) return 'text-green-600';
  if (rating >= 6) return 'text-yellow-600';
  if (rating >= 4) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get performance background color based on rating
 * @param {number} rating - Rating value (0-10)
 * @returns {string} - CSS background color class
 */
export const getPerformanceBgColor = (rating) => {
  if (rating >= 8) return 'bg-green-500';
  if (rating >= 6) return 'bg-yellow-500';
  if (rating >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};
