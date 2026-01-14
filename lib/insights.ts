import type { 
  ConceptProgress, 
  QuizResult, 
  StudySession, 
  Insight 
} from '@/lib/types';
import { 
  calculateStreak, 
  calculateVelocity, 
  getWeakConcepts, 
  calculateImprovementTrend 
} from './analytics';

/**
 * Generate personalized learning insights based on user data
 */
export function generateInsights(
  quizResults: QuizResult[],
  sessions: StudySession[],
  concepts: ConceptProgress[]
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  
  // Analyze streak
  const streak = calculateStreak(sessions);
  if (streak >= 7) {
    insights.push({
      id: `streak-${streak}`,
      type: 'encouragement',
      title: streak >= 30 ? '30-Day Study Streak! 🎉' : 
             streak >= 14 ? '14-Day Study Streak! 🌟' : 
             '7-Day Study Streak! 🔥',
      message: `Amazing! You've studied for ${streak} consecutive days. This consistency will maximize your learning.`,
      action: {
        label: 'View Trends',
        target: '/dashboard/analytics/trends',
        type: 'study'
      },
      timestamp: now
    });
  } else if (streak === 0 && sessions.length > 0) {
    insights.push({
      id: 'streak-warning',
      type: 'warning',
      title: 'Start a New Streak',
      message: 'Your study streak was broken, but every day is a fresh start! Begin again today.',
      action: {
        label: 'Start Studying',
        target: '/dashboard/classes',
        type: 'concept'
      },
      timestamp: now
    });
  }
  
  // Analyze performance trends
  if (quizResults.length >= 5) {
    const trend = calculateImprovementTrend(quizResults);
    if (trend.trend === 'improving' && trend.percentageChange > 10) {
      insights.push({
        id: 'improving-trend',
        type: 'highlight',
        title: 'Performance Improving! 📈',
        message: `Your quiz scores have improved by ${trend.percentageChange.toFixed(0)}% recently. Keep up the excellent work!`,
        action: {
          label: 'Take Quiz',
          target: '/dashboard/classes',
          type: 'quiz'
        },
        timestamp: now
      });
    } else if (trend.trend === 'declining' && trend.percentageChange < -5) {
      insights.push({
        id: 'declining-trend',
        type: 'warning',
        title: 'Performance Declining',
        message: `Your recent quiz scores are ${Math.abs(trend.percentageChange).toFixed(0)}% lower than before. Consider reviewing previous concepts.`,
        action: {
          label: 'Review Weak Areas',
          target: '/dashboard/analytics',
          type: 'study'
        },
        timestamp: now
      });
    }
  }
  
  // Identify weak concepts
  const weakConcepts = getWeakConcepts(quizResults, 60, 3);
  if (weakConcepts.length > 0) {
    const topWeakConcept = weakConcepts[0];
    const improving = sessions.some(s => 
      s.conceptsStudied?.includes(topWeakConcept.conceptId) && 
      s.date > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    );
    
    insights.push({
      id: `weak-concept-${topWeakConcept.conceptId}`,
      type: improving ? 'encouragement' : 'recommendation',
      title: improving ? 'Working on Weak Areas 💪' : 'Concept Needs Review',
      message: improving 
        ? `${topWeakConcept.name} still needs work, but you're actively reviewing it. Keep going!`
        : `${topWeakConcept.name} has a ${topWeakConcept.averageScore.toFixed(0)}% average. Consider revisiting this concept.`,
      action: {
        label: 'Review Concept',
        target: `/dashboard/classes?concept=${topWeakConcept.conceptId}`,
        type: 'concept'
      },
      timestamp: now
    });
  }
  
  // Analyze time investment
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const studyHoursThisWeek = sessions
    .filter(s => s.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, s) => sum + s.duration, 0) / 3600; // Convert to hours
  
  if (studyHoursThisWeek < 2) {
    insights.push({
      id: 'low-study-time',
      type: 'recommendation',
      title: 'Increase Study Time',
      message: 'You\'ve studied less than 2 hours this week. Try to study at least 30 minutes daily for better results.',
      action: {
        label: 'Set Study Goal',
        target: '/dashboard/settings',
        type: 'study'
      },
      timestamp: now
    });
  } else if (studyHoursThisWeek > 7) {
    insights.push({
      id: 'high-study-time',
      type: 'highlight',
      title: 'Excellent Study Commitment! 🌟',
      message: `You\'ve studied ${studyHoursThisWeek.toFixed(1)} hours this week. This dedication will accelerate your learning.`,
      action: {
        label: 'View Progress',
        target: '/dashboard/analytics/trends',
        type: 'study'
      },
      timestamp: now
    });
  }
  
  // Analyze velocity
  const velocity = calculateVelocity(sessions, 7); // concepts per week
  if (velocity < 2) {
    insights.push({
      id: 'low-velocity',
      type: 'recommendation',
      title: 'Learning Pace Suggestions',
      message: 'You\'re learning 2 or fewer concepts per week. Try breaking study sessions into smaller, more frequent chunks.',
      action: {
        label: 'Plan Schedule',
        target: '/dashboard/settings',
        type: 'study'
      },
      timestamp: now
    });
  } else if (velocity > 7) {
    insights.push({
      id: 'high-velocity',
      type: 'highlight',
      title: 'Fast Learner! ⚡',
      message: `You\'re mastering ${velocity.toFixed(1)} concepts per week. This is an excellent learning pace!`,
      action: {
        label: 'View All Concepts',
        target: '/dashboard/classes',
        type: 'concept'
      },
      timestamp: now
    });
  }
  
  // Quiz frequency insights
  const recentQuizzes = quizResults.filter(q => 
    q.date >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  );
  if (recentQuizzes.length < 2) {
    insights.push({
      id: 'insufficient-quizzes',
      type: 'encouragement',
      title: 'Take More Quizzes',
      message: 'You haven\'t taken many quizzes recently. Regular quizzing helps reinforce learning and identify weak areas.',
      action: {
        label: 'Start Quiz',
        target: '/dashboard/classes',
        type: 'quiz'
      },
      timestamp: now
    });
  }
  
  return insights;
}

