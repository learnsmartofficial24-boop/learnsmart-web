import type { ValidationError } from '@/lib/types';

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  error: string;
} => {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }
  
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }
  
  return {
    isValid: true,
    error: '',
  };
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'fair' | 'medium' | 'good' | 'strong';
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
} => {
  let score = 0;
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  
  // Calculate score based on requirements met
  Object.values(requirements).forEach((met) => {
    if (met) score++;
  });
  
  // Extra points for length
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Extra points for complexity (multiple types)
  const types = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ].filter(Boolean).length;
  
  if (types >= 3) score += 1;
  if (types === 4) score += 1;
  
  // Determine strength label
  let strength: 'weak' | 'fair' | 'medium' | 'good' | 'strong';
  if (score <= 1) strength = 'weak';
  else if (score <= 3) strength = 'fair';
  else if (score <= 5) strength = 'medium';
  else if (score <= 7) strength = 'good';
  else strength = 'strong';
  
  return {
    strength,
    score,
    requirements,
  };
};

export const validateFormField = (
  fieldName: string,
  value: string,
  type: 'email' | 'password' | 'name' | 'confirmPassword' | 'text',
  options?: {
    compareValue?: string;
  }
): ValidationError | null => {
  let isValid = true;
  let message = '';
  
  switch (type) {
    case 'email':
      isValid = validateEmail(value);
      message = isValid ? '' : 'Please enter a valid email address';
      break;
      
    case 'password':
      const passwordResult = validatePassword(value);
      isValid = passwordResult.isValid;
      message = passwordResult.errors[0] || '';
      break;
      
    case 'name':
      const nameResult = validateName(value);
      isValid = nameResult.isValid;
      message = nameResult.errors[0] || '';
      break;
      
    case 'confirmPassword':
      if (options?.compareValue) {
        const matchResult = validatePasswordMatch(options.compareValue, value);
        isValid = matchResult.isValid;
        message = matchResult.error;
      }
      break;
      
    case 'text':
      isValid = value.trim().length > 0;
      message = isValid ? '' : 'This field is required';
      break;
  }
  
  return isValid ? null : { field: fieldName, message };
};

export const validateClassSelection = (classNum: number): boolean => {
  return classNum >= 1 && classNum <= 13;
};

export const validateStreamSelection = (
  stream: string
): stream is 'science' | 'commerce' | 'arts' => {
  return ['science', 'commerce', 'arts'].includes(stream);
};

export const validateSpecialization = (
  specialization: string
): specialization is 'pcm' | 'pcb' => {
  return ['pcm', 'pcb'].includes(specialization);
};

export const validateSubjectSelection = (
  subjects: string[],
  minRequired: number = 1
): {
  isValid: boolean;
  error: string | null;
} => {
  if (subjects.length < minRequired) {
    return {
      isValid: false,
      error: `Please select at least ${minRequired} subject${minRequired === 1 ? '' : 's'}`,
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
};