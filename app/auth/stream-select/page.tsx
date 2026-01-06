'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StreamSelector } from '@/components/Auth/StreamSelector';
import { SpecializationSelector } from '@/components/Auth/SpecializationSelector';
import { SubjectSelector } from '@/components/Auth/SubjectSelector';
import { useAuthStore } from '@/store/authStore';
import { getSubjectsByStreamAndSpec } from '@/lib/curriculum';

export default function StreamSelectPage() {
  const router = useRouter();
  const { user, selectStream, selectSpecialization, selectSubjects } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [selectedStream, setSelectedStream] = useState<'science' | 'commerce' | 'arts' | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<'pcm' | 'pcb' | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  const handleStreamSelect = (stream: 'science' | 'commerce' | 'arts') => {
    setSelectedStream(stream);
    selectStream(stream);
    
    if (stream === 'science') {
      setStep(2);
    } else {
      const { core, optional } = getSubjectsByStreamAndSpec(stream);
      setSubjects([...core]);
      setStep(3);
    }
  };

  const handleSpecSelect = (spec: 'pcm' | 'pcb') => {
    setSelectedSpec(spec);
    selectSpecialization(spec);
    
    if (selectedStream) {
      const { core, optional } = getSubjectsByStreamAndSpec(selectedStream, spec);
      setSubjects([...core]);
      setStep(3);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleComplete = () => {
    selectSubjects(subjects);
    router.push('/dashboard');
  };

  const { core, optional } = selectedStream
    ? getSubjectsByStreamAndSpec(selectedStream, selectedSpec || undefined)
    : { core: [], optional: [] };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card padding="lg">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[var(--primary)]">
              Complete Your Profile
            </h1>
            <span className="text-sm text-[var(--foreground)] opacity-70">
              Step {step} of 3
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <StreamSelector
            selected={selectedStream}
            onSelect={handleStreamSelect}
          />
        )}

        {step === 2 && selectedStream === 'science' && (
          <>
            <SpecializationSelector
              selected={selectedSpec}
              onSelect={handleSpecSelect}
            />
            <div className="mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(1);
                  setSelectedSpec(null);
                }}
              >
                Back
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SubjectSelector
              coreSubjects={core}
              optionalSubjects={optional}
              selectedSubjects={subjects}
              onToggle={handleSubjectToggle}
            />
            <div className="mt-6 flex gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  if (selectedStream === 'science') {
                    setStep(2);
                  } else {
                    setStep(1);
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleComplete}
                className="flex-1"
                disabled={subjects.length === 0}
              >
                Complete Setup
              </Button>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
