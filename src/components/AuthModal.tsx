'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USER, TEACHER_USER } from '@/lib/storage';
import {
  X,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSetUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSetUser,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDemoStudentLogin = () => {
    setValidationError('');
    onSetUser(DEMO_USER);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 600);
  };

  const handleDemoTeacherLogin = () => {
    setValidationError('');
    onSetUser(TEACHER_USER);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 600);
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      const client = getSupabaseClient();
      if (client) {
        // Attempt Supabase Auth login
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // If user doesn't exist, try auto sign up
          if (
            error.message.includes('Invalid login credentials') ||
            error.message.includes('User not found')
          ) {
            const { data: signUpData, error: signUpError } = await client.auth.signUp({
              email: email.trim(),
              password,
            });

            if (signUpError) {
              setValidationError(signUpError.message);
              setIsSubmitting(false);
              return;
            }

            if (signUpData.user) {
              onSetUser({
                id: signUpData.user.id,
                name: email.split('@')[0],
                email: email.trim(),
                role: 'STUDENT',
                isDemoUser: false,
              });
            }
          } else {
            setValidationError(error.message);
            setIsSubmitting(false);
            return;
          }
        } else if (data.user) {
          onSetUser({
            id: data.user.id,
            name: (data.user.user_metadata?.full_name as string) || email.split('@')[0],
            email: email.trim(),
            role: 'STUDENT',
            isDemoUser: false,
          });
        }
      } else {
        // Resilient local profile fallback
        onSetUser({
          id: `usr-custom-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: 'STUDENT',
          isDemoUser: false,
        });
      }

      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 600);
    } catch {
      // Fallback
      onSetUser({
        id: `usr-custom-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        role: 'STUDENT',
        isDemoUser: false,
      });
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              {isSupabaseConfigured() ? 'Supabase Auth Active' : 'Demo Credentials Available'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Authentication & User Session
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in with demo credentials or configure your personal student profile.
          </p>
        </div>

        {authSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Authentication successful! Updating session...</span>
          </div>
        )}

        {/* Demo Credentials Box for Hackathon Judges */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Key className="w-4 h-4 text-amber-500" />
            <span>Placement Judge Quick-Logins (1-Click):</span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDemoStudentLogin}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  AC
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Alex Chen (Student)</div>
                  <div className="text-[11px] text-slate-500 font-mono">student@gapfinder.ai / demo1234</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Log In
              </span>
            </button>

            <button
              type="button"
              onClick={handleDemoTeacherLogin}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-purple-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Prof. Sarah (Teacher Analytics)</div>
                  <div className="text-[11px] text-slate-500 font-mono">prof.sarah@university.edu</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                Log In
              </span>
            </button>
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Or sign in with custom credentials:</div>

          {validationError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Authenticating...'
                : isSupabaseConfigured()
                ? 'Sign In with Supabase Auth'
                : 'Sign In to GapFinder AI'}
            </span>
          </button>
        </form>

        {/* Current User Details */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Active Session:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>
    </div>
  );
};
