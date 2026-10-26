import { MaterialChunk } from '@/types';

/**
 * Tokenizes text into lowercase word tokens, stripping punctuation.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Computes term frequencies (TF) for a token list.
 */
export function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  const total = tokens.length || 1;
  for (const [k, v] of tf.entries()) {
    tf.set(k, v / total);
  }
  return tf;
}

/**
 * RAG Retriever that operates over indexed material chunks.
 * Computes BM25/TF-IDF similarity to ground questions and chat responses in user-uploaded documents.
 */
export class RAGRetriever {
  private chunks: MaterialChunk[];
  private idf: Map<string, number> = new Map();

  constructor(chunks: MaterialChunk[]) {
    this.chunks = chunks;
    this.computeIDF();
  }

  private computeIDF() {
    const totalDocs = this.chunks.length;
    if (totalDocs === 0) return;

    const docFreq = new Map<string, number>();
    for (const chunk of this.chunks) {
      const uniqueTokens = new Set(tokenize(chunk.content + ' ' + chunk.section));
      for (const token of uniqueTokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    for (const [token, count] of docFreq.entries()) {
      // Smoothed IDF
      this.idf.set(token, Math.log(1 + (totalDocs - count + 0.5) / (count + 0.5)));
    }
  }

  /**
   * Retrieves top K chunks most relevant to the query.
   */
  public search(query: string, topK: number = 3, topicFilter?: string): { chunk: MaterialChunk; score: number }[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0 || this.chunks.length === 0) {
      return this.chunks.slice(0, topK).map((c) => ({ chunk: c, score: 0.1 }));
    }

    const scored = this.chunks
      .filter((chunk) => {
        if (!topicFilter) return true;
        return chunk.topics.includes(topicFilter);
      })
      .map((chunk) => {
        const chunkTokens = tokenize(chunk.content + ' ' + chunk.section);
        const tf = computeTF(chunkTokens);

        let score = 0;
        for (const qToken of queryTokens) {
          const termFreq = tf.get(qToken) || 0;
          const inverseDocFreq = this.idf.get(qToken) || 0.5;
          score += termFreq * inverseDocFreq;
        }

        // Boost if query matches the section or document name
        if (chunk.section.toLowerCase().includes(query.toLowerCase())) {
          score += 1.5;
        }

        return { chunk, score };
      });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  /**
   * Formats top chunks into a grounded context string with exact markdown citations.
   */
  public formatContextForPrompt(relevantChunks: { chunk: MaterialChunk; score: number }[]): string {
    if (relevantChunks.length === 0) return 'No directly matching course material found.';

    return relevantChunks
      .map(
        ({ chunk }, idx) => `
[SOURCE ${idx + 1}]
Document: ${chunk.documentName}
Type: ${chunk.documentType.toUpperCase()}
Section: ${chunk.section} (Page: ${chunk.page || 'N/A'})
Snippet:
${chunk.content}
`
      )
      .join('\n---\n');
  }
}

/**
 * Splits raw uploaded text into structured material chunks.
 */
export function chunkTextDocument(
  docId: string,
  docName: string,
  docType: 'syllabus' | 'notes' | 'textbook' | 'past_paper',
  rawText: string,
  chunkSizeWords: number = 200
): MaterialChunk[] {
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const chunks: MaterialChunk[] = [];
  let currentWords: string[] = [];
  let currentSection = 'General Overview';
  let chunkIndex = 1;

  for (const para of paragraphs) {
    // Detect section titles if line is short or starts with header markdown
    if (para.startsWith('#') || para.length < 60 && para.endsWith(':') || /^(Unit|Chapter|Section|Module)\s+\d+/i.test(para)) {
      currentSection = para.replace(/^#+\s*/, '').trim();
    }

    const words = para.split(/\s+/);
    if (currentWords.length + words.length > chunkSizeWords && currentWords.length > 0) {
      chunks.push({
        id: `chunk-${docId}-${chunkIndex++}`,
        documentId: docId,
        documentName: docName,
        documentType: docType,
        section: currentSection,
        page: Math.ceil(chunkIndex / 2),
        content: currentWords.join(' '),
        topics: [],
        wordCount: currentWords.length,
      });
      currentWords = [...words];
    } else {
      currentWords.push(...words);
    }
  }

  if (currentWords.length > 0) {
    chunks.push({
      id: `chunk-${docId}-${chunkIndex++}`,
      documentId: docId,
      documentName: docName,
      documentType: docType,
      section: currentSection,
      page: Math.ceil(chunkIndex / 2),
      content: currentWords.join(' '),
      topics: [],
      wordCount: currentWords.length,
    });
  }

  return chunks;
}