/**
 * Generate specific recommendations for next study session
 */
export function getNextStudyRecommendation(
  concepts: ConceptProgress[],
  weakConcepts: ReturnType<typeof getWeakConcepts>,
  recentSessions: StudySession[]
): Insight {
  const now = new Date();
  
  // If there are weak concepts, prioritize them
  if (weakConcepts.length > 0) {
    const weakest = weakConcepts[0];
    return {
      id: 'next-weak-concept',
      type: 'recommendation',
      title: 'Next Focus Area',
      message: `Focus on ${weakest.name} - your weakest concept. Review the material and take a practice quiz.`,
      action: {
        label: 'Study Now',
        target: `/dashboard/classes?concept=${weakest.conceptId}`,
        type: 'concept'
      },
      timestamp: now
    };
  }
  
  // If no weak concepts, suggest an incomplete concept
  const incompleteConcepts = concepts.filter(c => c.masteryLevel === 'In Progress');
  if (incompleteConcepts.length > 0) {
    const next = incompleteConcepts[0];
    return {
      id: 'next-incomplete-concept',
      type: 'recommendation',
      title: 'Continue Learning',
      message: `Continue with ${next.name} - you're making good progress!`,
      action: {
        label: 'Continue Study',
        target: `/dashboard/classes?concept=${next.conceptId}`,
        type: 'concept'
      },
      timestamp: now
    };
  }
  
  // If all concepts are mastered, suggest new material
  return {
    id: 'next-new-material',
    type: 'encouragement',
    title: 'Ready for More?',
    message: 'Excellent! You\'ve mastered all current concepts. Ready to start the next chapter?',
    action: {
      label: 'Explore Next Chapter',
      target: '/dashboard/classes',
      type: 'concept'
    },
    timestamp: now
  };
}

/**
 * Generate motivational message based on user progress
 */
