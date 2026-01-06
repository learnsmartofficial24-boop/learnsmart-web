'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-8 border border-[var(--border)]">
            <p className="text-[var(--foreground)]/70 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Introduction</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              At LearnSmart, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your personal information when you use our learning platform.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Information We Collect</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              We collect information you provide directly to us, including your name, email address, 
              class information, and learning progress data.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">How We Use Your Information</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              Your information is used to provide and improve our educational services, personalize 
              your learning experience, and communicate with you about your progress.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Contact Us</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed">
              If you have any questions about our Privacy Policy, please contact us at{' '}
              <a 
                href="mailto:learnsmartofficial24@gmail.com"
                className="text-[var(--primary)] hover:underline"
              >
                learnsmartofficial24@gmail.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
