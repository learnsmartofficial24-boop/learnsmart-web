'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { FormInput } from '@/components/ui/FormInput';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { ClassSelector } from '@/components/ui/ClassSelector';
import { StreamSelector } from '@/components/Auth/StreamSelector';
import { SpecializationSelector } from '@/components/Auth/SpecializationSelector';
import { SubjectSelector } from '@/components/Auth/SubjectSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { getSubjectsByStreamAndSpec } from '@/lib/curriculum';
import { generateId, validateEmail } from '@/lib/utils';
import { validatePassword, validatePasswordMatch, validateName } from '@/lib/validation';
import { useToastStore } from '@/store/toastStore';
import type { User } from '@/lib/types';

interface SignupWizardProps {
  onComplete: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  class: number | null;
  stream: 'science' | 'commerce' | 'arts' | null;
  specialization: 'pcm' | 'pcb' | null;
  subjects: string[];
}

export function SignupWizard({ onComplete }: SignupWizardProps) {
  const router = useRouter();
  const { setUser, selectClass, selectStream, selectSpecialization, selectSubjects } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: null,
    stream: null,
    specialization: null,
    subjects: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stepLabels = [
    'Create Account',
    'Select Class',
    'Choose Stream',
    'Personalize Subjects',
  ];

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    const nameResult = validateName(formData.name);
    if (!nameResult.isValid) {
      newErrors.name = nameResult.errors[0];
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.errors[0];
    }
    
    // Validate confirm password
    const matchResult = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!matchResult.isValid) {
      newErrors.confirmPassword = matchResult.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (!formData.class) {
      setErrors({ ...errors, class: 'Please select a class' });
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    // Only required for class 11-12
    if (formData.class && formData.class >= 11 && formData.class <= 12) {
      if (!formData.stream) {
        setErrors({ ...errors, stream: 'Please select a stream' });
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }
    
    if (isValid) {
      // Save progress to store as user goes through steps
      if (currentStep === 1) {
        // Don't save user yet, wait until complete
      } else if (currentStep === 2 && formData.class) {
        selectClass(formData.class);
      } else if (currentStep === 3 && formData.stream) {
        selectStream(formData.stream);
        if (formData.specialization) {
          selectSpecialization(formData.specialization);
        }
      }
      
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
    setErrors({});
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Save all user data to store
    const user: Partial<User> = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      class: formData.class || 1,
      subjects: formData.subjects,
      theme: 'light',
      createdAt: new Date(),
    };
    
    if (formData.stream) {
      user.stream = formData.stream;
    }
    
    if (formData.specialization) {
      user.specialization = formData.specialization;
    }
    
    // Set user in store (this will also persist to localStorage)
    setUser(user as User);
    
    // Also update subjects if any were selected
    if (formData.subjects.length > 0) {
      selectSubjects(formData.subjects);
    }
    
    setIsLoading(false);
    onComplete();
  };

  const handleClassSelect = (classNum: number) => {
    setFormData({ ...formData, class: classNum });
    selectClass(classNum);
    setErrors({ ...errors, class: '' });
  };

  const handleStreamSelect = (stream: 'science' | 'commerce' | 'arts') => {
    setFormData({ ...formData, stream, subjects: [] });
    selectStream(stream);
    setErrors({ ...errors, stream: '' });
  };

  const handleSpecializationSelect = (specialization: 'pcm' | 'pcb') => {
    setFormData({ ...formData, specialization, subjects: [] });
    selectSpecialization(specialization);
  };

  const handleSubjectToggle = (subject: string) => {
    const newSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter((s) => s !== subject)
      : [...formData.subjects, subject];
    
    setFormData({ ...formData, subjects: newSubjects });
  };

  // Get subjects for current stream/specialization
  const { core, optional } = formData.stream
    ? getSubjectsByStreamAndSpec(formData.stream, formData.specialization || undefined)
    : { core: [], optional: [] };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                Create Your Account
              </h3>
              <p className="text-[var(--foreground)] opacity-70">
                Enter your information to get started
              </p>
            </div>

            <FormInput
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              placeholder="Create a strong password"
              required
              showToggle
              autoComplete="new-password"
            />

            {formData.password && (
              <PasswordStrengthMeter password={formData.password} />
            )}

            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
              showToggle
              autoComplete="new-password"
            />

            <Button
              type="button"
              onClick={handleNext}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Next Step
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <ClassSelector
              selected={formData.class}
              onSelect={handleClassSelect}
            />
            
            {errors.class && (
              <div className="text-center text-[var(--danger)] text-sm">
                {errors.class}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                variant="primary"
                className="flex-1"
                disabled={!formData.class}
              >
                Next Step
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        // Skip stream selection for classes below 11
        if (formData.class && formData.class < 11) {
          setCurrentStep(4);
          return null;
        }

        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <StreamSelector
              selected={formData.stream}
              onSelect={handleStreamSelect}
            />
            
            {errors.stream && (
              <div className="text-center text-[var(--danger)] text-sm">
                {errors.stream}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                variant="primary"
                className="flex-1"
                disabled={!formData.stream}
              >
                Next Step
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Show specialization selector for science stream */}
            {formData.stream === 'science' && (
              <div className="mb-6">
                <SpecializationSelector
                  selected={formData.specialization}
                  onSelect={handleSpecializationSelect}
                />
              </div>
            )}

            {/* Show subject selector if we have subjects to display */}
            {(core.length > 0 || optional.length > 0) && (
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    Your Subjects
                  </h3>
                  <p className="text-[var(--foreground)] opacity-70">
                    Core subjects are pre-selected. Choose optional subjects to personalize your learning path.
                  </p>
                </div>
                
                <SubjectSelector
                  coreSubjects={core}
                  optionalSubjects={optional}
                  selectedSubjects={formData.subjects}
                  onToggle={handleSubjectToggle}
                />
              </div>
            )}

            {formData.class && formData.class < 11 && (
              <div className="text-center mb-4">
                <div className="p-4 bg-[var(--card-hover)] rounded-[var(--radius-md)]">
                  <p className="text-[var(--foreground)] opacity-70">
                    You're all set! Students in Class {formData.class} will have a personalized curriculum designed for your grade level.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleComplete}
                variant="primary"
                className="flex-1"
                isLoading={isLoading}
              >
                Complete Signup
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator
        current={currentStep}
        total={4}
        labels={stepLabels}
      />
      
      <Card padding="lg" className="mt-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </Card>
    </div>
  );
}