'use client';

import { GraduationCap, BookOpen, MessageCircle, Target } from 'lucide-react';
import { TimelineStep } from './TimelineStep';

export function HowItWorksSection() {
  const steps = [
    {
      icon: GraduationCap,
      title: 'Choose Your Class',
      description: 'Select your class and stream. Personalized to your curriculum.',
    },
    {
      icon: BookOpen,
      title: 'Read Concepts',
      description: 'Read structured concept cards. No fluff, just clarity.',
    },
    {
      icon: MessageCircle,
      title: 'Ask Smarty (AI)',
      description: 'Ask Smarty questions. Get personalized guidance anytime.',
    },
    {
      icon: Target,
      title: 'Practice Daily',
      description: 'Take unlimited practice tests. Track your progress in real time.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[var(--card)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto">
            A simple 4-step process to transform your learning experience
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <TimelineStep
              key={step.title}
              icon={step.icon}
              step={index + 1}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
