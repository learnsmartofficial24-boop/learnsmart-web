'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/Quiz/QuestionCard';
import { QuizProgressBar } from '@/components/Quiz/QuizProgressBar';
import { useQuizStore } from '@/store/quizStore';
import { getQuizQuestions } from '@/lib/quizData';
import { Spinner } from '@/components/ui/Spinner';
import { PageContainer } from '@/components/Layout/PageContainer';

export default function ActiveQuizPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const classNum = Array.isArray(params.class) ? parseInt(params.class[0]) : parseInt(params.class as string);
  const subject = Array.isArray(params.subject) ? params.subject[0] : (params.subject as string);
  const chapter = Array.isArray(params.chapter) ? params.chapter[0] : (params.chapter as string);
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : (params.quizId as string);

  const { currentSession, startQuiz, submitAnswer, nextQuestion, previousQuestion, completeQuiz } = useQuizStore();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate difficulty
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(quizId)) {
          throw new Error('Invalid quiz difficulty');
        }

        // Load questions
        const questions = await getQuizQuestions(
          classNum,
          subject,
          chapter,
          quizId as 'easy' | 'medium' | 'hard',
          5 // Default to 5 questions
        );

        // Start quiz
        startQuiz(classNum, subject, chapter, quizId as 'easy' | 'medium' | 'hard', questions);

      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    // Only load if we don't have an active session
    if (!currentSession) {
      loadQuiz();
    } else {
      setIsLoading(false);
    }

  }, [classNum, subject, chapter, quizId, currentSession, startQuiz]);

  const handleAnswerSubmit = (answerIndex: number) => {
    if (!currentSession) return;
    
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    submitAnswer(currentQuestion.id, answerIndex);
  };

  const handleNext = () => {
    if (!currentSession) return;
    
    const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;
    
    if (isLastQuestion) {
      // Complete the quiz
      const result = completeQuiz();
      router.push(`/practice/${classNum}/${subject}/${chapter}/results`);
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </PageContainer>
    );
  }

  if (!currentSession) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Active Quiz</h2>
          <p className="text-gray-600 mb-6">Please start a new quiz.</p>
          <button
            onClick={() => router.push(`/practice/${classNum}/${subject}/${chapter}`)}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </PageContainer>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const answeredQuestions = currentSession.questions.filter(q => q.isAnswered);
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect === true).length;
  const incorrectAnswers = answeredQuestions.filter(q => q.isCorrect === false).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        <QuizProgressBar
          currentQuestion={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          timeSpent={Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 1000)}
          difficulty={currentSession.difficulty}
        />

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
          onAnswerSubmit={handleAnswerSubmit}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastQuestion={currentSession.currentQuestionIndex === currentSession.questions.length - 1}
          isFirstQuestion={currentSession.currentQuestionIndex === 0}
        />
      </div>
    </PageContainer>
  );
}