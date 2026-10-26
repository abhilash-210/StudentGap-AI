'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USER, TEACHER_USER } from '@/lib/storage';
import {
  User,
  X,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Key,
} from 'lucide-react';

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
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDemoStudentLogin = () => {
    onSetUser(DEMO_USER);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 800);
  };

  const handleDemoTeacherLogin = () => {
    onSetUser(TEACHER_USER);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 800);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    onSetUser({
      id: `usr-custom-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'STUDENT',
      isDemoUser: false,
    });
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Demo Credentials Available
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Authentication & User Session
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with demo credentials or customize your personal student profile.
          </p>
        </div>

        {/* Demo Credentials Box for Hackathon Judges */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-900/50 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Placement Judge Quick-Logins (1-Click):</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDemoStudentLogin}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-indigo-600/80 text-white flex items-center justify-center font-bold text-xs">
                  AC
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Alex Chen (Student)</div>
                  <div className="text-[11px] text-slate-400 font-mono">student@gapfinder.ai / demo1234</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                Log In
              </span>
            </button>

            <button
              onClick={handleDemoTeacherLogin}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-purple-600/80 text-white flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Prof. Sarah (Teacher Analytics)</div>
                  <div className="text-[11px] text-slate-400 font-mono">prof.sarah@university.edu</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                Log In
              </span>
            </button>
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Or sign in with custom credentials:</div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="your.name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to GapFinder AI</span>
          </button>
        </form>

        {/* Current User Details */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Active Session:</span>
          <span className="font-semibold text-white">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>
    </div>
  );
};
