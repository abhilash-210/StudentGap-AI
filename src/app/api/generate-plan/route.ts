import { NextRequest, NextResponse } from 'next/server';
import { DiagnosticGapReport } from '@/types';
import { generateAdaptiveRevisionPlanLocal } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gapReport, timeframeDays = 3, dailyHours = 2, courseTitle = 'Target Course' } = body as {
      gapReport: DiagnosticGapReport;
      timeframeDays?: number;
      dailyHours?: number;
      courseTitle?: string;
    };

    if (!gapReport) {
      return NextResponse.json({ error: 'Missing gap report' }, { status: 400 });
    }

    const plan = generateAdaptiveRevisionPlanLocal({
      gapReport,
      timeframeDays,
      dailyHours,
      courseTitle,
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error('Error generating revision plan:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate revision plan' }, { status: 500 });
  }
}
