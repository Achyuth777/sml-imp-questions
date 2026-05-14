# SML Exam Hub 🎓

A premium, production-grade exam preparation platform for **Statistical Machine Learning** — built with Next.js 14, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **Global search** across all questions and answers (debounced, ranked)
- **5 full units** with expandable question cards (2M / 5M / 10M)
- **Important Questions** section with most-repeated detection
- **Previous Year Papers** (CT1 + CT2) from your uploaded ZIP — with show/hide answers
- **Cheat Sheets** — formulas for all 5 units, copy to clipboard
- **Mark as Completed** — LocalStorage-based progress tracking
- **Progress ring widget** — floating % tracker with reset
- **Revision Mode** — filters to important-only questions
- **Dark / Light mode** — persisted, no flash on load
- **Mobile-first** — sticky sidebar with overlay on small screens
- **Copy to clipboard** on every question

---

## 🗂 Folder Structure

```
sml-exam-hub/
├── app/
│   ├── layout.tsx          # Root layout, fonts, FOUC-prevention script
│   ├── page.tsx            # Server component — loads all JSON data
│   ├── MainClient.tsx      # Client shell — routing, search, sidebar state
│   └── globals.css         # Design tokens (CSS vars), base styles
├── components/
│   ├── Sidebar.tsx         # Sticky sidebar with progress + nav
│   ├── Header.tsx          # Top bar — search input + theme toggle
│   ├── QuestionCard.tsx    # Expandable Q&A card with tags, copy, done
│   ├── OverviewSection.tsx # Stats, exam pattern, topics
│   ├── UnitSection.tsx     # Per-unit filtered question listing
│   ├── ImportantSection.tsx# Repeated + important questions
│   ├── PYQSection.tsx      # Previous year papers with answer reveal
│   ├── CheatSheetsSection.tsx # Formula cards per unit
│   ├── SearchResultsPanel.tsx # Search overlay with highlighting
│   └── ProgressWidget.tsx  # Floating circular progress ring
├── hooks/
│   ├── useProgress.ts      # LocalStorage progress tracking
│   ├── useSearch.ts        # Debounced search + filter state
│   ├── useTheme.ts         # Dark/light toggle
│   └── useCopyToClipboard.ts
├── lib/
│   └── dataLoader.ts       # Central data access layer (all JSON imports)
├── types/
│   └── index.ts            # All TypeScript interfaces
├── data/
│   ├── units.json          # All 5 units with questions
│   ├── pyq.json            # Previous year papers
│   ├── cheatsheets.json    # Formula cheat sheets
│   └── overview.json       # Subject metadata
└── scripts/
    └── convert_pyq.py      # ZIP → JSON converter script
```

---

## 🚀 Run Locally

```bash
# 1. Clone / unzip the project
cd sml-exam-hub

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

**Node.js 18+** required.

---

## ☁️ Deploy on Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
# Follow prompts — framework auto-detected as Next.js
```

### Option B — GitHub + Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Done! Your site is live at `https://your-app.vercel.app`

No environment variables needed — everything is static JSON.

---

## 📦 How to Add PYQs from the ZIP

### Automatic (recommended)

```bash
# Install dependency
pip install python-docx

# Run the converter (point to extracted ZIP folder)
python3 scripts/convert_pyq.py \
  --input "path/to/Question paper/" \
  --answer-key "path/to/Question paper/ANSWER KEY.docx" \
  --output data/pyq.json
```

Then open `data/pyq.json` and:
1. Set `"unit"` field for each question (e.g. `"Unit 1"`)
2. Add `"tags"` like `["important", "repeated"]` where relevant
3. Save and refresh — the app picks up changes instantly

### Manual

1. Open `data/pyq.json`
2. Add a new paper object following this schema:

```json
{
  "id": "pyq-ct3-set1",
  "exam": "CT3 - Set 1",
  "year": "2024-25",
  "totalMarks": 20,
  "duration": "1 hour",
  "questions": [
    {
      "id": "pyq-ct3s1-q1",
      "question": "Your question here?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "answer": "A) option1",
      "marks": 1,
      "co": 1,
      "bl": 1,
      "unit": "Unit 1",
      "tags": ["MCQ", "important"]
    }
  ]
}
```

---

## ➕ Adding New Questions to Units

Open `data/units.json` and add to the `questions` array of the relevant unit:

```json
{
  "id": "u1q9",
  "question": "Your question?",
  "answer": "Detailed answer here.\n\nUse \\n for line breaks.",
  "type": "10-mark",
  "year": "CT1",
  "tags": ["important", "repeated"],
  "answer_key": "Optional: correct option if MCQ"
}
```

**No UI code changes needed.** The app is data-driven.

---

## 🔧 Scaling to Multiple Subjects

The architecture is ready. Here's the pattern:

### Step 1 — Create a new subject folder

```
data/
├── sml/          ← move current files here
│   ├── units.json
│   ├── pyq.json
│   ├── cheatsheets.json
│   └── overview.json
└── daa/          ← new subject
    ├── units.json
    └── ...
```

### Step 2 — Create a new route

```
app/
├── sml/page.tsx    ← existing
└── daa/page.tsx    ← new subject
```

### Step 3 — Pass subject slug to dataLoader

```ts
// lib/dataLoader.ts
export function getUnits(subject = "sml"): Unit[] {
  return require(`@/data/${subject}/units.json`) as Unit[];
}
```

### Step 4 — Add a subject switcher to the sidebar

The `Sidebar` component accepts a `subjects` prop — add a top-level switcher that sets the active subject and triggers a router push.

---

## 🏗 Architecture Decisions

| Decision | Rationale |
|---|---|
| Server component for data loading | Zero client loading state; JSON bundled at build time |
| CSS custom properties for theming | No Tailwind dark: prefix explosion; smooth transitions |
| `useIntersectionObserver` for active nav | Accurate scroll-spy without scroll event listeners |
| JSON data layer with typed loader | Swap data without touching UI; easy to add subjects |
| No external state library | React state + hooks is sufficient; keeps bundle tiny |
| `pre-wrap` for answers | Preserves line breaks in multi-step answers without MDX |

---

## 📄 License

MIT — free to use, fork, and adapt for any subject.
