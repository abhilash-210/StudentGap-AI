import { CourseMaterial, QuizQuestion } from '@/types';

export const SAMPLE_COURSES: CourseMaterial[] = [
  {
    id: 'cs201-os',
    code: 'CS201',
    title: 'Operating Systems & Concurrency',
    subject: 'Computer Science & Engineering',
    targetExam: 'End-Semester University Exam & GATE CS',
    examDate: '2026-11-15',
    assignedProfessor: 'Dr. Sarah Williams',
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
    id: 'cs202-dbms',
    code: 'CS202',
    title: 'Database Management Systems',
    subject: 'Computer Science & Information Technology',
    targetExam: 'End-Semester University Exam & Technical Certifications',
    examDate: '2026-11-25',
    assignedProfessor: 'Dr. Sarah Williams',
    description: 'Foundational principles of relational database architecture, relational algebra, SQL querying, functional dependencies, normal forms (1NF through BCNF), transaction processing, ACID properties, serializability, two-phase locking (2PL), and crash recovery.',
    documents: [
      {
        id: 'doc-dbms-syl',
        name: 'CS202_Database_Systems_Official_Syllabus.pdf',
        type: 'syllabus',
        uploadedAt: '2026-10-12',
        sizeKb: 135,
        chunkCount: 7,
      },
      {
        id: 'doc-dbms-notes',
        name: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        type: 'notes',
        uploadedAt: '2026-10-14',
        sizeKb: 810,
        chunkCount: 22,
      },
      {
        id: 'doc-dbms-past',
        name: 'DBMS_University_Past_Exam_Questions_2022_2024.pdf',
        type: 'past_paper',
        uploadedAt: '2026-10-16',
        sizeKb: 430,
        chunkCount: 11,
      },
    ],
    units: [
      {
        id: 'unit-db-1',
        number: 1,
        title: 'Database Fundamentals & Conceptual Design',
        description: 'Data models, three-schema architecture, Entity-Relationship (ER) modeling, and relational mapping.',
        topics: [
          {
            id: 'top-db-fund',
            unitId: 'unit-db-1',
            unitTitle: 'Database Fundamentals & Conceptual Design',
            title: 'Database Fundamentals & Architecture',
            description: 'Three-schema ANSI/SPARC architecture, physical and logical data independence, DDL vs DML vs DCL.',
            examWeightagePercent: 8,
            estimatedStudyMins: 45,
            keyConcepts: ['Three-Schema Architecture', 'Logical Data Independence', 'Physical Data Independence', 'DBMS vs File System'],
            masteryLevel: 'STRONG',
            masteryScore: 85,
            questionsAttempted: 4,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
          {
            id: 'top-er-models',
            unitId: 'unit-db-1',
            unitTitle: 'Database Fundamentals & Conceptual Design',
            title: 'ER Models & Extended ER Features',
            description: 'Entities, weak entity sets, cardinalities, participation constraints, specialization, and generalization.',
            examWeightagePercent: 12,
            estimatedStudyMins: 60,
            keyConcepts: ['Weak Entity Sets & Identifying Relationships', 'Cardinality Ratios (1:1, 1:N, M:N)', 'Total vs Partial Participation', 'ER to Relational Table Conversion Rules'],
            masteryLevel: 'MEDIUM',
            masteryScore: 68,
            questionsAttempted: 4,
            questionsCorrect: 3,
            detectedMisconceptions: ['Assuming weak entity sets have their own primary key without the identifying owner.'],
          },
          {
            id: 'top-rel-model',
            unitId: 'unit-db-1',
            unitTitle: 'Database Fundamentals & Conceptual Design',
            title: 'Relational Model & Integrity Constraints',
            description: 'Tuples, domains, super keys, candidate keys, primary keys, foreign keys, and referential integrity actions.',
            examWeightagePercent: 15,
            estimatedStudyMins: 75,
            keyConcepts: ['Candidate Key Minimality', 'Referential Integrity Constraints', 'ON DELETE CASCADE vs SET NULL', 'Domain and Entity Integrity'],
            masteryLevel: 'STRONG',
            masteryScore: 80,
            questionsAttempted: 5,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
        ],
      },
      {
        id: 'unit-db-2',
        number: 2,
        title: 'Relational Query Languages & Relational Design',
        description: 'SQL queries, aggregations, functional dependencies, closure sets, and normal forms (1NF through BCNF).',
        topics: [
          {
            id: 'top-sql-queries',
            unitId: 'unit-db-2',
            unitTitle: 'Relational Query Languages & Relational Design',
            title: 'SQL DDL, DML & Advanced Aggregations',
            description: 'Joins (INNER, LEFT, RIGHT, FULL OUTER), subqueries, GROUP BY, HAVING, and Three-Valued Logic (3VL) with NULL.',
            examWeightagePercent: 15,
            estimatedStudyMins: 80,
            keyConcepts: ['GROUP BY with HAVING vs WHERE', 'Correlated Subqueries', 'NULL comparison semantics (IS NULL vs = NULL)', 'SQL OUTER JOIN nuances'],
            masteryLevel: 'MEDIUM',
            masteryScore: 70,
            questionsAttempted: 5,
            questionsCorrect: 3,
            detectedMisconceptions: ['Using WHERE to filter aggregated columns instead of HAVING.'],
          },
          {
            id: 'top-func-dep',
            unitId: 'unit-db-2',
            unitTitle: 'Relational Query Languages & Relational Design',
            title: 'Functional Dependencies & Attribute Closure',
            description: 'Armstrong axioms, attribute set closure X+, canonical covers, and finding minimal candidate keys algorithmically.',
            examWeightagePercent: 15,
            estimatedStudyMins: 90,
            keyConcepts: ['Armstrong Axioms (Reflexivity, Augmentation, Transitivity)', 'Attribute Closure Computation', 'Candidate Key Derivation', 'Extraneous Attribute Elimination'],
            masteryLevel: 'WEAK',
            masteryScore: 40,
            questionsAttempted: 5,
            questionsCorrect: 2,
            detectedMisconceptions: ['Believing an attribute on the right side of a dependency can never be part of a candidate key.'],
          },
          {
            id: 'top-normalization',
            unitId: 'unit-db-2',
            unitTitle: 'Relational Query Languages & Relational Design',
            title: 'Normalization (1NF, 2NF, 3NF & BCNF)',
            description: 'Lossless join decompositions, dependency preservation, BCNF definition vs 3NF trade-offs, and multi-valued dependencies.',
            examWeightagePercent: 20,
            estimatedStudyMins: 110,
            keyConcepts: ['1NF Atomic Attributes', '2NF No Partial Dependencies', '3NF Transitive Dependency Removal', 'BCNF Superkey Determinant Rule', 'Lossless Join vs Dependency Preservation Trade-off'],
            masteryLevel: 'WEAK',
            masteryScore: 35,
            questionsAttempted: 6,
            questionsCorrect: 2,
            detectedMisconceptions: [
              'Assuming BCNF decomposition always preserves functional dependencies; BCNF guarantees lossless join, but cannot always preserve dependencies.',
              'Confusing prime attributes with super keys in 3NF condition checks.',
            ],
          },
        ],
      },
      {
        id: 'unit-db-3',
        number: 3,
        title: 'Transaction Processing, Concurrency & Recovery',
        description: 'ACID guarantees, conflict serializability, locking protocols (2PL), deadlock handling, and log-based recovery.',
        topics: [
          {
            id: 'top-transactions',
            unitId: 'unit-db-3',
            unitTitle: 'Transaction Processing, Concurrency & Recovery',
            title: 'Transactions & ACID Properties',
            description: 'Atomicity, Consistency, Isolation, Durability, schedule view equivalence, and SQL isolation levels.',
            examWeightagePercent: 10,
            estimatedStudyMins: 60,
            keyConcepts: ['ACID Definitions', 'Dirty Read (Read Uncommitted)', 'Non-repeatable Read (Read Committed)', 'Phantom Read (Repeatable Read vs Serializable)'],
            masteryLevel: 'STRONG',
            masteryScore: 85,
            questionsAttempted: 4,
            questionsCorrect: 4,
            detectedMisconceptions: [],
          },
          {
            id: 'top-concurrency',
            unitId: 'unit-db-3',
            unitTitle: 'Transaction Processing, Concurrency & Recovery',
            title: 'Concurrency Control & Two-Phase Locking (2PL)',
            description: 'Conflict serializability, precedence graphs, Basic 2PL, Strict 2PL, Rigorous 2PL, and cascading rollbacks.',
            examWeightagePercent: 18,
            estimatedStudyMins: 95,
            keyConcepts: ['Precedence Graph Cycle Test', 'Two-Phase Locking (Growing & Shrinking phases)', 'Strict 2PL (Prevents Cascading Aborts)', 'Rigorous 2PL', '2PL Deadlock Potential'],
            masteryLevel: 'WEAK',
            masteryScore: 45,
            questionsAttempted: 5,
            questionsCorrect: 2,
            detectedMisconceptions: [
              'Assuming Basic 2PL prevents deadlocks; 2PL ensures conflict serializability, but can still lead to deadlocks.',
              'Believing Strict 2PL is free from deadlocks.',
            ],
          },
          {
            id: 'top-db-recovery',
            unitId: 'unit-db-3',
            unitTitle: 'Transaction Processing, Concurrency & Recovery',
            title: 'Database Recovery & Write-Ahead Logging (WAL)',
            description: 'Write-Ahead Logging (WAL) protocol, deferred vs immediate database modification, checkpoints, and ARIES recovery algorithm.',
            examWeightagePercent: 12,
            estimatedStudyMins: 70,
            keyConcepts: ['Write-Ahead Logging (WAL) Invariant', 'Checkpoints & Active Transaction Lists', 'Redo vs Undo Phase in Crash Recovery', 'ARIES Algorithm Analysis'],
            masteryLevel: 'MEDIUM',
            masteryScore: 65,
            questionsAttempted: 4,
            questionsCorrect: 3,
            detectedMisconceptions: ['Assuming checkpoints immediately commit uncommitted dirty buffer pages to disk without undo logging.'],
          },
        ],
      },
    ],
    chunks: [
      {
        id: 'chk-db-1',
        documentId: 'doc-dbms-notes',
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 2: Relational Model & Keys, Section 2.3',
        page: 28,
        wordCount: 185,
        topics: ['top-rel-model', 'top-func-dep'],
        content: `Candidate Keys and Superkeys in the Relational Model:
A superkey is any set of attributes within a schema that uniquely identifies each tuple in the relation.
A candidate key is a minimal superkey: a superkey from which no attribute can be removed without losing the uniqueness property.
Every relation must have at least one candidate key. One candidate key is chosen arbitrarily as the primary key.

Referential Integrity:
A foreign key FK in relation R1 referencing primary key PK in relation R2 requires that for every tuple t1 in R1, either t1[FK] is null, or t1[FK] matches the primary key value t2[PK] for some tuple t2 in R2.
Violations of referential integrity on deletion of t2 can be resolved via:
1. RESTRICT/NO ACTION: Reject deletion.
2. CASCADE: Automatically delete matching tuples in R1.
3. SET NULL: Set foreign key attributes in R1 to NULL.`,
      },
      {
        id: 'chk-db-2',
        documentId: 'doc-dbms-notes',
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 4: Relational Database Design & Normalization, Section 4.5 BCNF vs 3NF',
        page: 65,
        wordCount: 220,
        topics: ['top-normalization', 'top-func-dep'],
        content: `Normalization and Normal Forms (3NF vs BCNF):
A relation schema R is in Third Normal Form (3NF) with respect to a set of functional dependencies F if, for every functional dependency X -> A in F+, at least one of the following holds:
1. X -> A is trivial (i.e., A ⊆ X).
2. X is a superkey of R.
3. A is a prime attribute (i.e., A is a member of some candidate key of R).

Boyce-Codd Normal Form (BCNF):
A relation schema R is in BCNF if for every non-trivial functional dependency X -> A in F+, X is a superkey of R.
Notice condition (3) from 3NF is absent in BCNF!

CRITICAL THEOREM & TRADE-OFF:
- Any relation schema can ALWAYS be decomposed into 3NF such that the decomposition is BOTH lossless-join and dependency-preserving.
- Any relation schema can ALWAYS be decomposed into BCNF such that the decomposition is lossless-join, BUT dependency preservation CANNOT ALWAYS BE GUARANTEED.
Common student error: Assuming BCNF decomposition always preserves all functional dependencies. This is mathematically false.`,
      },
      {
        id: 'chk-db-3',
        documentId: 'doc-dbms-notes',
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 6: Transactions & ACID Guarantees, Section 6.2',
        page: 92,
        wordCount: 195,
        topics: ['top-transactions'],
        content: `ACID Properties of Transactions:
1. Atomicity: Either all operations of the transaction are executed to completion, or none are (all-or-nothing). Managed by recovery subsystem.
2. Consistency: Execution of a transaction in isolation preserves database integrity constraints. Responsibility of application programmer and integrity enforcer.
3. Isolation: An executing transaction cannot reveal its uncommitted intermediate updates to other concurrent transactions. Managed by concurrency control subsystem.
4. Durability: Once a transaction commits, its modifications persist permanently in non-volatile storage, even in the event of an immediate system crash. Managed by recovery subsystem.

SQL Standard Isolation Levels and Phenomena:
- READ UNCOMMITTED: Allows Dirty Reads, Non-repeatable Reads, Phantom Reads.
- READ COMMITTED: Prevents Dirty Reads; permits Non-repeatable Reads and Phantoms.
- REPEATABLE READ: Prevents Dirty Reads and Non-repeatable Reads; permits Phantoms.
- SERIALIZABLE: Prevents all anomalies; equivalent to a serial execution schedule.`,
      },
      {
        id: 'chk-db-4',
        documentId: 'doc-dbms-notes',
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 7: Concurrency Control & Two-Phase Locking, Section 7.3',
        page: 110,
        wordCount: 205,
        topics: ['top-concurrency'],
        content: `Concurrency Control: Conflict Serializability & Two-Phase Locking (2PL):
A schedule S is conflict serializable if it is conflict equivalent to some serial schedule S'.
Conflict operations: Two operations on the same data item by different transactions, where at least one operation is a WRITE.
Precedence Graph Test: A schedule is conflict serializable if and only if its precedence graph contains NO directed cycles.

Two-Phase Locking (2PL):
Rule: A transaction must acquire locks in a growing phase (cannot release any lock until all required locks are acquired), and once it releases a single lock, it enters the shrinking phase (cannot acquire any subsequent locks).
Theorem: Any schedule generated by 2PL is guaranteed to be conflict serializable.

CRITICAL MISCONCEPTION:
Does 2PL prevent deadlocks? NO! Basic 2PL is susceptible to deadlocks (e.g. T1 holds lock on A and waits for B, while T2 holds lock on B and waits for A).
Strict 2PL: All exclusive (write) locks are held until transaction commit/abort. Strict 2PL avoids cascading aborts, but STILL DOES NOT PREVENT DEADLOCKS.
Rigorous 2PL: Both shared and exclusive locks are held until end of transaction.`,
      },
      {
        id: 'chk-db-5',
        documentId: 'doc-dbms-notes',
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        documentType: 'notes',
        section: 'Chapter 8: Database Recovery & Log-Based Techniques, Section 8.2',
        page: 128,
        wordCount: 180,
        topics: ['top-db-recovery'],
        content: `Write-Ahead Logging (WAL) and Recovery:
The fundamental WAL invariant states:
1. Before any data item in database cache is updated on disk (flushed), the corresponding log record with the UNDO information must be written to stable non-volatile storage.
2. Before a transaction enters the COMMITTED state, all log records for that transaction (including REDO information) must be flushed to stable log storage.

Checkpoints:
Periodically, the DBMS writes a CHECKPOINT log record to stable storage. This record includes the list of all transactions active at checkpoint time.
Benefit: During crash recovery, the recovery manager does not need to scan the log from the very beginning of history, significantly truncating recovery duration. Transactions that completed before the checkpoint do not need to be redone if their dirty pages were flushed.`,
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
    assignedProfessor: 'Dr. Sarah Williams',
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
  'cs202-dbms': [
    {
      id: 'q-db-1',
      topicId: 'top-normalization',
      topicTitle: 'Normalization (1NF, 2NF, 3NF & BCNF)',
      unitTitle: 'Relational Query Languages & Relational Design',
      questionText: 'When decomposing a relational schema R into Boyce-Codd Normal Form (BCNF), which of the following statements regarding functional dependencies is mathematically TRUE?',
      options: [
        {
          id: 'opt-db-1a',
          text: 'BCNF decomposition is guaranteed to preserve both lossless joins and all original functional dependencies.',
          isMisconception: true,
          misconceptionExplanation: 'This is a classic misconception! While BCNF always guarantees a lossless join, it cannot always preserve all functional dependencies.',
        },
        {
          id: 'opt-db-1b',
          text: 'BCNF decomposition guarantees a lossless join, but dependency preservation is NOT always achievable.',
          isMisconception: false,
        },
        {
          id: 'opt-db-1c',
          text: '3NF guarantees BCNF properties as long as the relation contains no multi-valued dependencies.',
          isMisconception: true,
          misconceptionExplanation: '3NF allows prime attributes on the right-hand side of non-superkey determinants, which BCNF forbids.',
        },
        {
          id: 'opt-db-1d',
          text: 'BCNF decomposition is only possible if the relation has a single composite candidate key.',
          isMisconception: true,
          misconceptionExplanation: 'BCNF decomposition algorithm applies universally regardless of the number of candidate keys.',
        },
      ],
      correctOptionId: 'opt-db-1b',
      explanation: 'Every relational schema can be decomposed into 3NF with both lossless join and dependency preservation. However, decomposing into BCNF guarantees lossless join, but dependency preservation cannot always be satisfied (e.g. schema R(A,B,C) with FDs AB->C, C->B).',
      difficulty: 'HARD',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 4: Relational Database Design & Normalization, Section 4.5',
        page: 65,
        sourceSnippet: 'Any relation schema can ALWAYS be decomposed into BCNF such that the decomposition is lossless-join, BUT dependency preservation CANNOT ALWAYS BE GUARANTEED.',
      },
    },
    {
      id: 'q-db-2',
      topicId: 'top-concurrency',
      topicTitle: 'Concurrency Control & Two-Phase Locking (2PL)',
      unitTitle: 'Transaction Processing, Concurrency & Recovery',
      questionText: 'A database system uses the Basic Two-Phase Locking (2PL) protocol for concurrency control. Which of the following guarantees does Basic 2PL provide?',
      options: [
        {
          id: 'opt-db-2a',
          text: 'It guarantees conflict serializability and completely prevents deadlocks.',
          isMisconception: true,
          misconceptionExplanation: '2PL does NOT prevent deadlocks! Two transactions in the growing phase can easily deadlock waiting for each other’s locks.',
        },
        {
          id: 'opt-db-2b',
          text: 'It guarantees conflict serializability, but transactions may still experience deadlocks and cascading aborts.',
          isMisconception: false,
        },
        {
          id: 'opt-db-2c',
          text: 'It guarantees view serializability only if timestamp ordering is also enforced.',
          isMisconception: true,
          misconceptionExplanation: '2PL mathematically guarantees conflict serializability on its own; timestamp ordering is a separate protocol.',
        },
        {
          id: 'opt-db-2d',
          text: 'It prevents all phantom reads without requiring range or table locks.',
          isMisconception: true,
          misconceptionExplanation: 'Standard tuple-level 2PL does not prevent phantom inserts without index-range or predicate locking.',
        },
      ],
      correctOptionId: 'opt-db-2b',
      explanation: 'Basic 2PL ensures conflict serializability by requiring transactions to acquire all locks before releasing any. However, it does NOT prevent deadlocks (transactions can enter circular wait) and does NOT prevent cascading rollbacks (which requires Strict 2PL).',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 7: Concurrency Control & Two-Phase Locking, Section 7.3',
        page: 110,
        sourceSnippet: 'CRITICAL MISCONCEPTION: Does 2PL prevent deadlocks? NO! Basic 2PL is susceptible to deadlocks. Strict 2PL avoids cascading aborts, but STILL DOES NOT PREVENT DEADLOCKS.',
      },
    },
    {
      id: 'q-db-3',
      topicId: 'top-transactions',
      topicTitle: 'Transactions & ACID Properties',
      unitTitle: 'Transaction Processing, Concurrency & Recovery',
      questionText: 'Transaction T1 reads data item X. Before T1 commits or finishes, concurrent transaction T2 modifies X and commits. If T1 re-reads X and observes the modified value, which isolation anomaly has occurred?',
      options: [
        {
          id: 'opt-db-3a',
          text: 'Dirty Read (Reading uncommitted data)',
          isMisconception: true,
          misconceptionExplanation: 'T2 committed before T1’s second read, so the data is committed. Dirty read occurs when reading UNCOMMITTED data.',
        },
        {
          id: 'opt-db-3b',
          text: 'Non-Repeatable Read (Fuzzy Read)',
          isMisconception: false,
        },
        {
          id: 'opt-db-3c',
          text: 'Phantom Read',
          isMisconception: true,
          misconceptionExplanation: 'Phantom read refers to a query retrieving a different set of rows matching a predicate due to inserts/deletions, not a changed value in an existing row.',
        },
        {
          id: 'opt-db-3d',
          text: 'Lost Update',
          isMisconception: true,
          misconceptionExplanation: 'Lost update happens when two transactions write over the same data without seeing the other’s write.',
        },
      ],
      correctOptionId: 'opt-db-3b',
      explanation: 'A Non-Repeatable Read occurs when a transaction reads the same row twice and obtains different data values because another transaction modified that row and committed in between the reads.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 6: Transactions & ACID Guarantees, Section 6.2',
        page: 92,
        sourceSnippet: 'READ COMMITTED: Prevents Dirty Reads; permits Non-repeatable Reads and Phantoms. REPEATABLE READ: Prevents Dirty Reads and Non-repeatable Reads.',
      },
    },
    {
      id: 'q-db-4',
      topicId: 'top-func-dep',
      topicTitle: 'Functional Dependencies & Attribute Closure',
      unitTitle: 'Relational Query Languages & Relational Design',
      questionText: 'Given relation schema R(A, B, C, D) and functional dependencies F = {A -> B, B -> C, C -> D}. What is the attribute closure of A (A+) and what are the candidate keys of R?',
      options: [
        {
          id: 'opt-db-4a',
          text: 'A+ = {A, B}; Candidate keys are {A, B, C, D}.',
          isMisconception: true,
          misconceptionExplanation: 'By transitivity, A determines B, C, and D, so A+ is {A, B, C, D}.',
        },
        {
          id: 'opt-db-4b',
          text: 'A+ = {A, B, C, D}; The sole candidate key is {A}.',
          isMisconception: false,
        },
        {
          id: 'opt-db-4c',
          text: 'A+ = {A, B, C, D}; Candidate keys are {A} and {D}.',
          isMisconception: true,
          misconceptionExplanation: 'D cannot determine any other attributes; D+ = {D}, so D cannot be a candidate key.',
        },
        {
          id: 'opt-db-4d',
          text: 'A+ = {A, D}; Candidate key is {B, C}.',
          isMisconception: true,
          misconceptionExplanation: 'A closure computation follows Armstrong axioms: A->B, B->C, C->D yields all four attributes.',
        },
      ],
      correctOptionId: 'opt-db-4b',
      explanation: 'Starting with A: A+ = {A}. Using A->B, A+ becomes {A, B}. Using B->C, A+ becomes {A, B, C}. Using C->D, A+ becomes {A, B, C, D}. Since A+ contains all attributes of R, A is a superkey. Since no proper subset of {A} is a superkey, {A} is the minimal candidate key.',
      difficulty: 'EASY',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 2: Relational Model & Keys, Section 2.3',
        page: 28,
        sourceSnippet: 'A candidate key is a minimal superkey: a superkey from which no attribute can be removed without losing the uniqueness property.',
      },
    },
    {
      id: 'q-db-5',
      topicId: 'top-db-recovery',
      topicTitle: 'Database Recovery & Write-Ahead Logging (WAL)',
      unitTitle: 'Transaction Processing, Concurrency & Recovery',
      questionText: 'What is the governing rule of the Write-Ahead Logging (WAL) protocol regarding dirty pages and transaction commit?',
      options: [
        {
          id: 'opt-db-5a',
          text: 'All modified data pages must be written to disk before any log records are flushed.',
          isMisconception: true,
          misconceptionExplanation: 'This is the exact opposite of WAL! Log records MUST precede disk writes of data pages.',
        },
        {
          id: 'opt-db-5b',
          text: 'The log record containing the undo/redo information must be flushed to stable storage BEFORE the corresponding dirty data page is written to disk.',
          isMisconception: false,
        },
        {
          id: 'opt-db-5c',
          text: 'Transactions can only commit after a full system checkpoint has concluded.',
          isMisconception: true,
          misconceptionExplanation: 'Checkpoints run asynchronously in the background and do not block every individual transaction commit.',
        },
        {
          id: 'opt-db-5d',
          text: 'WAL requires in-memory buffer pools to be strictly non-volatile flash RAM.',
          isMisconception: true,
          misconceptionExplanation: 'WAL was explicitly designed to guarantee durability even when buffer pools reside in volatile RAM.',
        },
      ],
      correctOptionId: 'opt-db-5b',
      explanation: 'The Write-Ahead Logging invariant requires: (1) Undo log records must be on stable storage before the dirty data page reaches disk; (2) Redo log records must be on stable storage before the transaction commit record is written.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'CONCEPTUAL',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 8: Database Recovery & Log-Based Techniques, Section 8.2',
        page: 128,
        sourceSnippet: 'The fundamental WAL invariant states: Before any data item in database cache is updated on disk, the corresponding log record with the UNDO information must be written to stable non-volatile storage.',
      },
    },
    {
      id: 'q-db-6',
      topicId: 'top-sql-queries',
      topicTitle: 'SQL DDL, DML & Advanced Aggregations',
      unitTitle: 'Relational Query Languages & Relational Design',
      questionText: 'In standard SQL with Three-Valued Logic (3VL), what is the evaluated result of the condition: WHERE (salary > 50000) OR (bonus IS NULL) for an employee whose salary is 40000 and bonus is NULL?',
      options: [
        {
          id: 'opt-db-6a',
          text: 'FALSE, because salary <= 50000 evaluates to FALSE.',
          isMisconception: true,
          misconceptionExplanation: 'In an OR expression, if one operand evaluates to TRUE, the entire expression evaluates to TRUE.',
        },
        {
          id: 'opt-db-6b',
          text: 'UNKNOWN, because any comparison involving NULL results in UNKNOWN.',
          isMisconception: true,
          misconceptionExplanation: '"IS NULL" is a Boolean operator that evaluates directly to TRUE or FALSE, never UNKNOWN.',
        },
        {
          id: 'opt-db-6c',
          text: 'TRUE, because bonus IS NULL evaluates to TRUE and FALSE OR TRUE evaluates to TRUE.',
          isMisconception: false,
        },
        {
          id: 'opt-db-6d',
          text: 'NULL, because SQL returns NULL on comparisons with missing values.',
          isMisconception: true,
          misconceptionExplanation: '"IS NULL" returns a Boolean truth value, not a NULL.',
        },
      ],
      correctOptionId: 'opt-db-6c',
      explanation: 'salary > 50000 is FALSE (40000 > 50000). bonus IS NULL is TRUE (bonus is indeed NULL). In SQL 3VL, FALSE OR TRUE evaluates to TRUE. The row is selected.',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'PROBLEM_SOLVING',
      citation: {
        documentName: 'Relational_Database_Design_And_Transactions_Notes.pdf',
        section: 'Chapter 2: Relational Model & Keys, Section 2.3',
        page: 28,
        sourceSnippet: 'In SQL 3VL, IS NULL is a definitive boolean test (returns TRUE or FALSE, never UNKNOWN). FALSE OR TRUE evaluates to TRUE.',
      },
    },
  ],
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
