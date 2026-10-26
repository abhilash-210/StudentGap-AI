'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CourseMaterial, ChatMessage } from '@/types';
import {
  Sparkles,
  Send,
  BookOpen,
  Quote,
  HelpCircle,
  BrainCircuit,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';

interface ExplainAssistantProps {
  course: CourseMaterial;
  initialTopicPrompt?: string;
  onClearInitialTopicPrompt?: () => void;
  onNavigateToQuiz: (topicId?: string) => void;
}

export const ExplainAssistant: React.FC<ExplainAssistantProps> = ({
  course,
  initialTopicPrompt,
  onClearInitialTopicPrompt,
  onNavigateToQuiz,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      content: `Hello! I am your **GapFinder RAG Assistant**.
I answer questions strictly grounded in your uploaded materials for **${course.code}: ${course.title}**. Every answer cites the exact chapter, section, and page from your notes and past exams.

What topic or diagnostic gap would you like to deconstruct today?`,
      suggestedFollowups: [
        `Why does Belady's Anomaly occur in FIFO but not LRU?`,
        `How do I determine if Banker's Algorithm state is Safe?`,
        `Derive the formula for TLB Effective Memory Access Time (EAT)`,
        `What causes thrashing and how does the OS fix it?`,
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If prompted externally (e.g. from Gap Report click)
  useEffect(() => {
    if (initialTopicPrompt) {
      handleSend(`Explain the core principles and common misconceptions for "${initialTopicPrompt}"`);
      if (onClearInitialTopicPrompt) onClearInitialTopicPrompt();
    }
  }, [initialTopicPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/explain-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          courseId: course.id,
          customChunks: course.chunks,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: data.answer || 'I evaluated your notes, but no direct section answered this query.',
        citations: data.citations || [],
        suggestedFollowups: data.suggestedFollowups || [
          `Test my understanding on this topic with a quick quiz`,
          `Show me past exam questions related to this`,
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get RAG answer:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: `Sorry, an error occurred while querying the RAG knowledge base. Please try asking again.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 p-5 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Explain-This-Topic RAG Assistant</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded exclusively in your uploaded syllabus, notes, and past exam papers.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToQuiz()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 transition"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Take Quiz on Gaps</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between">
        <div className="space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/80 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md rounded-tl-none space-y-3'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Grounded Citation Chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Source Grounding Citations:</span>
                      </div>

                      <div className="space-y-2">
                        {msg.citations.map((cite, idx) => {
                          const citeKey = `${msg.id}-cite-${idx}`;
                          const isExpanded = expandedCitationId === citeKey;

                          return (
                            <div
                              key={idx}
                              className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden text-xs"
                            >
                              <div
                                onClick={() => setExpandedCitationId(isExpanded ? null : citeKey)}
                                className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 select-none"
                              >
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <span className="w-4 h-4 rounded-full bg-indigo-900/80 text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="font-semibold text-slate-300 truncate">
                                    {cite.documentName}
                                  </span>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400 text-[11px] truncate">
                                    {cite.section}
                                  </span>
                                </div>

                                <div className="text-slate-400 shrink-0">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-300 italic font-mono leading-relaxed">
                                  <Quote className="w-3 h-3 text-indigo-400 mb-1" />
                                  "{cite.snippet}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowups.map((followup, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(followup)}
                          className="text-[11px] bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-900/50 transition flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3 text-amber-400" />
                          <span>{followup}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/60 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Searching student notes & grounding citations...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask any question about ${course.code} grounded in your material...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30"
            >
              <span>Ask RAG</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
