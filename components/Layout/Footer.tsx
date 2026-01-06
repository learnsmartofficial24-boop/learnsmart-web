'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-[var(--foreground)] text-[var(--background)] border-t-2 border-[var(--primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-3"
              whileHover={{ scale: 1.05 }}
            >
              LearnSmart
            </motion.div>
            <p className="text-sm opacity-80 leading-relaxed">
              Concept-based learning powered by AI. Master your subjects with clarity and focus.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-[var(--background)]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-[var(--background)]">Contact</h4>
            <div className="text-sm space-y-2">
              <p className="opacity-80">
                Email:{' '}
                <a
                  href="mailto:learnsmartofficial24@gmail.com"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  learnsmartofficial24@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--background)]/20 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} LearnSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
