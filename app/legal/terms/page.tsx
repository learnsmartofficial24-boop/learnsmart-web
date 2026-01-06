'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-8 border border-[var(--border)]">
            <p className="text-[var(--foreground)]/70 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Agreement to Terms</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              By accessing and using LearnSmart, you agree to be bound by these Terms and Conditions 
              and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Use License</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on LearnSmart for personal, 
              non-commercial educational use only.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">User Responsibilities</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account and password, 
              and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-4">Contact Us</h2>
            <p className="text-[var(--foreground)]/70 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
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
