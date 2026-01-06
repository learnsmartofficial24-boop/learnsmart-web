'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResultsPage } from '@/components/Quiz/ResultsPage';
import { ReviewAnswer } from '@/components/Quiz/ReviewAnswer';
import { useQuizStore } from '@/store/quizStore';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  const classNum = Array.isArray(params.class) ? parseInt(params.class[0]) : parseInt(params.class as string);
  const subject = Array.isArray(params.subject) ? params.subject[0] : (params.subject as string);
  const chapter = Array.isArray(params.chapter) ? params.chapter[0] : (params.chapter as string);

  const { currentSession, quizHistory, clearQuiz } = useQuizStore();

  useEffect(() => {
    if (quizHistory.length > 0) {
      setIsLoading(false);
    } else if (!currentSession) {
      // No quiz results found, redirect to quiz selection
      router.push(`/practice/${classNum}/${subject}/${chapter}`);
    } else {
      setIsLoading(false);
    }
  }, [currentSession, quizHistory, classNum, subject, chapter, router]);

  const latestResult = quizHistory.length > 0 ? quizHistory[quizHistory.length - 1] : null;

  const handleRetakeQuiz = () => {
    clearQuiz();
    router.push(`/practice/${classNum}/${subject}/${chapter}`);
  };

  const handleReviewAnswers = () => {
    setShowReview(true);
  };

  const handleBackToLearning = () => {
    router.push(`/learn/${classNum}/${subject}/${chapter}`);
  };

  const handleCloseReview = () => {
    setShowReview(false);
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

  if (!latestResult) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Quiz Results Found</h2>
          <p className="text-gray-600 mb-6">Please complete a quiz to see your results.</p>
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

  return (
    <PageContainer>
      {showReview ? (
        <ReviewAnswer 
          questions={latestResult.questions}
          onClose={handleCloseReview}
        />
      ) : (
        <ResultsPage
          result={latestResult}
          onRetakeQuiz={handleRetakeQuiz}
          onReviewAnswers={handleReviewAnswers}
          onBackToLearning={handleBackToLearning}
        />
      )}
    </PageContainer>
  );
}