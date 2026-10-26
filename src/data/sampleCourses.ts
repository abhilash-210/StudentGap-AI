import { CourseMaterial, QuizQuestion } from '@/types';

export const SAMPLE_COURSES: CourseMaterial[] = [
  {
    id: 'cs201-os',
    code: 'CS201',
    title: 'Operating Systems & Concurrency',
    subject: 'Computer Science & Engineering',
    targetExam: 'End-Semester University Exam & GATE CS',
    examDate: '2026-11-15',
    description: 'Core systems course covering process concurrency, synchronization primitives, memory virtualization, page replacement, and disk scheduling.',
    documents: [
      {
        id: 'doc-os-syl',
        name: 'CS201_Official_Syllabus_2024.pdf',
        type: 'syllabus',
        uploadedAt: '2026-10-10',
        sizeKb: 142,
        chunkCount: 8,
      },
      {
        id: 'doc-os-notes',
        name: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        type: 'notes',
        uploadedAt: '2026-10-12',
        sizeKb: 890,
        chunkCount: 24,
      },
      {
        id: 'doc-os-past',
        name: 'University_Past_Exam_Papers_2022_2024.pdf',
        type: 'past_paper',
        uploadedAt: '2026-10-14',
        sizeKb: 450,
        chunkCount: 12,
      },
    ],
    units: [
      {
        id: 'unit-1',
        number: 1,
        title: 'Process Synchronization & Concurrency',
        description: 'Race conditions, critical section problem, semaphores, monitors, and deadlock avoidance.',
        topics: [
          {
            id: 'top-semaphores',
            unitId: 'unit-1',
            unitTitle: 'Process Synchronization & Concurrency',
            title: 'Semaphores & Classical IPC Problems',
            description: 'Counting vs binary semaphores, wait() and signal() atomic operations, Dining Philosophers and Producer-Consumer solutions.',
            examWeightagePercent: 15,
            estimatedStudyMins: 90,
            keyConcepts: ['Binary vs Counting Semaphore', 'wait() & signal() atomicity', 'Producer-Consumer bounded buffer', 'Dining Philosophers deadlock prevention'],
            masteryLevel: 'MEDIUM',
            masteryScore: 65,
            questionsAttempted: 4,
            questionsCorrect: 3,
            detectedMisconceptions: ['Assuming semaphore wait() operation is non-blocking when counter is zero.'],
          },
          {
            id: 'top-deadlocks',
            unitId: 'unit-1',
            unitTitle: 'Process Synchronization & Concurrency',
            title: 'Deadlock Characterization & Banker’s Algorithm',
            description: 'Four Coffman conditions, Resource Allocation Graphs (RAG), Banker’s safety algorithm, deadlock detection vs prevention.',
            examWeightagePercent: 18,
            estimatedStudyMins: 110,
            keyConcepts: ['Coffman Conditions', 'Safe State vs Unsafe State', 'Banker Algorithm Resource Request', 'Resource Allocation Graph cycles with single vs multiple instances'],
            masteryLevel: 'WEAK',
            masteryScore: 35,
            questionsAttempted: 5,
            questionsCorrect: 1,
            detectedMisconceptions: [
              'Equating an unsafe state with an immediate deadlock; an unsafe state merely indicates potential future deadlock.',
              'Assuming cycles in Resource Allocation Graphs always imply deadlock regardless of multi-instance resource counts.',
            ],
          },
        ],
      },
      {
        id: 'unit-2',
        number: 2,
        title: 'Virtual Memory & Page Replacement',
        description: 'Address translation via page tables, TLBs, page faults, replacement algorithms, and thrashing.',
        topics: [
          {
            id: 'top-paging-tlb',
            unitId: 'unit-2',
            unitTitle: 'Virtual Memory & Page Replacement',
            title: 'Paging Hardware & TLB Effective Access Time',
            description: 'Multi-level paging, Translation Lookaside Buffer (TLB) hit and miss calculations, effective memory access time formula.',
            examWeightagePercent: 20,
            estimatedStudyMins: 120,
            keyConcepts: ['Page Table Base Register (PTBR)', 'TLB Hit Ratio α', 'Effective Access Time: EAT = α(t + m) + (1-α)(t + 2m)', 'Inverted Page Tables'],
            masteryLevel: 'STRONG',
            masteryScore: 85,
            questionsAttempted: 5,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
          {
            id: 'top-page-replacement',
            unitId: 'unit-2',
            unitTitle: 'Virtual Memory & Page Replacement',
            title: 'Page Replacement Algorithms & Belady’s Anomaly',
            description: 'FIFO, LRU, Optimal (MIN), Clock/Second Chance algorithms, Belady’s anomaly conditions, stack algorithms property.',
            examWeightagePercent: 22,
            estimatedStudyMins: 130,
            keyConcepts: ['Belady’s Anomaly in FIFO', 'Stack Algorithm definition (inclusion property)', 'Optimal algorithm clairvoyant oracle', 'Approximating LRU using reference bits'],
            masteryLevel: 'WEAK',
            masteryScore: 40,
            questionsAttempted: 6,
            questionsCorrect: 2,
            detectedMisconceptions: [
              'Believing LRU and Optimal algorithms can suffer from Belady’s anomaly.',
              'Confusing page fault frequency thrashing with page replacement algorithm performance.',
            ],
          },
          {
            id: 'top-thrashing',
            unitId: 'unit-2',
            unitTitle: 'Virtual Memory & Page Replacement',
            title: 'Thrashing & Working Set Strategy',
            description: 'Causes of thrashing, page fault frequency (PFF) control, working set model, locality of reference.',
            examWeightagePercent: 10,
            estimatedStudyMins: 60,
            keyConcepts: ['Locality of Reference (Temporal & Spatial)', 'Working Set Window Δ', 'Page Fault Frequency PFF thresholds', 'Degree of Multiprogramming adjustment'],
            masteryLevel: 'MEDIUM',
            masteryScore: 70,
            questionsAttempted: 3,
            questionsCorrect: 2,
            detectedMisconceptions: ['Assuming increasing degree of multiprogramming always improves CPU utilization.'],
          },
        ],
      },
      {
        id: 'unit-3',
        number: 3,
        title: 'CPU Scheduling Algorithms',
        description: 'Process states, context switching, scheduling criteria, preemptive vs non-preemptive algorithms.',
        topics: [
          {
            id: 'top-cpu-sched',
            unitId: 'unit-3',
            unitTitle: 'CPU Scheduling Algorithms',
            title: 'Preemptive vs Non-Preemptive Scheduling & Convoy Effect',
            description: 'FCFS, Shortest Job First (SJF), Shortest Remaining Time First (SRTF), Round Robin time quantum selection, starvation.',
            examWeightagePercent: 15,
            estimatedStudyMins: 80,
            keyConcepts: ['Convoy effect in FCFS', 'SJF optimality for minimum average waiting time', 'Round Robin time quantum trade-offs', 'Aging technique for preventing starvation'],
            masteryLevel: 'STRONG',
            masteryScore: 90,
            questionsAttempted: 4,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
        ],
      },
    ],
    chunks: [
      {
        id: 'chk-os-1',
        documentId: 'doc-os-notes',
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        documentType: 'notes',
        section: 'Chapter 4: Deadlocks, Section 4.2',
        page: 45,
        wordCount: 180,
        topics: ['top-deadlocks'],
        content: `A deadlock can occur if and only if four Coffman conditions hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and requesting additional resources held by other processes.
3. No Preemption: Resources cannot be preempted; a resource can only be released voluntarily by the process holding it.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.

CRITICAL DISTINCTION: An unsafe state is NOT synonymous with deadlock. A system in an unsafe state is not necessarily deadlocked; an unsafe state is merely a state from which the system cannot guarantee that all processes will finish without entering deadlock. Deadlock is a subset of unsafe states.`,
      },
      {
        id: 'chk-os-2',
        documentId: 'doc-os-notes',
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        documentType: 'notes',
        section: 'Chapter 5: Memory Management, Section 5.4 Page Replacement',
        page: 78,
        wordCount: 210,
        topics: ['top-page-replacement'],
        content: `Belady's Anomaly is the phenomenon in which increasing the number of page frames results in an increase in the number of page faults for certain memory access patterns.
This phenomenon occurs primarily in FIFO (First-In, First-Out) page replacement.

Why does FIFO suffer from Belady's Anomaly?
FIFO does not satisfy the "Stack Algorithm" property. A class of page replacement algorithms is called a stack algorithm if the set of pages in memory for n frames is always a subset of the set of pages in memory for n+1 frames:
M(n) ⊆ M(n+1).

Stack algorithms CANNOT suffer from Belady's Anomaly.
Examples of Stack Algorithms:
1. LRU (Least Recently Used)
2. Optimal Page Replacement (OPT / MIN / Clairvoyant)

Therefore, neither LRU nor Optimal can EVER exhibit Belady's Anomaly. Students frequently make the mistake of attributing Belady's Anomaly to LRU due to memory tracking overhead, which is factually incorrect.`,
      },
      {
        id: 'chk-os-3',
        documentId: 'doc-os-notes',
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        documentType: 'notes',
        section: 'Chapter 5: Memory Management, Section 5.3 Address Translation',
        page: 72,
        wordCount: 195,
        topics: ['top-paging-tlb'],
        content: `Effective Memory Access Time (EAT) with a Translation Lookaside Buffer (TLB):
Let:
- α = TLB hit ratio (percentage of times virtual page number is found in TLB)
- t = TLB lookup time (typically 1 to 5 nanoseconds)
- m = Main memory access time (typically 50 to 100 nanoseconds)

When a TLB hit occurs (with probability α):
Access time = t + m (lookup in TLB + access single memory location for actual data operand).

When a TLB miss occurs (with probability 1 - α):
Assuming a single-level page table:
Access time = t + m + m = t + 2m (TLB search + memory read of page table entry + memory read of actual data).

Formula:
EAT = α * (t + m) + (1 - α) * (t + 2m)
= t + m + (1 - α) * m.
For two-level page tables, a TLB miss requires two page table accesses plus the data access, leading to t + 3m.`,
      },
      {
        id: 'chk-os-4',
        documentId: 'doc-os-notes',
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        documentType: 'notes',
        section: 'Chapter 5: Memory Management, Section 5.6 Thrashing',
        page: 89,
        wordCount: 165,
        topics: ['top-thrashing'],
        content: `Thrashing occurs when a computer's virtual memory subsystem is in a constant state of paging, rapidly exchanging data between memory and disk storage to the extent that useful CPU execution drops near zero.

Cause:
When the sum of the working sets of all active processes exceeds the total available physical memory:
Σ WSS_i > Total Available Frames.

Remediation:
1. Suspend or swap out some processes to decrease the degree of multiprogramming.
2. Allocate additional frames to processes exceeding their page-fault frequency upper threshold.
Increasing the degree of multiprogramming when thrashing begins exacerbates the problem, because newly admitted processes request even more page frames.`,
      },
      {
        id: 'chk-os-5',
        documentId: 'doc-os-notes',
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        documentType: 'notes',
        section: 'Chapter 3: Synchronization Primitives, Section 3.1 Semaphores',
        page: 32,
        wordCount: 175,
        topics: ['top-semaphores'],
        content: `A semaphore S is an integer variable accessed exclusively through two standard atomic operations: wait() (also known as P) and signal() (also known as V).

Classic definitions:
wait(S) {
    while (S <= 0)
        ; // busy wait or block process in waiting queue
    S--;
}

signal(S) {
    S++;
}

Binary Semaphore: Can take only values 0 and 1. Used to enforce mutual exclusion (mutex).
Counting Semaphore: Can take unrestricted integer values. Used to control access to a finite pool of identical resource instances. The semaphore is initialized to the number of available resources. When a process requests a resource, it executes wait(). When the count drops to 0, subsequent processes block until an instance is released via signal().`,
      },
      {
        id: 'chk-os-6',
        documentId: 'doc-os-past',
        documentName: 'University_Past_Exam_Papers_2022_2024.pdf',
        documentType: 'past_paper',
        section: 'May 2023 End-Term Exam, Question 4(b)',
        page: 4,
        wordCount: 140,
        topics: ['top-deadlocks'],
        content: `Past Paper Problem May 2023 [Weight: 8 marks]:
Consider a system with 3 processes (P0, P1, P2) and 4 instances of resource R. Current allocations are:
P0 holds 1, max need 3
P1 holds 1, max need 2
P2 holds 1, max need 2

Total allocated = 3 instances. Available = 4 - 3 = 1 instance.
Is the system in a safe state?
Solution trace:
Available = 1.
P1 need = 2 - 1 = 1. Since Need(P1) <= Available, P1 can be allocated 1, finishes, and releases its 1 instance. New Available = 2.
Next, P2 need = 2 - 1 = 1 <= 2. P2 finishes and releases 1. New Available = 3.
Finally, P0 need = 3 - 1 = 2 <= 3. P0 finishes.
Safe sequence: <P1, P2, P0>. The system is SAFE.`,
      },
    ],
  },
  {
    id: 'cs301-ml',
    code: 'CS301',
    title: 'Machine Learning & Deep Learning Foundations',
    subject: 'Artificial Intelligence & Data Science',
    targetExam: 'Midterm Assessment & Technical Interviews',
    examDate: '2026-11-20',
    description: 'Comprehensive curriculum on empirical risk minimization, gradient-based optimization, regularization, backpropagation, and diagnostic evaluation.',
    documents: [
      {
        id: 'doc-ml-syl',
        name: 'CS301_Syllabus_Fall.pdf',
        type: 'syllabus',
        uploadedAt: '2026-10-15',
        sizeKb: 130,
        chunkCount: 6,
      },
      {
        id: 'doc-ml-notes',
        name: 'Deep_Learning_Math_Lecture_Notes.pdf',
        type: 'notes',
        uploadedAt: '2026-10-16',
        sizeKb: 720,
        chunkCount: 18,
      },
    ],
    units: [
      {
        id: 'unit-ml-1',
        number: 1,
        title: 'Supervised Learning & Optimization',
        description: 'Loss surfaces, gradient descent variations, momentum, and learning rate scheduling.',
        topics: [
          {
            id: 'top-loss-opt',
            unitId: 'unit-ml-1',
            unitTitle: 'Supervised Learning & Optimization',
            title: 'Gradient Descent & Adaptive Optimizers (Adam, RMSProp)',
            description: 'Stochastic vs batch gradient descent, exponentially weighted moving averages, bias correction in Adam.',
            examWeightagePercent: 25,
            estimatedStudyMins: 100,
            keyConcepts: ['Stochastic Gradient Descent (SGD)', 'Momentum vs NAG', 'RMSProp adaptive learning rates', 'Adam first and second moment bias correction'],
            masteryLevel: 'STRONG',
            masteryScore: 88,
            questionsAttempted: 5,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
        ],
      },
      {
        id: 'unit-ml-2',
        number: 2,
        title: 'Generalization, Regularization & Bias-Variance',
        description: 'Overfitting prevention, L1/L2 penalties, dropout mechanics, and validation strategies.',
        topics: [
          {
            id: 'top-regularization',
            unitId: 'unit-ml-2',
            unitTitle: 'Generalization, Regularization & Bias-Variance',
            title: 'L1 (Lasso) vs L2 (Ridge) Regularization & Weight Decay',
            description: 'Geometric interpretation of sparsity in L1, L2 weight decay shrinkage, effects on high-dimensional collinear features.',
            examWeightagePercent: 30,
            estimatedStudyMins: 110,
            keyConcepts: ['L1 L1-norm diamond constraint & coordinate axes sparsity', 'L2 circular constraint & uniform weight shrinkage', 'Weight decay equivalent in SGD with momentum', 'Dropout as implicit ensemble'],
            masteryLevel: 'WEAK',
            masteryScore: 42,
            questionsAttempted: 6,
            questionsCorrect: 2,
            detectedMisconceptions: [
              'Assuming L2 regularization sets non-important weights exactly to zero (which only L1 does).',
              'Believing dropout should be active during test/inference time without scaling.',
            ],
          },
        ],
      },
      {
        id: 'unit-ml-3',
        number: 3,
        title: 'Deep Neural Architectures & Backpropagation',
        description: 'Multi-layer perceptrons, computational graphs, vanishing/exploding gradients, and activation functions.',
        topics: [
          {
            id: 'top-backprop',
            unitId: 'unit-ml-3',
            unitTitle: 'Deep Neural Architectures & Backpropagation',
            title: 'Backpropagation & Vanishing Gradient Dynamics',
            description: 'Jacobian chain rule, saturation of sigmoid/tanh activations, dying ReLU problem, and residual skip connections.',
            examWeightagePercent: 25,
            estimatedStudyMins: 95,
            keyConcepts: ['Chain Rule on Computational Graphs', 'Sigmoid derivative saturation (max 0.25)', 'Dying ReLU condition & Leaky ReLU', 'Vanishing vs Exploding Gradients in Deep Networks'],
            masteryLevel: 'WEAK',
            masteryScore: 35,
            questionsAttempted: 5,
            questionsCorrect: 1,
            detectedMisconceptions: [
              'Believing the sigmoid function can be stacked in 10+ layers without severe gradient vanishing.',
              'Assuming ReLU activations cannot suffer from dead neuron states where gradients become identically zero.',
            ],
          },
        ],
      },
    ],
    chunks: [
      {
        id: 'chk-ml-1',
        documentId: 'doc-ml-notes',
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 3: Regularization for Deep Models, Section 3.2',
        page: 54,
        wordCount: 190,
        topics: ['top-regularization'],
        content: `Comparing L1 and L2 Regularization:
L1 Regularization (Lasso): Adds penalty Ω(θ) = λ ||w||_1 = λ Σ |w_i|.
Geometrically, the contours of the L1 penalty are polyhedra (diamonds in 2D) with sharp corners on the coordinate axes. When the elliptical contours of the unregularized loss intersect this constraint region, the intersection frequently occurs at a corner where one or more weights are exactly zero. Hence, L1 induces sparsity and acts as feature selection.

L2 Regularization (Ridge / Weight Decay): Adds penalty Ω(θ) = 1/2 λ ||w||_2^2 = 1/2 λ Σ w_i^2.
The constraint region is a smooth hypersphere (circle in 2D). The intersection with loss contours shrinks weights towards zero proportionally, but rarely sets them identically to zero.
Common student misconception: L2 causes sparse feature selection. That is false; only L1 produces exact zeroes.`,
      },
      {
        id: 'chk-ml-2',
        documentId: 'doc-ml-notes',
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 2: Optimization for Deep Models, Section 2.4 Adam',
        page: 38,
        wordCount: 175,
        topics: ['top-loss-opt'],
        content: `Adam (Adaptive Moment Estimation) combines ideas from Momentum and RMSProp:
First moment: m_t = β_1 * m_{t-1} + (1 - β_1) * g_t
Second moment: v_t = β_2 * v_{t-1} + (1 - β_2) * g_t^2

Bias Correction:
Since m_0 and v_0 are initialized as zero vectors, the estimators m_t and v_t are biased towards zero, especially during early time steps when β_1 and β_2 are close to 1 (typically 0.9 and 0.999).
To counteract this bias:
m_hat_t = m_t / (1 - β_1^t)
v_hat_t = v_t / (1 - β_2^t)
Parameter update: θ_t = θ_{t-1} - α * m_hat_t / (sqrt(v_hat_t) + ε).`,
      },
      {
        id: 'chk-ml-3',
        documentId: 'doc-ml-notes',
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 4: Gradient Flow & Activation Functions, Section 4.1',
        page: 62,
        wordCount: 185,
        topics: ['top-backprop'],
        content: `Vanishing Gradients in Deep Neural Networks:
Consider a network with L layers using activation function σ(z):
dL/dz_1 = (dL/dz_L) * Π_{k=1}^{L-1} (W_{k+1}^T * diag(σ'(z_k))).

For the standard logistic sigmoid function σ(z) = 1 / (1 + e^{-z}):
Its derivative is σ'(z) = σ(z)(1 - σ(z)).
The maximum value of σ'(z) occurs at z = 0, where σ'(0) = 0.5 * 0.5 = 0.25.
Because σ'(z) <= 0.25 everywhere, multiplying (<= 0.25) across many layers causes the gradient to vanish exponentially towards zero as it propagates back to the earlier layers: (0.25)^10 ≈ 9.5e-7.
Remedies include ReLU activations (where derivative is 1 for z > 0), batch normalization, and residual skip connections.`,
      },
    ],
  },
];

export const GROUNDED_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'cs201-os': [
    {
      id: 'q-os-1',
      topicId: 'top-page-replacement',
      topicTitle: 'Page Replacement Algorithms & Belady’s Anomaly',
      unitTitle: 'Virtual Memory & Page Replacement',
      questionText: 'Which of the following page replacement algorithms is mathematically immune to Belady’s Anomaly, and what is the underlying formal reason?',
      options: [
        {
          id: 'opt-a',
          text: 'FIFO (First-In, First-Out), because older pages have already completed their execution cycles.',
          isMisconception: true,
          misconceptionExplanation: 'FIFO is the classic algorithm that suffers from Belady’s Anomaly when frame allocation increases.',
        },
        {
          id: 'opt-b',
          text: 'LRU (Least Recently Used), because it belongs to the class of Stack Algorithms where M(n) ⊆ M(n+1).',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: 'Second Chance (Clock) algorithm, because the reference bit resets prevent fault spikes.',
          isMisconception: true,
          misconceptionExplanation: 'Clock algorithm is a variant of FIFO and does not strictly satisfy the stack algorithm inclusion property.',
        },
        {
          id: 'opt-d',
          text: 'None of them; all page replacement algorithms suffer from Belady’s Anomaly under pathological reference strings.',
          isMisconception: true,
          misconceptionExplanation: 'This is a common misconception. Stack algorithms (LRU, Optimal) are mathematically proven to be immune.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'LRU is a stack algorithm. By definition, in any stack algorithm, the set of pages in memory for n frames is always a strict subset of the pages in memory for n+1 frames [M(n) ⊆ M(n+1)]. Therefore, adding frames can never cause additional page faults.',
      difficulty: 'HARD',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        section: 'Chapter 5: Memory Management, Section 5.4 Page Replacement',
        page: 78,
        sourceSnippet: 'A class of page replacement algorithms is called a stack algorithm if the set of pages in memory for n frames is always a subset of the set of pages in memory for n+1 frames: M(n) ⊆ M(n+1). Stack algorithms CANNOT suffer from Belady’s Anomaly. Examples: LRU and Optimal.',
      },
    },
    {
      id: 'q-os-2',
      topicId: 'top-deadlocks',
      topicTitle: 'Deadlock Characterization & Banker’s Algorithm',
      unitTitle: 'Process Synchronization & Concurrency',
      questionText: 'A system’s current resource allocation state is determined to be "Unsafe" by the Banker’s Algorithm. What does this immediately imply?',
      options: [
        {
          id: 'opt-a',
          text: 'The system is already deadlocked, and at least one process has hung.',
          isMisconception: true,
          misconceptionExplanation: 'Unsafe is not deadlock! The system can still run to completion if processes do not request their maximum declared resources simultaneously.',
        },
        {
          id: 'opt-b',
          text: 'The operating system cannot guarantee avoidance of deadlock if all processes simultaneously request their maximum claim.',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: 'A circular wait condition exists across all active processes.',
          isMisconception: true,
          misconceptionExplanation: 'Circular wait may not have materialized yet; it only manifests if subsequent resource requests cannot be granted.',
        },
        {
          id: 'opt-d',
          text: 'The Resource Allocation Graph contains a cycle with only single-instance resources.',
          isMisconception: true,
          misconceptionExplanation: 'Banker’s algorithm is used for multiple-instance resources; single-instance systems use simple wait-for graph cycle detection.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'An unsafe state is not a deadlock. An unsafe state merely indicates that the OS cannot guarantee that a sequence of future allocations exists to satisfy all maximum potential claims. Deadlock is a strict subset of unsafe states.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        section: 'Chapter 4: Deadlocks, Section 4.2',
        page: 45,
        sourceSnippet: 'CRITICAL DISTINCTION: An unsafe state is NOT synonymous with deadlock. A system in an unsafe state is not necessarily deadlocked; an unsafe state is merely a state from which the system cannot guarantee that all processes will finish without entering deadlock.',
      },
    },
    {
      id: 'q-os-3',
      topicId: 'top-paging-tlb',
      topicTitle: 'Paging Hardware & TLB Effective Access Time',
      unitTitle: 'Virtual Memory & Page Replacement',
      questionText: 'In a single-level paging system, TLB lookup takes 20 ns and main memory access takes 100 ns. If the TLB hit ratio is 80%, what is the Effective Memory Access Time (EAT)?',
      options: [
        {
          id: 'opt-a',
          text: '120 ns',
          isMisconception: true,
          misconceptionExplanation: '120 ns represents only the TLB hit path (20ns + 100ns), omitting the 20% miss penalty.',
        },
        {
          id: 'opt-b',
          text: '140 ns',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: '180 ns',
          isMisconception: true,
          misconceptionExplanation: 'Calculated using a 2-level page table instead of single-level paging.',
        },
        {
          id: 'opt-d',
          text: '100 ns',
          isMisconception: true,
          misconceptionExplanation: 'Ignored the TLB lookup time entirely.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'EAT = α * (t + m) + (1 - α) * (t + 2m). EAT = 0.8 * (20 + 100) + 0.2 * (20 + 200) = 0.8 * 120 + 0.2 * 220 = 96 + 44 = 140 ns.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        section: 'Chapter 5: Memory Management, Section 5.3 Address Translation',
        page: 72,
        sourceSnippet: 'Formula: EAT = α * (t + m) + (1 - α) * (t + 2m) = t + m + (1 - α) * m. For TLB miss with single-level page table, access time is t + 2m.',
      },
    },
    {
      id: 'q-os-4',
      topicId: 'top-thrashing',
      topicTitle: 'Thrashing & Working Set Strategy',
      unitTitle: 'Virtual Memory & Page Replacement',
      questionText: 'When the operating system detects that CPU utilization is plummeting due to thrashing, what is the correct corrective action?',
      options: [
        {
          id: 'opt-a',
          text: 'Increase the degree of multiprogramming to feed more processes to the CPU.',
          isMisconception: true,
          misconceptionExplanation: 'This is the exact flawed logic that triggers thrashing in naive schedulers! More processes demand more frames, worsening page faults.',
        },
        {
          id: 'opt-b',
          text: 'Decrease the degree of multiprogramming by swapping out or suspending some active processes.',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: 'Switch the page replacement algorithm to FIFO to speed up eviction.',
          isMisconception: true,
          misconceptionExplanation: 'FIFO would likely increase page faults due to lack of recency tracking and risk of Belady’s anomaly.',
        },
        {
          id: 'opt-d',
          text: 'Shrink the working set window size Δ to zero.',
          isMisconception: true,
          misconceptionExplanation: 'Setting Δ to zero implies a process requires 0 frames, causing instant page faults on every instruction.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'Thrashing occurs when total working set sizes exceed physical frames (Σ WSS_i > Total Frames). To recover, the OS must decrease multiprogramming by suspending some processes and distributing their frames to the remaining processes.',
      difficulty: 'EASY',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        section: 'Chapter 5: Memory Management, Section 5.6 Thrashing',
        page: 89,
        sourceSnippet: 'Remediation: Suspend or swap out some processes to decrease the degree of multiprogramming. Allocate additional frames to processes exceeding their page-fault frequency upper threshold.',
      },
    },
    {
      id: 'q-os-5',
      topicId: 'top-semaphores',
      topicTitle: 'Semaphores & Classical IPC Problems',
      unitTitle: 'Process Synchronization & Concurrency',
      questionText: 'In Dijkstra’s semaphore specification, what happens when a thread executes wait(S) on a counting semaphore whose current integer value is 0?',
      options: [
        {
          id: 'opt-a',
          text: 'The operation returns an error code -1 and the thread continues executing.',
          isMisconception: true,
          misconceptionExplanation: 'Standard wait(S) does not return immediately on zero unless explicitly configured as non-blocking try_wait().',
        },
        {
          id: 'opt-b',
          text: 'The thread is blocked and placed into the waiting queue associated with semaphore S.',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: 'The semaphore integer counter is decremented to -1 and the calling thread immediately enters the critical section.',
          isMisconception: true,
          misconceptionExplanation: 'If it entered the critical section at 0, mutual exclusion would be breached.',
        },
        {
          id: 'opt-d',
          text: 'The thread automatically preempts the thread currently holding the resource.',
          isMisconception: true,
          misconceptionExplanation: 'Semaphores do not provide automatic preemption of active resource holders.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'The wait() operation tests if S <= 0. If so, the executing process/thread blocks until another thread increments S via signal().',
      difficulty: 'EASY',
      cognitiveLevel: 'RECALL',
      citation: {
        documentName: 'Operating_Systems_Lecture_Notes_Prof_Tanenbaum_Style.pdf',
        section: 'Chapter 3: Synchronization Primitives, Section 3.1 Semaphores',
        page: 32,
        sourceSnippet: 'wait(S) { while (S <= 0) ; // busy wait or block process in waiting queue; S--; } When the count drops to 0, subsequent processes block until an instance is released via signal().',
      },
    },
    {
      id: 'q-os-6',
      topicId: 'top-deadlocks',
      topicTitle: 'Deadlock Characterization & Banker’s Algorithm',
      unitTitle: 'Process Synchronization & Concurrency',
      questionText: 'According to past university exam patterns (May 2023 Q4), if 3 processes share 4 units of resource R, and each process needs at most 2 units, can a deadlock occur?',
      options: [
        {
          id: 'opt-a',
          text: 'Yes, if all three processes hold 1 unit simultaneously and request their second unit.',
          isMisconception: true,
          misconceptionExplanation: 'If 3 processes hold 1 unit each, 3 units are allocated. 4 - 3 = 1 unit remains free! That 1 free unit allows at least one process to finish.',
        },
        {
          id: 'opt-b',
          text: 'No, deadlock is impossible because with 4 instances and Max_i = 2, at least one process is always guaranteed to satisfy its maximum demand.',
          isMisconception: false,
        },
        {
          id: 'opt-c',
          text: 'Yes, because the Coffman circular wait condition holds for any number of processes greater than 2.',
          isMisconception: true,
          misconceptionExplanation: 'Circular wait cannot be sustained when total resources R >= Σ(Max_i - 1) + 1. Here: (2-1)*3 + 1 = 4 <= 4.',
        },
        {
          id: 'opt-d',
          text: 'It depends entirely on whether preemption is enabled by the kernel scheduler.',
          isMisconception: true,
          misconceptionExplanation: 'Even without preemption, sufficient resource availability guarantees progress without deadlock.',
        },
      ],
      correctOptionId: 'opt-b',
      explanation: 'The condition for deadlock-freedom: Total Resources R >= Σ(Max_i - 1) + 1. Here, with 3 processes and Max = 2 each: (2 - 1) * 3 + 1 = 4. Since the system has 4 units, at worst each holds 1 unit (3 allocated), leaving 1 free unit. That free unit enables one process to complete, release its 2 units, and cascade to completion.',
      difficulty: 'HARD',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'University_Past_Exam_Papers_2022_2024.pdf',
        section: 'May 2023 End-Term Exam, Question 4(b)',
        page: 4,
        sourceSnippet: 'Total allocated = 3 instances. Available = 4 - 3 = 1 instance. P1 need = 2 - 1 = 1 <= Available. Safe sequence: <P1, P2, P0>. The system is SAFE.',
      },
    },
  ],
  'cs301-ml': [
    {
      id: 'q-ml-1',
      topicId: 'top-regularization',
      topicTitle: 'L1 (Lasso) vs L2 (Ridge) Regularization & Weight Decay',
      unitTitle: 'Generalization, Regularization & Bias-Variance',
      questionText: 'Why does L1 regularization (Lasso) generate sparse weight vectors with exact zeroes, whereas L2 regularization (Ridge) does not?',
      options: [
        {
          id: 'opt-ml-a',
          text: 'L1 regularization shrinks all weights uniformly by dividing by the gradient variance.',
          isMisconception: true,
          misconceptionExplanation: 'L1 applies a constant force (-λ * sign(w)), not variance division.',
        },
        {
          id: 'opt-ml-b',
          text: 'The geometric constraint region of L1 is a polyhedron with vertices along the coordinate axes where loss contours frequently touch.',
          isMisconception: false,
        },
        {
          id: 'opt-ml-c',
          text: 'L2 regularization sets non-important weights exactly to zero during backpropagation clipping.',
          isMisconception: true,
          misconceptionExplanation: 'L2 shrinks weights asymptotically towards zero, but almost never drives them exactly to zero.',
        },
        {
          id: 'opt-ml-d',
          text: 'L1 regularization disables neurons at test time like dropout.',
          isMisconception: true,
          misconceptionExplanation: 'Dropout is an activation regularization technique, distinct from weight penalties.',
        },
      ],
      correctOptionId: 'opt-ml-b',
      explanation: 'The L1 norm constraint ||w||_1 <= C forms a diamond/polyhedron whose sharp corners lie on the axes where weight coordinates equal 0. Loss function contours hit these corners with high probability, setting weights exactly to zero.',
      difficulty: 'HARD',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        section: 'Chapter 3: Regularization for Deep Models, Section 3.2',
        page: 54,
        sourceSnippet: 'The contours of the L1 penalty are polyhedra (diamonds in 2D) with sharp corners on the coordinate axes. The intersection frequently occurs at a corner where one or more weights are exactly zero. Hence, L1 induces sparsity.',
      },
    },
    {
      id: 'q-ml-2',
      topicId: 'top-loss-opt',
      topicTitle: 'Gradient Descent & Adaptive Optimizers (Adam, RMSProp)',
      unitTitle: 'Supervised Learning & Optimization',
      questionText: 'In the Adam optimizer, why are bias corrections (m_hat = m / (1 - β1^t) and v_hat = v / (1 - β2^t)) mathematically required?',
      options: [
        {
          id: 'opt-ml-2a',
          text: 'Because moment vectors m and v are initialized as zeros, making initial estimates heavily biased toward zero.',
          isMisconception: false,
        },
        {
          id: 'opt-ml-2b',
          text: 'To prevent gradient explosion when the learning rate exceeds 1.0.',
          isMisconception: true,
          misconceptionExplanation: 'Gradient clipping prevents explosion, not exponential moving average bias correction.',
        },
        {
          id: 'opt-ml-2c',
          text: 'To ensure weight matrices remain orthogonal throughout training.',
          isMisconception: true,
          misconceptionExplanation: 'Adam does not enforce orthogonality constraints.',
        },
        {
          id: 'opt-ml-2d',
          text: 'To dynamically increase mini-batch batch sizes.',
          isMisconception: true,
          misconceptionExplanation: 'Mini-batch size is a data loader hyperparameter unaffected by moment estimates.',
        },
      ],
      correctOptionId: 'opt-ml-2a',
      explanation: 'Since m_0 and v_0 are initialized to zero vectors, their expectation E[m_t] = E[g_t](1 - β_1^t). Dividing by (1 - β_1^t) corrects the estimator so E[m_hat_t] = E[g_t].',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        section: 'Chapter 2: Optimization for Deep Models, Section 2.4 Adam',
        page: 38,
        sourceSnippet: 'Since m_0 and v_0 are initialized as zero vectors, the estimators m_t and v_t are biased towards zero, especially during early time steps. To counteract this: m_hat_t = m_t / (1 - β_1^t).',
      },
    },
    {
      id: 'q-ml-3',
      topicId: 'top-regularization',
      topicTitle: 'L1 (Lasso) vs L2 (Ridge) Regularization & Weight Decay',
      unitTitle: 'Generalization, Regularization & Bias-Variance',
      questionText: 'When using Inverted Dropout with keep-probability p = 0.8 during training, what must be done to neuron activations during inference?',
      options: [
        {
          id: 'opt-ml-3a',
          text: 'Drop 20% of the neurons randomly at test time.',
          isMisconception: true,
          misconceptionExplanation: 'Dropout is disabled during inference to ensure deterministic predictions.',
        },
        {
          id: 'opt-ml-3b',
          text: 'Leave activations unscaled and unchanged (identity pass).',
          isMisconception: false,
        },
        {
          id: 'opt-ml-3c',
          text: 'Multiply each activation by 0.8 during inference.',
          isMisconception: true,
          misconceptionExplanation: 'This is traditional dropout! Inverted dropout divides activations by p during training, so test time needs NO scaling.',
        },
        {
          id: 'opt-ml-3d',
          text: 'Divide all weights by the number of hidden layers.',
          isMisconception: true,
          misconceptionExplanation: 'Weight rescaling across layers is unrelated to inverted dropout mechanics.',
        },
      ],
      correctOptionId: 'opt-ml-3b',
      explanation: 'Inverted Dropout divides active neurons by p during training: h = (mask * h) / p. This preserves the expected activation sum, meaning NO scaling or modification is needed at test time.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        section: 'Chapter 3: Regularization for Deep Models, Section 3.2',
        page: 54,
        sourceSnippet: 'Common student misconception: Assuming dropout scaling is always needed at test time. With inverted dropout, scaling is performed at train time so inference remains a pure identity operation.',
      },
    },
    {
      id: 'q-ml-4',
      topicId: 'top-backprop',
      topicTitle: 'Backpropagation & Vanishing Gradient Dynamics',
      unitTitle: 'Deep Neural Architectures & Backpropagation',
      questionText: 'Why does stacking multiple standard sigmoid activations σ(z) lead to vanishing gradients in deep networks?',
      options: [
        {
          id: 'opt-ml-4a',
          text: 'The maximum derivative of the logistic sigmoid is 0.25, so repeated chain-rule multiplication causes gradients to decay exponentially toward zero.',
          isMisconception: false,
        },
        {
          id: 'opt-ml-4b',
          text: 'Sigmoid produces negative outputs that cancel out backward gradient updates.',
          isMisconception: true,
          misconceptionExplanation: 'The sigmoid range is strictly (0, 1) and never negative.',
        },
        {
          id: 'opt-ml-4c',
          text: 'Sigmoid is non-differentiable at zero like ReLU.',
          isMisconception: true,
          misconceptionExplanation: 'Sigmoid is smooth and infinitely differentiable everywhere.',
        },
        {
          id: 'opt-ml-4d',
          text: 'Sigmoid produces unbounded exploding outputs.',
          isMisconception: true,
          misconceptionExplanation: 'Sigmoid is bounded between 0 and 1, preventing explosion in activations.',
        },
      ],
      correctOptionId: 'opt-ml-4a',
      explanation: 'σ’(z) = σ(z)(1 - σ(z)). At z=0, σ’(0) = 0.5 * 0.5 = 0.25. Across 10 layers, the backpropagated gradient is multiplied by numbers <= 0.25, shrinking by (0.25)^10 ≈ 10^-6.',
      difficulty: 'HARD',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        section: 'Chapter 4: Gradient Flow & Activation Functions, Section 4.1',
        page: 62,
        sourceSnippet: 'The maximum value of σ\'(z) occurs at z = 0, where σ\'(0) = 0.25. Because σ\'(z) <= 0.25 everywhere, multiplying across many layers causes the gradient to vanish exponentially towards zero.',
      },
    },
    {
      id: 'q-ml-5',
      topicId: 'top-backprop',
      topicTitle: 'Backpropagation & Vanishing Gradient Dynamics',
      unitTitle: 'Deep Neural Architectures & Backpropagation',
      questionText: 'Can a network using ReLU activations still suffer from gradient stagnation during backpropagation?',
      options: [
        {
          id: 'opt-ml-5a',
          text: 'No, because ReLU derivatives are always strictly positive regardless of input.',
          isMisconception: true,
          misconceptionExplanation: 'For z < 0, the ReLU derivative is exactly 0, so the neuron cannot pass any gradient.',
        },
        {
          id: 'opt-ml-5b',
          text: 'Yes, if a neuron gets pushed into the z < 0 regime for all inputs, its gradient becomes identically zero ("Dying ReLU").',
          isMisconception: false,
        },
        {
          id: 'opt-ml-5c',
          text: 'No, because backpropagation automatically skips inactive layers.',
          isMisconception: true,
          misconceptionExplanation: 'Backpropagation computes the exact chain rule through all layers without skipping.',
        },
        {
          id: 'opt-ml-5d',
          text: 'Yes, but only if the loss function is binary cross-entropy.',
          isMisconception: true,
          misconceptionExplanation: 'Dying ReLU depends on the pre-activation input sign, not the choice of loss function.',
        },
      ],
      correctOptionId: 'opt-ml-5b',
      explanation: 'When a large gradient update causes a ReLU neuron to output negative values across the dataset, its derivative stays 0 forever, rendering the neuron permanently dead.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Deep_Learning_Math_Lecture_Notes.pdf',
        section: 'Chapter 4: Gradient Flow & Activation Functions, Section 4.1',
        page: 62,
        sourceSnippet: 'Common misconception: Assuming ReLU activations cannot suffer from dead neuron states. If z < 0, the gradient is 0.',
      },
    },
  ],
};
