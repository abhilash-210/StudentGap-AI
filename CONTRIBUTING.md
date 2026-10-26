# Contributing to GapFinder AI

Thank you for your interest in contributing to **GapFinder AI**! We welcome improvements, bug fixes, and feature enhancements.

---

## Code of Conduct
Please maintain a respectful, constructive, and inclusive environment for all contributors and evaluators.

---

## Development Workflow

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/abhilash-210/StudentGap-AI.git
   cd StudentGap-AI
   ```

2. **Branching**:
   Create a focused feature branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Code Style & Guidelines**:
   - Use TypeScript with explicit interfaces defined in `src/types/index.ts`.
   - Follow clean React architectural patterns (avoid calling `setState` inside `useEffect` unnecessarily).
   - Ensure components adapt gracefully to light and dark themes using Tailwind CSS classes.
   - Ground all quiz questions and citations in source documents.

6. **Quality Verification**:
   Before committing, verify that linting and build checks pass with zero errors:
   ```bash
   npm run lint
   npm run build
   ```

7. **Submit a Pull Request**:
   Push your branch and open a PR with a clear summary of changes, motivation, and verification steps.
