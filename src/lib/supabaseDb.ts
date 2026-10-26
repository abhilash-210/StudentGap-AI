import { getSupabaseClient } from './supabase';
import {
  CourseMaterial,
  QuizAttemptRecord,
  DiagnosticGapReport,
  RevisionPlan,
  MaterialChunk,
} from '@/types';

/**
 * Saves or updates a Course and its Units/Documents in Supabase PostgreSQL.
 */
export async function syncCourseToSupabase(course: CourseMaterial): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('courses').upsert({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      target_exam: course.targetExam,
      units: course.units,
      documents: course.documents,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase course sync error:', error.message);
      return false;
    }

    // Also sync chunks
    if (course.chunks && course.chunks.length > 0) {
      await syncChunksToSupabase(course.id, course.chunks);
    }

    return true;
  } catch (err) {
    console.warn('Failed to sync course to Supabase:', err);
    return false;
  }
}

/**
 * Saves Material Chunks to Supabase pgvector store.
 */
export async function syncChunksToSupabase(courseId: string, chunks: MaterialChunk[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = chunks.map((c) => ({
      id: c.id,
      course_id: courseId,
      document_id: c.documentId,
      document_name: c.documentName,
      document_type: c.documentType,
      section: c.section,
      page: c.page || null,
      content: c.content,
      topics: c.topics || [],
      word_count: c.wordCount,
    }));

    const { error } = await client.from('material_chunks').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase chunks sync error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to sync chunks to Supabase:', err);
    return false;
  }
}

/**
 * Fetches Courses from Supabase PostgreSQL.
 */
export async function fetchCoursesFromSupabase(): Promise<CourseMaterial[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('courses').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      subject: (row.subject as string) || (row.title as string),
      description: row.description,
      targetExam: row.target_exam,
      units: row.units || [],
      documents: row.documents || [],
      chunks: [],
    }));
  } catch (err) {
    console.warn('Failed to fetch courses from Supabase:', err);
    return null;
  }
}

/**
 * Saves a Quiz Attempt Record to Supabase PostgreSQL.
 */
export async function saveQuizAttemptToSupabase(attempt: QuizAttemptRecord, courseId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('quiz_attempts').insert({
      id: attempt.id,
      course_id: courseId,
      timestamp: attempt.timestamp,
      total_questions: attempt.totalQuestions,
      score_percent: attempt.scorePercent,
      topic_ids: attempt.topicIds,
      evaluated_results: attempt.evaluatedResults,
      answers: attempt.answers || [],
    });

    if (error) {
      console.warn('Supabase quiz attempt error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save attempt to Supabase:', err);
    return false;
  }
}

/**
 * Saves a Diagnostic Gap Report to Supabase PostgreSQL.
 */
export async function saveGapReportToSupabase(report: DiagnosticGapReport, courseId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('gap_reports').upsert({
      id: report.id,
      course_id: courseId,
      quiz_attempt_id: report.quizAttemptId,
      overall_score_percent: report.overallScorePercent,
      overall_readiness: report.overallReadiness,
      has_sufficient_evidence: report.hasSufficientEvidence,
      total_questions_evaluated: report.totalQuestionsEvaluated,
      summary_message: report.summaryMessage,
      weak_topics: report.weakTopics,
      medium_topics: report.mediumTopics,
      strong_topics: report.strongTopics,
      knowledge_dimensions: report.knowledgeDimensions,
      high_risk_danger_zones: report.highRiskDangerZones,
    });

    if (error) {
      console.warn('Supabase gap report error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save gap report to Supabase:', err);
    return false;
  }
}

/**
 * Saves a Revision Plan to Supabase PostgreSQL.
 */
export async function saveRevisionPlanToSupabase(plan: RevisionPlan, courseId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('revision_plans').upsert({
      id: plan.id,
      course_id: courseId,
      timeframe_days: plan.timeframeDays,
      daily_hours_available: plan.dailyHoursAvailable,
      total_estimated_minutes: plan.totalEstimatedMinutes,
      completed_minutes: plan.completedMinutes,
      completion_percent: plan.completionPercent,
      schedules: plan.schedules,
      generated_at: plan.generatedAt,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase revision plan error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save revision plan to Supabase:', err);
    return false;
  }
}

/**
 * Semantic Vector Search against PostgreSQL pgvector.
 * Calls the `match_chunks` PostgreSQL stored procedure.
 */
export async function searchChunksWithPgVector(
  queryEmbedding: number[],
  courseId: string,
  topK: number = 4
): Promise<MaterialChunk[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: topK,
      p_course_id: courseId,
    });

    if (error || !data) {
      console.warn('pgvector search error:', error?.message);
      return null;
    }

    return data.map((row: {
      id: string;
      document_id?: string;
      document_name: string;
      document_type: 'syllabus' | 'notes' | 'textbook' | 'past_paper';
      section: string;
      page?: number;
      content: string;
      word_count: number;
      topics?: string[];
    }) => ({
      id: row.id,
      documentId: row.document_id || row.id,
      documentName: row.document_name,
      documentType: row.document_type,
      section: row.section,
      page: row.page,
      content: row.content,
      topics: row.topics || [],
      wordCount: row.word_count,
    }));
  } catch (err) {
    console.warn('pgvector query failed:', err);
    return null;
  }
}
