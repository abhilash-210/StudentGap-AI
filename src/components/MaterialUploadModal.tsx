'use client';

import React, { useState } from 'react';
import { MaterialChunk, CourseMaterial } from '@/types';
import { chunkTextDocument } from '@/lib/ragEngine';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Layers,
} from 'lucide-react';

interface MaterialUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaterial: (
    documentName: string,
    documentType: 'syllabus' | 'notes' | 'textbook' | 'past_paper',
    rawText: string,
    chunks: MaterialChunk[]
  ) => void;
  course: CourseMaterial;
}

export const MaterialUploadModal: React.FC<MaterialUploadModalProps> = ({
  isOpen,
  onClose,
  onAddMaterial,
  course,
}) => {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'syllabus' | 'notes' | 'textbook' | 'past_paper'>('notes');
  const [textContent, setTextContent] = useState('');
  const [previewChunks, setPreviewChunks] = useState<MaterialChunk[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateTextUpload = (type: 'syllabus' | 'notes' | 'past_paper') => {
    if (type === 'syllabus') {
      setDocName('CS201_Updated_Syllabus_Module5.txt');
      setDocType('syllabus');
      setTextContent(`Unit 5: Secondary Storage & Disk Scheduling Algorithms
Topics covered:
1. Disk Geometry and Track Seek Time vs Rotational Latency.
2. Disk Scheduling Algorithms: FCFS, SSTF (Shortest Seek Time First), SCAN (Elevator Algorithm), C-SCAN (Circular SCAN), LOOK, C-LOOK.
3. SSTF Starvation: Highly localized requests can starve distant requests indefinitely.
4. C-SCAN vs SCAN: C-SCAN provides a more uniform wait time by treating cylinders as a circular list and only serving requests in one direction.
Exam Weightage: 12% of total exam.`);
    } else if (type === 'notes') {
      setDocName('Lecture_Notes_Disk_Scheduling_Inodes.txt');
      setDocType('notes');
      setTextContent(`Chapter 6: Disk Arm Scheduling and Seek Time Optimization:
The seek time is the time taken by the disk arm to position the heads over the desired cylinder.
Rotational latency is the additional delay waiting for the desired sector to rotate under the head.

SSTF (Shortest Seek Time First):
Selects the request with minimum seek time from the current head position. Although SSTF reduces average seek time substantially compared to FCFS, it can cause starvation if new requests arrive close to the current position.

SCAN (Elevator Algorithm):
The disk arm moves in a single direction from one end of the disk to the other, servicing requests until it reaches the last cylinder, then reverses direction.

C-SCAN (Circular SCAN):
Restricts service to a single direction. When it reaches the end, it immediately returns to the beginning of the disk without servicing requests on the return trip.
Advantage: Provides a more uniform waiting time than standard SCAN.`);
    } else {
      setDocName('Past_GATE_Exam_Disk_Questions.txt');
      setDocType('past_paper');
      setTextContent(`GATE 2024 Question on Disk Scheduling:
Suppose a disk has 200 cylinders (0 to 199). Current head position is at cylinder 53.
Pending request queue: 98, 183, 37, 122, 14, 124, 65, 67.
If SSTF is used, calculate the total head movement in cylinders.
Solution:
Initial: 53.
Closest: 65 (|65-53|=12).
Next: 67 (|67-65|=2).
Next: 37 (|37-67|=30).
Next: 14 (|14-37|=23).
Next: 98 (|98-14|=84).
Next: 122 (|122-98|=24).
Next: 124 (|124-122|=2).
Next: 183 (|183-124|=59).
Total head movement = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236 cylinders.`);
    }
  };

  const handlePreviewChunks = () => {
    if (!textContent.trim() || !docName.trim()) return;
    setIsProcessing(true);
    const docId = `custom-doc-${Date.now()}`;
    const chunks = chunkTextDocument(docId, docName, docType, textContent, 100);
    setPreviewChunks(chunks);
    setIsProcessing(false);
  };

  const handleSave = () => {
    if (!docName.trim() || !textContent.trim()) return;
    const docId = `custom-doc-${Date.now()}`;
    const chunks = chunkTextDocument(docId, docName, docType, textContent, 120);
    onAddMaterial(docName, docType, textContent, chunks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Material Ingestion Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Upload Study Material for {course.code}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload your syllabus, lecture notes, textbook chapters, or past question papers.
            Our RAG parser will tokenize, chunk, and index them into semantic search embeddings.
          </p>
        </div>

        {/* Quick Demo Preloads */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick-Fill Sample Material (for quick testing):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('syllabus')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              + Syllabus Excerpt (Disk Scheduling)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('notes')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              + Lecture Notes (SSTF vs SCAN vs C-SCAN)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('past_paper')}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              + GATE Past Exam Problem
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Document Title / Filename:
              </label>
              <input
                type="text"
                placeholder="e.g. Unit4_Storage_LectureNotes.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Document Type:
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="syllabus">Syllabus / Course Outline</option>
                <option value="notes">Lecture Notes / Handouts</option>
                <option value="textbook">Textbook Chapter</option>
                <option value="past_paper">Past Question Paper</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Document Content (Plain Text or Markdown):
            </label>
            <textarea
              rows={6}
              placeholder="Paste lecture notes text, syllabus modules, or exam questions here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Chunk Preview Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviewChunks}
              disabled={!textContent.trim() || !docName.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Preview RAG Chunking Breakdown</span>
            </button>
            <span className="text-[11px] text-slate-500">
              {textContent.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Live Chunks Preview */}
          {previewChunks.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>RAG Chunks Generated ({previewChunks.length}):</span>
                <span className="text-[10px] text-emerald-400">Ready for Embedding</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {previewChunks.map((c, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                    <div className="text-indigo-300 font-bold flex justify-between">
                      <span>Chunk #{i + 1}: {c.section}</span>
                      <span className="text-slate-400">{c.wordCount} words</span>
                    </div>
                    <p className="text-slate-400 line-clamp-2 italic font-mono text-[10px]">
                      "{c.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!docName.trim() || !textContent.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition shadow-lg shadow-indigo-600/30"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ingest & Build Topic Nodes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
