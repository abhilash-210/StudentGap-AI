'use client';

import React, { useState, useRef } from 'react';
import { MaterialChunk, CourseMaterial } from '@/types';
import { chunkTextDocument } from '@/lib/ragEngine';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  FileUp,
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
  const [processState, setProcessState] = useState<'IDLE' | 'READING' | 'CHUNKING' | 'READY' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleFileUpload = (file: File) => {
    setErrorMessage('');
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      setProcessState('ERROR');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'txt' && extension !== 'md' && extension !== 'json') {
      setErrorMessage(`Unsupported file format (.${extension}). Please upload .txt, .md, or .json files. (For scanned PDFs, copy and paste the text below).`);
      setProcessState('ERROR');
      return;
    }

    setProcessState('READING');
    setDocName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content || content.trim().length === 0) {
        setErrorMessage('The selected file appears to be empty.');
        setProcessState('ERROR');
        return;
      }

      setTextContent(content);
      setProcessState('CHUNKING');

      setTimeout(() => {
        try {
          const docId = `doc-${Date.now()}`;
          const chunks = chunkTextDocument(docId, file.name, docType, content, 120);
          setPreviewChunks(chunks);
          setProcessState('READY');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Unknown parsing error';
          setErrorMessage(`Failed to chunk material: ${msg}`);
          setProcessState('ERROR');
        }
      }, 300);
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read file from disk. Please try again.');
      setProcessState('ERROR');
    };

    reader.readAsText(file);
  };

  const handleSimulateTextUpload = (type: 'syllabus' | 'notes' | 'past_paper') => {
    setErrorMessage('');
    setProcessState('IDLE');

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
    if (!textContent.trim() || !docName.trim()) {
      setErrorMessage('Please provide both a document name and content before generating chunks.');
      return;
    }
    setErrorMessage('');
    setProcessState('CHUNKING');

    setTimeout(() => {
      try {
        const docId = `doc-${Date.now()}`;
        const chunks = chunkTextDocument(docId, docName, docType, textContent, 120);
        setPreviewChunks(chunks);
        setProcessState('READY');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Check text formatting';
        setErrorMessage(`Chunking failed: ${msg}`);
        setProcessState('ERROR');
      }
    }, 200);
  };

  const handleSave = () => {
    if (!docName.trim() || !textContent.trim()) {
      setErrorMessage('Document name and content are required.');
      return;
    }

    const docId = `doc-${Date.now()}`;
    const chunks =
      previewChunks.length > 0
        ? previewChunks
        : chunkTextDocument(docId, docName, docType, textContent, 120);

    onAddMaterial(docName, docType, textContent, chunks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              Material Ingestion Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Upload Study Material for {course.code}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload syllabus modules, lecture notes, textbook chapters, or past question papers (.txt, .md).
            The RAG engine tokenizes and indexes semantic chunks with source citations.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition select-none ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept=".txt,.md,.json"
            className="hidden"
          />
          <FileUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Drag & drop files here, or click to browse
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Supported: .txt, .md, .json (Max 5 MB)
          </div>
        </div>

        {/* Sample Material Presets */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick-Load Sample Benchmark Materials:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('syllabus')}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              + Syllabus Excerpt (Disk Scheduling)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('notes')}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              + Lecture Notes (SSTF vs SCAN vs C-SCAN)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateTextUpload('past_paper')}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              + Past Exam Problem Set
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Document Title:
              </label>
              <input
                type="text"
                placeholder="e.g. Unit5_DiskScheduling.txt"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Material Classification:
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as 'syllabus' | 'notes' | 'past_paper')}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="syllabus">Syllabus / Curriculum</option>
                <option value="notes">Lecture Notes / Textbook</option>
                <option value="past_paper">Past Question Paper</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Document Text:
            </label>
            <textarea
              rows={5}
              placeholder="Paste lecture notes or chapter contents here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Chunk Preview Trigger */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handlePreviewChunks}
              disabled={!textContent.trim() || !docName.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {processState === 'CHUNKING' ? 'Tokenizing chunks...' : 'Preview RAG Semantic Chunks'}
              </span>
            </button>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {textContent.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Live Preview List */}
          {previewChunks.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>RAG Chunks Indexed ({previewChunks.length}):</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready for Grounding
                </span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {previewChunks.map((c, i) => (
                  <div key={i} className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                    <div className="text-indigo-600 dark:text-indigo-300 font-bold flex justify-between">
                      <span>Chunk #{i + 1}: {c.section}</span>
                      <span className="text-slate-400 text-[10px]">{c.wordCount} words</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-1 italic text-[10px] mt-0.5">
                      &ldquo;{c.content}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!docName.trim() || !textContent.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ingest & Index in Knowledge Base</span>
          </button>
        </div>
      </div>
    </div>
  );
};
