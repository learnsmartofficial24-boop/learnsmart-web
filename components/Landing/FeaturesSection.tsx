'use client';

import { BookOpen, Sparkles, Zap, Flame } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Concept-Based Learning',
      description: 'Structured, bite-sized lessons. No videos. Just clarity.',
    },
    {
      icon: Sparkles,
      title: 'AI Study Companion',
      description: 'Ask questions, get guidance. Like having a supportive older sibling.',
    },
    {
      icon: Zap,
      title: 'Infinite Practice Tests',
      description: 'AI-generated MCQs tailored to your curriculum. Never run out of practice.',
    },
    {
      icon: Flame,
      title: 'Build Your Streak',
      description: 'Stay consistent. Earn XP. Level up as you learn.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto">
            Powerful tools designed to help you master your subjects with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
