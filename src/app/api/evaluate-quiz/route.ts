import { NextRequest, NextResponse } from 'next/server';
import { QuizQuestion, StudentAnswer, CourseMaterial } from '@/types';
import { evaluateStudentQuizAnswers, generateDiagnosticGapReport } from '@/lib/gapAnalyzer';
import { SAMPLE_COURSES } from '@/data/sampleCourses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, answers, courseId, course } = body as {
      questions: QuizQuestion[];
      answers: StudentAnswer[];
      courseId?: string;
      course?: CourseMaterial;
    };

    if (!questions || !answers) {
      return NextResponse.json({ error: 'Missing questions or answers in request payload' }, { status: 400 });
    }

    const currentCourse =
      course ||
      SAMPLE_COURSES.find((c) => c.id === courseId) ||
      SAMPLE_COURSES[0];

    const evaluatedResults = evaluateStudentQuizAnswers(questions, answers);
    const gapReport = generateDiagnosticGapReport({
      course: currentCourse,
      evaluatedResults,
    });

    return NextResponse.json({
      success: true,
      evaluatedResults,
      gapReport,
    });
  } catch (error: unknown) {
    console.error('Error evaluating quiz:', error);
    const msg = error instanceof Error ? error.message : 'Failed to evaluate quiz';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
