import { NextRequest, NextResponse } from 'next/server';
import { GROUNDED_QUIZ_QUESTIONS, SAMPLE_COURSES } from '@/data/sampleCourses';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId') || 'cs201-os';
  const topicId = searchParams.get('topicId');

  let questions = GROUNDED_QUIZ_QUESTIONS[courseId] || GROUNDED_QUIZ_QUESTIONS['cs201-os'] || [];

  if (topicId) {
    questions = questions.filter((q) => q.topicId === topicId);
  }

  return NextResponse.json({
    courseId,
    total: questions.length,
    questions,
  });
}
