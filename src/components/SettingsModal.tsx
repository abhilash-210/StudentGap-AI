'use client';

import React, { useState } from 'react';
import {
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Database,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
  isSupabaseConfigured,
} from '@/lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'AI_MODEL' | 'DATABASE'>('AI_MODEL');

  // Gemini state
  const [apiKey, setApiKey] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('gapfinder_gemini_api_key') || '' : ''
  );
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseCredentials().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseCredentials().anonKey);
  const [showDbKey, setShowDbKey] = useState(false);
  const [dbTestStatus, setDbTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [dbStatusMessage, setDbStatusMessage] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      if (apiKey.trim()) {
        localStorage.setItem('gapfinder_gemini_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('gapfinder_gemini_api_key');
      }
      saveSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleClearKey = () => {
    setApiKey('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gapfinder_gemini_api_key');
    }
    setTestStatus('IDLE');
    setStatusMessage('API Key removed. System reverted to local heuristic RAG engine.');
  };

  const handleClearDbCredentials = () => {
    setSupabaseUrl('');
    setSupabaseKey('');
    saveSupabaseCredentials('', '');
    setDbTestStatus('IDLE');
    setDbStatusMessage('Supabase credentials cleared. System reverted to local resilient storage.');
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus('ERROR');
      setStatusMessage('Please enter an API key before testing.');
      return;
    }
    setTestStatus('TESTING');
    setStatusMessage('Connecting to Gemini API endpoint...');

    try {
      const res = await fetch('/api/explain-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Test connection',
          apiKey: apiKey.trim(),
        }),
      });

      if (res.ok) {
        setTestStatus('SUCCESS');
        setStatusMessage('Connection verified! Google Gemini API is active.');
      } else {
        const data = await res.json().catch(() => ({}));
        setTestStatus('ERROR');
        setStatusMessage(data.error || 'API key validation failed. Please check the key in Google AI Studio.');
      }
    } catch {
      setTestStatus('ERROR');
      setStatusMessage('Network request failed. Local resilient RAG will continue to function seamlessly.');
    }
  };

  const handleTestDatabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setDbTestStatus('ERROR');
      setDbStatusMessage('Please enter both Supabase URL and Anon Key before testing.');
      return;
    }

    setDbTestStatus('TESTING');
    setDbStatusMessage('Pinging Supabase PostgreSQL endpoint...');

    // Save temporarily to test
    saveSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    const result = await testSupabaseConnection();

    if (result.success) {
      setDbTestStatus('SUCCESS');
      setDbStatusMessage(result.message);
    } else {
      setDbTestStatus('ERROR');
      setDbStatusMessage(result.message);
    }
  };

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const hasDbConfig = isSupabaseConfigured() || (Boolean(supabaseUrl) && Boolean(supabaseKey));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            System & Infrastructure Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure the AI layer, PostgreSQL database, and pgvector store.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('AI_MODEL')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'AI_MODEL'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Layer (Gemini)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DATABASE')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'DATABASE'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL & pgvector (Supabase)</span>
          </button>
        </div>

        {/* TAB 1: AI MODEL */}
        {activeTab === 'AI_MODEL' && (
          <div className="space-y-4">
            {/* Dual Mode Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dual-Mode AI Architecture (Zero-Setup Resilient):</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Gemini Cloud Mode:</strong> When you provide a Gemini API Key, queries use Google&apos;s multimodal LLM with retrieved context injections.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Offline / Local RAG Fallback:</strong> If no API key is set, GapFinder AI uses its built-in BM25 TF-IDF vector retrieval and heuristic diagnosis engine.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Google Gemini API Key (Optional)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get free key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-9 pr-20 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="p-1 text-rose-500 hover:text-rose-600"
                        title="Remove stored key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Gemini Generation Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Fastest response)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep diagnostic reasoning)</option>
                  <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Next-gen experimental)</option>
                </select>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    testStatus === 'SUCCESS'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : testStatus === 'ERROR'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'
                  }`}
                >
                  {testStatus === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testStatus === 'TESTING' || !apiKey.trim()}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition"
                >
                  {testStatus === 'TESTING' ? 'Testing...' : 'Test Gemini Connection'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE & PGVECTOR */}
        {activeTab === 'DATABASE' && (
          <div className="space-y-4">
            {/* Database Status Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>PostgreSQL & pgvector Integration:</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    hasDbConfig
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {hasDbConfig ? 'Supabase Configured' : 'Local Fallback Storage Active'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                GapFinder AI integrates with <strong>PostgreSQL</strong> and <strong>Supabase Vector (pgvector)</strong> to persist student courses, diagnostic reports, and chunk embeddings.
              </p>
            </div>

            {/* Credentials Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Supabase Project URL (NEXT_PUBLIC_SUPABASE_URL)
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Supabase Anon API Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
                  </label>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showDbKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full pl-3 pr-20 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowDbKey(!showDbKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showDbKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {supabaseKey && (
                      <button
                        type="button"
                        onClick={handleClearDbCredentials}
                        className="p-1 text-rose-500 hover:text-rose-600"
                        title="Clear database credentials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Database Status Message */}
              {dbStatusMessage && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    dbTestStatus === 'SUCCESS'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : dbTestStatus === 'ERROR'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'
                  }`}
                >
                  {dbTestStatus === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{dbStatusMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestDatabase}
                  disabled={dbTestStatus === 'TESTING' || !supabaseUrl.trim() || !supabaseKey.trim()}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition"
                >
                  {dbTestStatus === 'TESTING' ? 'Testing Connection...' : 'Test PostgreSQL Connection'}
                </button>

                <button
                  type="button"
                  onClick={handleCopySchemaPath}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied schema path!' : 'Copy schema.sql path'}</span>
                </button>
              </div>

              {/* PostgreSQL Schema Details Box */}
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Included Database Schema (`supabase/schema.sql`):
                </div>
                <div>• `material_chunks` with `vector(768)` embedding column & HNSW index</div>
                <div>• `match_chunks` stored procedure for cosine distance similarity retrieval</div>
                <div>• Relational tables for courses, quiz attempts, gap reports, and revision plans</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : null}
            <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
