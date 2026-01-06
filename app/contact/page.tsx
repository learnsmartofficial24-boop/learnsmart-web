'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6 text-center">
          Contact Us
        </h1>
        
        <p className="text-lg text-[var(--foreground)]/70 text-center mb-12 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>

        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-8 border border-[var(--border)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)]/10 rounded-full mb-6">
            <Mail className="w-8 h-8 text-[var(--primary)]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Email Us</h2>
          
          <p className="text-[var(--foreground)]/70 mb-6">
            Send us an email and we'll get back to you as soon as possible.
          </p>
          
          <a
            href="mailto:learnsmartofficial24@gmail.com"
            className="inline-block text-xl font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            learnsmartofficial24@gmail.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}