export function generateMotivationalMessage(
  quizResults: QuizResult[],
  sessions: StudySession[],
  concepts: ConceptProgress[]
): string {
  const streak = calculateStreak(sessions);
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const masteredConcepts = concepts.filter(c => c.masteryLevel === 'Master').length;
  
  // Check for special achievements
  if (streak >= 30) {
    return "🎉 You're on fire! A 30-day study streak is incredible dedication. Your future self will thank you!";
  }
  
  if (masteredConcepts >= 10) {
    return `🌟 Outstanding! You've mastered ${masteredConcepts} concepts. That's true expertise in the making!`;
  }
  
  if (totalStudyTime > 100 * 3600) { // 100 hours
    return "⏰ Learning legend! 100+ hours spent studying shows your commitment to mastery.";
  }
  
  // General encouragement based on streak or recent activity
  if (streak >= 7) {
    return `🔥 ${streak}-day streak going strong! Consistency is the key to mastery. Keep it up!`;
  }
  
  if (sessions.length > 0) {
    const lastSession = sessions[0];
    const daysSinceLastStudy = Math.floor((Date.now() - lastSession.date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastStudy <= 1) {
      return "📚 Great job studying recently! Every session builds your knowledge foundation.";
    } else if (daysSinceLastStudy <= 3) {
      return "💪 You're doing well! Keep the momentum going with another study session today.";
    }
  }
  
  return "🚀 Ready to learn? Every expert was once a beginner. Your journey starts with the next concept!";
}

/**
 * Analyze study pattern and provide personalized schedule recommendations
 */
export function analyzeStudyPattern(sessions: StudySession[]): {
  bestTimeToStudy: string;
  recommendedStudyDuration: number;
  optimalFrequency: string;
  patternInsights: string;
} {
  if (sessions.length < 3) {
    return {
      bestTimeToStudy: 'Evening (5-8 PM)',
      recommendedStudyDuration: 45,
      optimalFrequency: '5-6 days per week',
      patternInsights: 'Study 3+ sessions for personalized recommendations'
    };
  }
  
  // Analyze time of day patterns
  const hourCounts: { [hour: number]: number } = {};
  sessions.forEach(session => {
    const hour = session.date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const mostCommonHour = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)[0];
  
  let bestTimeToStudy: string;
  if (mostCommonHour) {
    const hour = parseInt(mostCommonHour[0]);
    if (hour >= 5 && hour < 12) {
      bestTimeToStudy = 'Morning';
    } else if (hour >= 12 && hour < 17) {
      bestTimeToStudy = 'Afternoon';
    } else {
      bestTimeToStudy = 'Evening';
    }
  } else {
    bestTimeToStudy = 'Evening';
  }
  
  // Calculate optimal study duration (middle 50% of sessions)
  const sortedDurations = sessions.map(s => s.duration).sort((a, b) => a - b);
  const medianDuration = sortedDurations[Math.floor(sortedDurations.length / 2)];
  const recommendedStudyDuration = Math.round(medianDuration / 60); // Convert to minutes
  
  // Calculate optimal frequency
  const studyDays = new Set(sessions.map(s => s.date.toDateString())).size;
  const daysSinceFirstSession = Math.max(1, 
    Math.floor((Date.now() - Math.min(...sessions.map(s => s.date.getTime()))) / (1000 * 60 * 60 * 24))
  );
  const avgFrequency = studyDays / daysSinceFirstSession;
  
  let optimalFrequency: string;
  if (avgFrequency >= 0.9) {
    optimalFrequency = 'Daily study';
  } else if (avgFrequency >= 0.7) {
    optimalFrequency = '5-6 days per week';
  } else if (avgFrequency >= 0.4) {
    optimalFrequency = '2-3 days per week';
  } else {
    optimalFrequency = '1-2 days per week';
  }
  
  return {
    bestTimeToStudy,
    recommendedStudyDuration,
    optimalFrequency,
    patternInsights: `Based on ${sessions.length} study sessions`
  };
}