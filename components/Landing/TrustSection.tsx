'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function TrustSection() {
  const badges = [
    'NCERT-Aligned Curriculum',
    'Designed for Long Study Sessions',
    'Ad-Free Learning Experience',
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--background)] to-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Built for Indian Students
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto">
            Every feature is designed with your success in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {badges.map((badge, index) => (
            <motion.div
              key={badge}
              className="flex items-center gap-4 p-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-subtle)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-8 h-8 text-[var(--primary)] flex-shrink-0" />
              <p className="font-semibold text-[var(--foreground)]">{badge}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
