'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Camera, User, Link, Bell, Shield, Palette } from 'lucide-react';
import { UserProfile } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { cn } from '../../lib/utils';

interface EditProfileProps {
  profile: UserProfile;
  onSave: (profileData: Partial<UserProfile>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  profile,
  onSave,
  onCancel,
  isLoading = false,
  className
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio || '',
    avatar: profile.avatar || '',
    subjects: profile.subjects,
    favoriteSubject: profile.favoriteSubject || '',
    privacy: {
      showProfile: profile.privacy.showProfile,
      showProgress: profile.privacy.showProgress,
      showAchievements: profile.privacy.showAchievements,
      showStats: profile.privacy.showStats
    },
    theme: profile.theme,
    socialLinks: {
      twitter: profile.socialLinks?.twitter || '',
      linkedin: profile.socialLinks?.linkedin || '',
      website: profile.socialLinks?.website || ''
    }
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'privacy' | 'appearance' | 'social'>('basic');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.bio.length > 200) {
      newErrors.bio = 'Bio must be less than 200 characters';
    }

    if (formData.socialLinks.website && !isValidUrl(formData.socialLinks.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'social', label: 'Social Links', icon: Link }
  ];

  return (
    <div className={cn("bg-[var(--card)] border border-[var(--border)] rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Edit Profile</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-2xl">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Avatar URL
                  </label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className={errors.avatar ? 'border-red-500' : ''}
                  />
                  {errors.avatar && (
                    <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={3}
                  maxLength={200}
                  className={errors.bio ? 'border-red-500' : ''}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio}</p>
                  )}
                  <span className="text-[var(--muted-foreground)] text-sm ml-auto">
                    {formData.bio.length}/200
                  </span>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Subjects
                </label>
                <Input
                  value={formData.subjects.join(', ')}
                  onChange={(e) => handleInputChange('subjects', e.target.value.split(', ').filter(Boolean))}
                  placeholder="Mathematics, Physics, Chemistry"
                />
                <p className="text-[var(--muted-foreground)] text-sm mt-1">
                  Separate multiple subjects with commas
                </p>
              </div>

              {/* Favorite Subject */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Favorite Subject
                </label>
                <Input
                  value={formData.favoriteSubject}
                  onChange={(e) => handleInputChange('favoriteSubject', e.target.value)}
                  placeholder="e.g., Physics"
                />
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Privacy Settings</h3>
              </div>
              
              <p className="text-[var(--muted-foreground)] text-sm">
                Control what information is visible to other users
              </p>

              <div className="space-y-4">
                {[
                  {
                    key: 'showProfile',
                    label: 'Show Profile',
                    description: 'Allow others to view your profile'
                  },
                  {
                    key: 'showProgress',
                    label: 'Show Learning Progress',
                    description: 'Display your learning statistics and progress'
                  },
                  {
                    key: 'showAchievements',
                    label: 'Show Achievements',
                    description: 'Make your achievements visible to others'
                  },
                  {
                    key: 'showStats',
                    label: 'Show Detailed Stats',
                    description: 'Allow viewing of detailed learning statistics'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-start space-x-3 p-4 border border-[var(--border)] rounded-lg">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={formData.privacy[item.key as keyof typeof formData.privacy]}
                      onChange={(e) => handlePrivacyChange(item.key, e.target.checked)}
                      className="mt-1 w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                    />
                    <div className="flex-1">
                      <label htmlFor={item.key} className="font-medium text-[var(--foreground)]">
                        {item.label}
                      </label>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Appearance</h3>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                  Theme Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'light', label: 'Light', description: 'Clean and bright' },
                    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' }
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => handleInputChange('theme', theme.value)}
                      className={cn(
                        "p-4 border-2 rounded-lg text-left transition-all",
                        formData.theme === theme.value
                          ? "border-[var(--primary)] bg-[var(--primary)]/10"
                          : "border-[var(--border)] hover:border-[var(--primary)]/50"
                      )}
                    >
                      <div className="font-medium text-[var(--foreground)]">{theme.label}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">{theme.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Link className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Social Links</h3>
              </div>

              <p className="text-[var(--muted-foreground)] text-sm">
                Add links to your social media profiles or personal website
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Twitter/X
                  </label>
                  <Input
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    LinkedIn
                  </label>
                  <Input
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Website
                  </label>
                  <Input
                    value={formData.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={errors.website ? 'border-red-500' : ''}
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};