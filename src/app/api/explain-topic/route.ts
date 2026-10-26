import { NextRequest, NextResponse } from 'next/server';
import { explainTopicWithRAG } from '@/lib/gemini';
import { SAMPLE_COURSES } from '@/data/sampleCourses';
import { MaterialChunk } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, topicTitle, courseId, customChunks, apiKey } = body as {
      query: string;
      topicTitle?: string;
      courseId?: string;
      customChunks?: MaterialChunk[];
      apiKey?: string;
    };

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const course = SAMPLE_COURSES.find((c) => c.id === courseId) || SAMPLE_COURSES[0];
    const chunks = customChunks && customChunks.length > 0 ? customChunks : course.chunks;

    const result = await explainTopicWithRAG({
      query,
      topicTitle,
      chunks,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in explain-topic route:', error);
    return NextResponse.json({ error: error.message || 'Failed to explain topic' }, { status: 500 });
  }
}
