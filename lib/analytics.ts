import type { 
  QuizResult, 
  ConceptProgress, 
  StudySession, 
  ProgressTrend 
} from '@/lib/types';

/**
 * Calculate concept mastery level based on quiz performance and time spent
 * Higher scores with more attempts indicate stronger mastery
 */
export const calculateConceptMastery = (
  conceptId: string,
  quizResults: QuizResult[],
  threshold: { easy: number; medium: number; hard: number } = { easy: 70, medium: 65, hard: 60 }
): { level: 'Not Started' | 'In Progress' | 'Competent' | 'Master'; percentage: number } => {
  const relevantQuizzes = quizResults.filter(quiz => 
    quiz.questions.some(q => q.questionId.includes(conceptId))
  );
  
  if (relevantQuizzes.length === 0) {
    return { level: 'Not Started', percentage: 0 };
  }
  
  // Calculate average score across all attempts
  const totalScore = relevantQuizzes.reduce((sum, quiz) => {
    const conceptQuestions = quiz.questions.filter(q => q.questionId.includes(conceptId));
    const correct = conceptQuestions.filter(q => q.isCorrect).length;
    const percentage = (correct / conceptQuestions.length) * 100;
    return sum + percentage;
  }, 0);
  
  const averageScore = totalScore / relevantQuizzes.length;
  const maxScore = 100;
  let percentage = (averageScore / maxScore) * 100;
  
  // Determine mastery level
  let level: 'Not Started' | 'In Progress' | 'Competent' | 'Master';
  if (averageScore >= 85 && relevantQuizzes.length >= 3) {
    level = 'Master';
  } else if (averageScore >= 75 && relevantQuizzes.length >= 2) {
    level = 'Competent';
  } else if (averageScore >= 60 || relevantQuizzes.length > 0) {
    level = 'In Progress';
  } else {
    level = 'Not Started';
  }
  
  return { level, percentage: Math.min(percentage, 100) };
};

/**
 * Calculate overall accuracy based on quiz history
 */
export const calculateAccuracy = (quizResults: QuizResult[]): number => {
  if (quizResults.length === 0) return 0;
  
  const totalCorrect = quizResults.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
  const totalQuestions = quizResults.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  
  return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
};

/**
 * Calculate study streak - consecutive days with at least some study activity
 */
export const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  
  const sessionDates = sessions.map(s => s.date.toDateString());
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check if user has studied today or yesterday
  const referenceDate = sessionDates.includes(today) ? today : yesterday;
  
  if (!sessionDates.includes(referenceDate)) {
    return 0;
  }
  
  let streak = 0;
  let currentDate = new Date(referenceDate);
  
  while (sessionDates.includes(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

/**
 * Calculate learning velocity - concepts per week
 */
export const calculateVelocity = (
  sessions: StudySession[], 
  dateRange: number = 7
): number => {
  if (sessions.length === 0) return 0;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - dateRange);
  
  const recentSessions = sessions.filter(s => s.date >= cutoffDate);
  const totalConcepts = recentSessions.reduce((sum, s) => {
    return sum + (s.conceptsStudied ? s.conceptsStudied.length : 0);
  }, 0);
  
  return totalConcepts / (dateRange / 7); // Concepts per week
};

/**
 * Calculate improvement trend between first and second half of quiz history
 */
export const calculateImprovementTrend = (
  quizResults: QuizResult[],
  windowSize: number = 10
): { 
  trend: 'improving' | 'declining' | 'stable';
  percentageChange: number;
  recentAverage: number;
  overallAverage: number;
} => {
  if (quizResults.length < 2) {
    return { trend: 'stable', percentageChange: 0, recentAverage: 0, overallAverage: 0 };
  }
  
  const sortedResults = [...quizResults].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const recentResult = sortedResults.slice(0, Math.min(windowSize, quizResults.length));
  const previousResults = sortedResults.slice(windowSize);
  
  const recentAverage = recentResult.reduce((sum, quiz) => sum + quiz.score, 0) / recentResult.length;
  const previousAverage = previousResults.length > 0 
    ? previousResults.reduce((sum, quiz) => sum + quiz.score, 0) / previousResults.length
    : recentAverage;
  
  const overallAverage = quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / quizResults.length;
  const percentageChange = previousAverage > 0 
    ? ((recentAverage - previousAverage) / previousAverage) * 100 
    : 0;
  
  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(percentageChange) < 5) {
    trend = 'stable';
  } else if (percentageChange > 0) {
    trend = 'improving';
  } else {
    trend = 'declining';
  }
  
  return { trend, percentageChange, recentAverage, overallAverage };
};

/**
 * Identify weak concepts based on lowest quiz scores
 */
