'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import {
  DEMO_PROFESSOR,
  DEMO_STUDENT_ALEX,
  DEMO_STUDENT_PRIYA,
  saveStoredData,
  enrollStudentInCourse,
} from '@/lib/storage';
import {
  X,
  Lock,
  Mail,
  User,
  CheckCircle2,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  Building,
} from 'lucide-react';

import { getSupabaseClient } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onSetUser: (user: UserProfile) => void;
  defaultRole?: 'STUDENT' | 'TEACHER';
  defaultTab?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSetUser,
  defaultRole = 'STUDENT',
  defaultTab = 'LOGIN',
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>(defaultTab);
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(defaultRole);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>(['cs201-os']);

  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectDemoUser = (demoUser: UserProfile) => {
    setValidationError('');
    onSetUser(demoUser);
    saveStoredData('USER_PROFILE', demoUser);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 500);
  };

  const handleCourseToggle = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      if (selectedCourses.length > 1) {
        setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
      }
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (tab === 'REGISTER') {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const client = getSupabaseClient();
      if (client) {
        if (tab === 'LOGIN') {
          const { data, error } = await client.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (error) {
            setValidationError(error.message);
            setIsSubmitting(false);
            return;
          }

          if (data.user) {
            const loggedInUser: UserProfile = {
              id: data.user.id,
              name: (data.user.user_metadata?.full_name as string) || email.split('@')[0],
              email: email.trim(),
              role: ((data.user.user_metadata?.role as string) || 'STUDENT') as 'STUDENT' | 'TEACHER',
              isDemoUser: false,
              institution: (data.user.user_metadata?.institution as string) || undefined,
            };
            onSetUser(loggedInUser);
            saveStoredData('USER_PROFILE', loggedInUser);
          }
        } else {
          // Register via Supabase
          const { data, error } = await client.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: fullName.trim(),
                role,
                institution: institution.trim() || undefined,
              },
            },
          });

          if (error) {
            setValidationError(error.message);
            setIsSubmitting(false);
            return;
          }

          if (data.user) {
            const newUser: UserProfile = {
              id: data.user.id,
              name: fullName.trim(),
              email: email.trim(),
              role,
              isDemoUser: false,
              institution: institution.trim() || undefined,
              enrolledCourseIds: role === 'STUDENT' ? selectedCourses : ['cs201-os', 'cs202-dbms', 'cs301-ml'],
            };
            if (role === 'STUDENT') {
              for (const cId of selectedCourses) {
                enrollStudentInCourse(newUser.id, cId);
              }
            }
            onSetUser(newUser);
            saveStoredData('USER_PROFILE', newUser);
          }
        }
      } else {
        // Resilient local authentication
        const userId = `usr-${Date.now()}`;
        const authenticatedUser: UserProfile = {
          id: userId,
          name: tab === 'REGISTER' ? fullName.trim() : email.split('@')[0],
          email: email.trim(),
          role,
          isDemoUser: false,
          institution: institution.trim() || undefined,
          enrolledCourseIds: role === 'STUDENT' ? selectedCourses : ['cs201-os', 'cs202-dbms', 'cs301-ml'],
        };

        if (role === 'STUDENT') {
          for (const cId of selectedCourses) {
            enrollStudentInCourse(userId, cId);
          }
        }

        onSetUser(authenticatedUser);
        saveStoredData('USER_PROFILE', authenticatedUser);
      }

      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 500);
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {tab === 'LOGIN' ? 'Welcome Back to GapFinder AI' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tab === 'LOGIN'
              ? 'Sign in to access your course workspaces and diagnostic gap reports.'
              : 'Register as a Student or Professor to begin diagnostic assessment.'}
          </p>
        </div>

        {/* 1-Click Fast-Track Demo Logins */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Evaluator 1-Click Demo Logins
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Pre-seeded</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemoUser(DEMO_PROFESSOR)}
              className="p-2 text-left rounded-lg border border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
            >
              <div className="text-[10px] font-bold text-purple-600">Professor</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Dr. Sarah</div>
              <div className="text-[10px] text-slate-500 truncate">3 Courses</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoUser(DEMO_STUDENT_ALEX)}
              className="p-2 text-left rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            >
              <div className="text-[10px] font-bold text-emerald-600">Student 1</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Alex Chen</div>
              <div className="text-[10px] text-slate-500 truncate">OS + DBMS</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoUser(DEMO_STUDENT_PRIYA)}
              className="p-2 text-left rounded-lg border border-teal-200 dark:border-teal-900/50 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
            >
              <div className="text-[10px] font-bold text-teal-600">Student 2</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Priya Sharma</div>
              <div className="text-[10px] text-slate-500 truncate">OS + ML</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('LOGIN');
              setValidationError('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition ${
              tab === 'LOGIN'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('REGISTER');
              setValidationError('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition ${
              tab === 'REGISTER'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Success Feedback */}
        {authSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Authenticated successfully! Redirecting...</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'REGISTER' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      role === 'STUDENT'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('TEACHER')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                      role === 'TEACHER'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Professor</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'STUDENT' ? 'e.g. Alex Chen' : 'e.g. Dr. Sarah Williams'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Optional Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. University School of Computing"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Optional Course Selection for Students */}
              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Course Enrollment
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'cs201-os', label: 'CS201: Operating Systems & Concurrency' },
                      { id: 'cs202-dbms', label: 'CS202: Database Management Systems' },
                      { id: 'cs301-ml', label: 'CS301: Machine Learning Foundations' },
                    ].map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(c.id)}
                          onChange={() => handleCourseToggle(c.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {tab === 'REGISTER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : tab === 'LOGIN' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
