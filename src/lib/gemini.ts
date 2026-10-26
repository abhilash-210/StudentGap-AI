import { GoogleGenerativeAI } from '@google/generative-ai';
import { MaterialChunk, DiagnosticGapReport, RevisionPlan, DailyRevisionSchedule, RevisionTask } from '@/types';
import { RAGRetriever } from './ragEngine';

export interface AIResponseWithCitations {
  answer: string;
  citations: {
    documentName: string;
    section: string;
    page?: number;
    snippet: string;
  }[];
  suggestedFollowups: string[];
}

/**
 * Returns Gemini client instance or null if no key available
 */
function getGeminiClient(customApiKey?: string): GoogleGenerativeAI | null {
  const apiKey =
    customApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Explain a topic using strict RAG retrieval over uploaded materials.
 */
export async function explainTopicWithRAG({
  query,
  topicTitle,
  chunks,
  apiKey,
}: {
  query: string;
  topicTitle?: string;
  chunks: MaterialChunk[];
  apiKey?: string;
}): Promise<AIResponseWithCitations> {
  const retriever = new RAGRetriever(chunks);
  const relevant = retriever.search(query + ' ' + (topicTitle || ''), 3);
  const citations = relevant.map((r) => ({
    documentName: r.chunk.documentName,
    section: r.chunk.section,
    page: r.chunk.page,
    snippet: r.chunk.content.slice(0, 220) + '...',
  }));

  const genAI = getGeminiClient(apiKey);

  if (genAI && relevant.length > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const context = retriever.formatContextForPrompt(relevant);

      const prompt = `
You are GapFinder AI, an expert academic tutor.
Your job is to answer the student's question STRICTLY grounded in their uploaded course material below.
Do not hallucinate or use outside facts not supported by the context.
Always explicitly mention which document or section supports your points.

STUDENT'S UPLOADED CONTEXT:
${context}

STUDENT'S QUESTION / TOPIC:
${query}

INSTRUCTIONS:
1. Provide a clear, intuitive conceptual explanation.
2. If mathematical formulas or pseudocode are present in the text, highlight them cleanly.
3. Emphasize common traps or misconceptions students fall into.
4. Conclude with a 1-sentence summary citation pointing to the source section.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return {
        answer: text,
        citations,
        suggestedFollowups: [
          `Test my understanding on ${topicTitle || 'this topic'} with a quick question`,
          `Show past paper exam trends for ${topicTitle || 'this topic'}`,
          `What are the classic edge cases I should watch out for?`,
        ],
      };
    } catch (err) {
      console.warn('Gemini API call failed or rate-limited. Falling back to grounded local RAG synthesis:', err);
    }
  }

  // Intelligent Local Heuristic RAG Fallback
  const topSnippet = relevant[0]?.chunk;
  const secondarySnippet = relevant[1]?.chunk;

  let localExplanation = '';
  if (topSnippet) {
    localExplanation = `### Grounded Diagnosis & Explanation: ${topicTitle || 'Concept Overview'}

According to your uploaded notes (**${topSnippet.documentName}**, *${topSnippet.section}*):

> "${topSnippet.content}"

${
  secondarySnippet
    ? `\n**Corroborating Source Details (${secondarySnippet.documentName}):**\n> "${secondarySnippet.content}"\n`
    : ''
}

#### 💡 Core Takeaways & Common Pitfalls:
- **Foundational Principle:** Grounded directly in your syllabus, ensure you distinguish between theoretical invariants and practical edge cases.
- **Why Students Stumble:** Diagnostic analysis indicates students frequently memorize terms without internalizing the boundary conditions (e.g. state transitions or mathematical inclusion properties).
- **Exam Strategy:** When answering university or GATE questions on this topic, always write the governing formal definition before walking through step-by-step traces.`;
  } else {
    localExplanation = `We analyzed your uploaded material for "${query}". While this concept connects to your course syllabus, we recommend reviewing your notes or uploading additional chapter sections to generate deep cross-referenced citations.`;
  }

  return {
    answer: localExplanation,
    citations,
    suggestedFollowups: [
      `Take a 3-question diagnostic quiz on ${topicTitle || 'this concept'}`,
      `How does this topic impact my overall exam readiness?`,
      `Show me the step-by-step formula or algorithm trace`,
    ],
  };
}

/**
 * Generate adaptive revision plan schedules based on the diagnostic gap report.
 */
export function generateAdaptiveRevisionPlanLocal({
  gapReport,
  timeframeDays = 3,
  dailyHours = 2,
  courseTitle,
}: {
  gapReport: DiagnosticGapReport;
  timeframeDays: number;
  dailyHours: number;
  courseTitle: string;
}): RevisionPlan {
  const schedules: DailyRevisionSchedule[] = [];

  // Group topics: Weakest high-weightage topics come first
  const allTopics = [
    ...gapReport.weakTopics.map((t) => ({ ...t, priorityLevel: 'HIGH' as const })),
    ...gapReport.mediumTopics.map((t) => ({ ...t, priorityLevel: 'MEDIUM' as const })),
    ...gapReport.strongTopics.map((t) => ({ ...t, priorityLevel: 'LOW' as const })),
  ];

  // Sort by (100 - masteryScore) * examWeightage
  allTopics.sort((a, b) => {
    const urgencyA = (100 - a.masteryScore) * (a.examWeightagePercent || 10);
    const urgencyB = (100 - b.masteryScore) * (b.examWeightagePercent || 10);
    return urgencyB - urgencyA;
  });

  const dailyMinutesTarget = dailyHours * 60;
  let topicCursor = 0;

  for (let day = 1; day <= timeframeDays; day++) {
    const tasks: RevisionTask[] = [];
    let allocatedMins = 0;

    let theme = '';
    if (day === 1) theme = 'Critical Gaps & High-Yield Foundations';
    else if (day === timeframeDays) theme = 'Rapid Recall, Edge Cases & Mock Self-Test';
    else theme = `Targeted Mastery & Past-Paper Drills`;

    // Add 2-3 focused tasks per day
    while (allocatedMins < dailyMinutesTarget - 20 && topicCursor < allTopics.length) {
      const topic = allTopics[topicCursor];
      const isWeak = topic.masteryLevel === 'WEAK';

      // 1. Core revision task
      tasks.push({
        id: `task-d${day}-t${topicCursor}-core`,
        dayNumber: day,
        topicId: topic.topicId,
        topicTitle: topic.topicTitle,
        unitTitle: topic.unitTitle,
        priority: topic.priorityLevel,
        taskType: isWeak ? 'MISCONCEPTION_CLEARING' : 'CORE_CONCEPT_REVISION',
        title: isWeak
          ? `Deconstruct Misconceptions: ${topic.topicTitle}`
          : `Fast Review: ${topic.topicTitle}`,
        instruction: isWeak
          ? `Review citation: ${topic.keySourcesToReview[0]?.documentName || 'Course Notes'} (${topic.keySourcesToReview[0]?.section || 'Core Section'}). Focus on: ${topic.primaryReason}`
          : `Quickly review key summary sheets and formulas for ${topic.topicTitle}.`,
        durationMinutes: isWeak ? 45 : 30,
        citationReference: `${topic.keySourcesToReview[0]?.documentName || 'Notes'} - ${topic.keySourcesToReview[0]?.section || 'Core Section'}`,
        completed: false,
      });
      allocatedMins += isWeak ? 45 : 30;

      // 2. Drill / Diagnostic Self-test task
      if (allocatedMins + 30 <= dailyMinutesTarget) {
        tasks.push({
          id: `task-d${day}-t${topicCursor}-drill`,
          dayNumber: day,
          topicId: topic.topicId,
          topicTitle: topic.topicTitle,
          unitTitle: topic.unitTitle,
          priority: topic.priorityLevel,
          taskType: isWeak ? 'PAST_PAPER_DRILL' : 'SELF_TEST',
          title: `Diagnostic Re-Test: ${topic.topicTitle}`,
          instruction: `Complete 5 targeted practice questions to verify that the identified misconception is resolved.`,
          durationMinutes: 25,
          citationReference: `Past Papers & Diagnostic Quiz Pool`,
          completed: false,
        });
        allocatedMins += 25;
      }

      topicCursor++;
    }

    // If day still has spare time, add a synthesis wrap-up task
    if (allocatedMins < dailyMinutesTarget) {
      const remaining = Math.max(15, dailyMinutesTarget - allocatedMins);
      tasks.push({
        id: `task-d${day}-wrapup`,
        dayNumber: day,
        topicId: 'general-synthesis',
        topicTitle: 'Daily Active Recall Synthesis',
        unitTitle: 'Daily Wrap-up',
        priority: 'MEDIUM',
        taskType: 'SELF_TEST',
        title: `Flash Recall & Formula Cheat Sheet Consolidation`,
        instruction: `Without looking at your notes, write down the 3 hardest definitions or formulas learned today.`,
        durationMinutes: remaining,
        citationReference: `${courseTitle} - Daily Synthesis`,
        completed: false,
      });
      allocatedMins += remaining;
    }

    schedules.push({
      dayNumber: day,
      dateLabel: `Day ${day} (${Math.round(allocatedMins / 60 * 10) / 10} hrs)`,
      theme,
      estimatedMinutes: allocatedMins,
      tasks,
    });
  }

  const allTasksCount = schedules.flatMap((s) => s.tasks);
  const completedTasks = allTasksCount.filter((t) => t.completed).length;

  return {
    id: `plan-${Date.now()}`,
    courseId: 'current-course',
    generatedAt: new Date().toISOString(),
    timeframeDays,
    dailyHoursAvailable: dailyHours,
    totalEstimatedMinutes: schedules.reduce((acc, s) => acc + s.estimatedMinutes, 0),
    completedMinutes: 0,
    completionPercent: allTasksCount.length > 0 ? Math.round((completedTasks / allTasksCount.length) * 100) : 0,
    schedules,
  };
}
