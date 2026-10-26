import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'GapFinder AI | Diagnostic Knowledge Engine & Adaptive Revision Planner',
  description:
    'Finds what you do not know before you ask. Maps student syllabus, identifies knowledge gaps and misconceptions with grounded RAG diagnostic quizzes, and builds an adaptive revision plan.',
  keywords: [
    'GapFinder AI',
    'Student Knowledge Diagnosis',
    'RAG Retrieval Augmented Generation',
    'Adaptive Revision Planner',
    'Misconception Detection',
    'Exam Preparation',
  ],
  authors: [{ name: 'GapFinder AI Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200"
      >
        {children}
      </body>
    </html>
  );
}
