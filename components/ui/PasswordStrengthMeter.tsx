'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { getPasswordStrength } from '@/lib/validation';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthMeter({ password, showRequirements = true }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { strength, requirements } = getPasswordStrength(password);

  const strengthConfig = {
    weak: {
      label: 'Weak',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      width: 'w-1/4',
    },
    fair: {
      label: 'Fair',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      width: 'w-1/2',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      width: 'w-2/3',
    },
    good: {
      label: 'Good',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      width: 'w-5/6',
    },
    strong: {
      label: 'Strong',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      width: 'w-full',
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${config.color} transition-all duration-300`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          />
        </div>
        <span className={`ml-2 text-xs font-medium ${config.textColor}`}>
          {config.label}
        </span>
      </div>

      {showRequirements && (
        <div className="space-y-1 mt-2">
          <Requirement met={requirements.length} text="At least 8 characters" />
          <Requirement met={requirements.uppercase} text="One uppercase letter" />
          <Requirement met={requirements.lowercase} text="One lowercase letter" />
          <Requirement met={requirements.number} text="One number" />
          <Requirement met={requirements.special} text="One special character (!@#$%^&*)" />
        </div>
      )}
    </div>
  );
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? (
        <CheckCircle size={12} className="text-green-600" />
      ) : (
        <XCircle size={12} className="text-gray-400" />
      )}
      <span>{text}</span>
    </div>
  );
}