export const getWeakConcepts = (
  quizResults: QuizResult[],
  threshold: number = 60,
  limit: number = 5
): Array<{
  conceptId: string;
  name: string;
  averageScore: number;
  attempts: number;
  lastStudied: Date;
}> => {
  if (quizResults.length === 0) return [];
  
  const conceptScores: { [key: string]: { total: number; count: number; lastStudied: Date } } = {};
  
  quizResults.forEach(quiz => {
    quiz.questions.forEach(question => {
      if (!conceptScores[question.questionId]) {
        conceptScores[question.questionId] = {
          total: 0,
          count: 0,
          lastStudied: new Date(0)
        };
      }
      
      conceptScores[question.questionId].total += question.isCorrect ? 100 : 0;
      conceptScores[question.questionId].count += 1;
      conceptScores[question.questionId].lastStudied = new Date(quiz.date);
    });
  });
  
  const avgScores = Object.entries(conceptScores)
    .map(([conceptId, data]) => ({
      conceptId,
      name: `Concept ${conceptId}`, // In real app, would fetch actual concept name
      averageScore: data.total / data.count,
      attempts: data.count,
      lastStudied: data.lastStudied
    }))
    .filter(concept => concept.averageScore < threshold)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, limit);
  
  return avgScores;
};

/**
 * Estimate time to complete chapter/subject
 */
export const estimateCompletionTime = (
  concepts: ConceptProgress[],
  currentVelocity: number // concepts per day
): { 
  estimatedDays: number;
  completionDate: Date | null;
} => {
  if (concepts.length === 0 || currentVelocity <= 0) {
    return { estimatedDays: 0, completionDate: null };
  }
  
  const incompleteConcepts = concepts.filter(c => 
    c.masteryLevel !== 'Competent' && c.masteryLevel !== 'Master'
  );
  
  if (incompleteConcepts.length === 0) {
    return { estimatedDays: 0, completionDate: new Date() };
  }
  
  const estimatedDays = Math.ceil(incompleteConcepts.length / currentVelocity);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + estimatedDays);
  
  return { estimatedDays, completionDate };
};

/**
 * Calculate level based on XP
 */
export const calculateLevel = (xp: number, baseXP: number = 100): number => {
  return Math.floor(xp / baseXP) + 1;
};

/**
 * Get performance by difficulty level
 */
export const getPerformanceByDifficulty = (quizResults: QuizResult[]) => {
  const byDifficulty = {
    easy: { quizzes: [] as QuizResult[], average: 0 },
    medium: { quizzes: [] as QuizResult[], average: 0 },
    hard: { quizzes: [] as QuizResult[], average: 0 }
  };
  
  quizResults.forEach(quiz => {
    byDifficulty[quiz.difficulty].quizzes.push(quiz);
  });
  
  (Object.keys(byDifficulty) as Array<'easy' | 'medium' | 'hard'>).forEach(difficulty => {
    const quizzes = byDifficulty[difficulty].quizzes;
    if (quizzes.length > 0) {
      byDifficulty[difficulty].average = quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length;
    }
  });
  
  return byDifficulty;
};

/**
 * Calculate XP per session
 */
export const calculateXPPerSession = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  
  const totalXP = sessions.reduce((sum, session) => sum + session.xpEarned, 0);
  return totalXP / sessions.length;
};

/**
 * Generate trend data from study sessions and quiz results
 */
export const generateTrendData = (
  quizResults: QuizResult[],
  sessions: StudySession[],
  granularity: 'daily' | 'weekly' = 'daily'
): ProgressTrend[] => {
  const allData: ProgressTrend[] = [];
  const today = new Date();
  
  // Generate data points for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateString = date.toDateString();
    
    // Filter relevant data for this date
    const dayQuizzes = quizResults.filter(q => 
      new Date(q.date).toDateString() === dateString
    );
    
    const daySessions = sessions.filter(s => 
      s.date.toDateString() === dateString
    );
    
    // Aggregate metrics
    const totalCorrect = dayQuizzes.reduce((sum, q) => sum + q.correctAnswers, 0);
    const totalQuestions = dayQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    const studyTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
    const quizScore = dayQuizzes.length > 0 
      ? dayQuizzes.reduce((sum, q) => sum + q.score, 0) / dayQuizzes.length 
      : 0;
    
    const xp = daySessions.reduce((sum, s) => sum + s.xpEarned, 0);
    const conceptsCompleted = daySessions.reduce((sum, s) => {
      return sum + (s.conceptsStudied ? s.conceptsStudied.length : 0);
    }, 0);
    
    allData.push({
      date: dateString,
      accuracy,
      conceptsCompleted,
      studyTime,
      quizScore,
      xp,
      streak: i // Will be calculated separately
    });
  }
  
  return allData;
};