'use client';

import React, { useState, useEffect } from 'react';
import { QuizQuestion, StudentAnswer, EvaluatedQuestionResult } from '@/types';
import {
  BrainCircuit,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Quote,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticQuizProps {
  questions: QuizQuestion[];
  onCompleteQuiz: (results: EvaluatedQuestionResult[], answers: StudentAnswer[]) => void;
  onNavigateToReport: () => void;
  onSelectTopicForExplain: (topicTitle: string) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  questions,
  onCompleteQuiz,
  onNavigateToReport,
  onSelectTopicForExplain,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [confidenceRatings, setConfidenceRatings] = useState<Record<string, 'LOW' | 'MEDIUM' | 'HIGH'>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [showCitation, setShowCitation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluatedResults, setEvaluatedResults] = useState<EvaluatedQuestionResult[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Active question timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
      const currentQ = questions[currentIndex];
      if (currentQ) {
        setTimeSpent((prev) => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + 1,
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, isSubmitted, questions]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted || isSubmitting) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    if (!confidenceRatings[currentQ.id]) {
      setConfidenceRatings((prev) => ({ ...prev, [currentQ.id]: 'MEDIUM' }));
    }
  };

  const handleSelectConfidence = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
    if (isSubmitted || isSubmitting) return;
    setConfidenceRatings((prev) => ({ ...prev, [currentQ.id]: level }));
  };

  const executeSubmission = async () => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const studentAnswers: StudentAnswer[] = questions.map((q) => {
      const selectedId = selectedAnswers[q.id] || '';
      return {
        questionId: q.id,
        selectedOptionId: selectedId,
        isCorrect: selectedId === q.correctOptionId,
        timeSpentSeconds: timeSpent[q.id] || 15,
        confidence: confidenceRatings[q.id] || 'MEDIUM',
      };
    });

    try {
      const res = await fetch('/api/evaluate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          answers: studentAnswers,
        }),
      });

      const data = await res.json();
      if (data.evaluatedResults) {
        setEvaluatedResults(data.evaluatedResults);
        setIsSubmitted(true);
        onCompleteQuiz(data.evaluatedResults, studentAnswers);

        // Calculate score for celebration
        const correctCount = data.evaluatedResults.filter((r: EvaluatedQuestionResult) => r.isCorrect).length;
        const scorePercent = Math.round((correctCount / questions.length) * 100);
        if (scorePercent >= 60) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).filter((k) => !!selectedAnswers[k]).length;
    if (answeredCount < questions.length) {
      setShowConfirmModal(true);
    } else {
      executeSubmission();
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setConfidenceRatings({});
    setTimeSpent({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setEvaluatedResults([]);
    setCurrentIndex(0);
    setTimerSeconds(0);
  };

  if (!currentQ) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center max-w-xl mx-auto shadow-sm">
        <BrainCircuit className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Diagnostic Questions Available</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Please select another course or topic from the Topic Map.
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).filter((k) => !!selectedAnswers[k]).length;
  const currentEvaluated = evaluatedResults.find((r) => r.question.id === currentQ.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header & Timer */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Step 1 • Diagnostic Assessment
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Grounded in Course Notes & Syllabus
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {currentQ.unitTitle}: <span className="text-indigo-600 dark:text-indigo-400">{currentQ.topicTitle}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {Math.floor(timerSeconds / 60)}:
              {(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Question Selector Dots / Progress */}
      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {questions.map((q, idx) => {
          const isAnswered = !!selectedAnswers[q.id];
          const isCurrent = idx === currentIndex;
          const evalRes = evaluatedResults.find((r) => r.question.id === q.id);

          let dotClass = 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
          if (isSubmitted && evalRes) {
            dotClass = evalRes.isCorrect
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white';
          } else if (isCurrent) {
            dotClass = 'bg-indigo-600 text-white ring-2 ring-indigo-400/50';
          } else if (isAnswered) {
            dotClass = 'bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-400/50';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-1 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${dotClass}`}
              title={`Jump to Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm relative">
        {/* Source Citation Badge */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Cognitive Level:
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {currentQ.cognitiveLevel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowCitation(!showCitation)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showCitation ? 'Hide Material Grounding' : 'View Source Citation'}</span>
          </button>
        </div>

        {/* Collapsible Source Citation Drawer */}
        {showCitation && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-2">
            <div className="flex items-center justify-between text-indigo-800 dark:text-indigo-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Grounded Source Material: {currentQ.citation.documentName}
              </span>
              <span className="text-slate-500 text-[11px]">
                {currentQ.citation.section} (Page {currentQ.citation.page || 'N/A'})
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
              &ldquo;{currentQ.citation.sourceSnippet}&rdquo;
            </p>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedAnswers[currentQ.id] === option.id;
            const isCorrectOption = option.id === currentQ.correctOptionId;

            let cardStyle =
              'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300';

            if (isSubmitted) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                cardStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              } else {
                cardStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-white ring-1 ring-indigo-500 shadow-sm';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border transition flex items-start gap-3 cursor-pointer select-none ${cardStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    isSubmitted
                      ? isCorrectOption
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {letter}
                </div>

                <div className="flex-1 text-xs sm:text-sm pt-0.5 leading-relaxed">
                  {option.text}

                  {/* Misconception indicator if submitted and chosen */}
                  {isSubmitted && option.isMisconception && isSelected && (
                    <div className="mt-2 text-xs text-rose-800 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-900/30 p-2.5 rounded-lg border border-rose-300 dark:border-rose-800/50 flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Identified Misconception: </span>
                        {option.misconceptionExplanation}
                      </div>
                    </div>
                  )}
                </div>

                {isSubmitted && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Confidence Selector (Before Submission) */}
        {!isSubmitted && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              How confident are you in this answer?
            </span>
            <div className="flex items-center gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectConfidence(lvl)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    confidenceRatings[currentQ.id] === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lvl} Confidence
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic Feedback (After Submission) */}
        {isSubmitted && currentEvaluated && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  currentEvaluated.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                }`}
              >
                {currentEvaluated.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {currentEvaluated.isCorrect ? 'Accurate Understanding' : 'Conceptual Gap Identified'}
              </span>

              <button
                type="button"
                onClick={() => onSelectTopicForExplain(currentQ.topicTitle)}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain Topic in AI Tutor</span>
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentEvaluated.diagnosticFeedback}
            </p>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !isSubmitted ? (
              <button
                type="button"
                onClick={handlePreSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Diagnosing Gaps...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Submit & Diagnose Gaps ({answeredCount}/{questions.length})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToReport}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm"
              >
                <span>View Full Gap Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isSubmitted && (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
                title="Retake Quiz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unanswered Questions Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Unanswered Questions Detected</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You answered <strong>{answeredCount} of {questions.length}</strong> questions. Unanswered questions will be evaluated as knowledge gaps or unattempted topics.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Keep Answering
              </button>
              <button
                type="button"
                onClick={executeSubmission}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
