'use client';

import React from 'react';
import { QuizLauncher } from '@/components/Quiz/QuizLauncher';
import { PageContainer } from '@/components/Layout/PageContainer';
import { useParams } from 'next/navigation';

export default function QuizSelectionPage() {
  const params = useParams();
  
  const classNum = Array.isArray(params.class) ? parseInt(params.class[0]) : parseInt(params.class as string);
  const subject = Array.isArray(params.subject) ? params.subject[0] : (params.subject as string);
  const chapter = Array.isArray(params.chapter) ? params.chapter[0] : (params.chapter as string);

  return (
    <PageContainer>
      <QuizLauncher 
        classNum={classNum}
        subject={subject}
        chapter={chapter}
      />
    </PageContainer>
  );
}