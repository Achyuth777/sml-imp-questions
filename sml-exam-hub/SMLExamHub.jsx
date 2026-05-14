// SML Exam Hub — Full Interactive Preview
// This mirrors the Next.js project exactly, compiled into a single React artifact

import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const OVERVIEW = {
  subject: "Statistical Machine Learning",
  code: "SML", semester: "VI", department: "CSE",
  description: "Comprehensive study of statistical foundations and machine learning algorithms including regression, classification, clustering, and dimensionality reduction techniques.",
  examPattern: {
    CT1: { name: "Continuous Test 1", marks: 20, units: "Unit 1–2" },
    CT2: { name: "Continuous Test 2", marks: 20, units: "Unit 3–5" },
    END: { name: "End Semester Exam", marks: 60, units: "Unit 1–5" },
  },
  importantTopics: ["Ridge vs Lasso Regression","SVM Hyperplane & Kernel Trick","PCA Step-by-Step","K-Means Algorithm","Naive Bayes Classifier"],
  references: ["Pattern Recognition and ML — Bishop","Elements of Statistical Learning — Hastie","Machine Learning — Tom Mitchell"],
};

const UNITS = [
  {
    id:"unit1", unit:"Unit 1", title:"Linear Regression & Regularization", color:"#6366f1",
    topics:["Simple/Multiple Linear Regression","Least Squares Method","Bias-Variance Tradeoff","Ridge (L2)","Lasso (L1)","Elastic Net"],
    summary:"Covers regression analysis fundamentals and regularization techniques to prevent overfitting.",
    questions:[
      { id:"u1q1", question:"What method finds the best fit line in Linear Regression?", answer:"The Least Square Error (OLS) method minimizes the sum of squared residuals: minimize Σ(yᵢ - ŷᵢ)². It is the BLUE estimator under Gauss-Markov assumptions.", type:"2-mark", year:"CT1", tags:["important","repeated"], answer_key:"A) Least Square Error" },
      { id:"u1q2", question:"In terms of bias and variance, what is true when you fit a Degree 2 polynomial?", answer:"Degree 2 polynomial: Bias will be LOW and Variance will be LOW. It balances flexibility (low bias) without overfitting (low variance). Higher degrees → high variance; too low → high bias.", type:"2-mark", year:"CT1", tags:["important","tricky"], answer_key:"D) Bias low, Variance low" },
      { id:"u1q3", question:"For Ridge Regression, if λ = 0, what does it mean?", answer:"λ = 0 in Ridge means: (1) Large coefficients are NOT penalized, (2) Overfitting is not accounted for, (3) The loss becomes identical to OLS. All statements are true.", type:"2-mark", year:"CT1", tags:["important","repeated"], answer_key:"D) All of the above" },
      { id:"u1q4", question:"What is the penalty term for Lasso Regression?", answer:"Lasso uses L1 penalty: the absolute sum of coefficients Σ|βⱼ|. Loss = RSS + λΣ|βⱼ|. Unlike Ridge (L2), Lasso can shrink coefficients to exactly zero, performing feature selection.", type:"2-mark", year:"CT1", tags:["important","repeated"], answer_key:"C) Absolute sum of coefficients" },
      { id:"u1q5", question:"Explain Ridge and Lasso with loss functions and when to use each.", answer:"Ridge (L2): Loss = RSS + λΣβⱼ²  — shrinks toward 0 but never exactly 0. Use when many features are mildly relevant.\n\nLasso (L1): Loss = RSS + λΣ|βⱼ|  — can shrink to exactly 0 (feature selection). Use when few features are truly important.\n\nElastic Net = L1 + L2 combined.", type:"10-mark", year:"CT1-CT2", tags:["important","repeated"] },
    ]
  },
  {
    id:"unit2", unit:"Unit 2", title:"Support Vector Machines", color:"#8b5cf6",
    topics:["Hyperplane & Margin","Support Vectors","Kernel Trick","RBF Kernel","Soft Margin","SVR","Multi-class"],
    summary:"Covers SVMs for classification and regression, including kernel methods for non-linear problems.",
    questions:[
      { id:"u2q1", question:"SVM can be used for _____.", answer:"SVM can be used for both Classification AND Regression. Classification: finds optimal separating hyperplane. Regression (SVR): finds function within ε-tube around data.", type:"2-mark", year:"CT1", tags:["easy","important"], answer_key:"C) Classification and regression both" },
      { id:"u2q2", question:"In SVM, the dimension of the hyperplane depends on which factor?", answer:"The hyperplane dimension depends on NUMBER OF FEATURES. dim(hyperplane) = n_features − 1. So: 2 features → line, 3 features → 2D plane, n features → (n-1)-dim hyperplane.", type:"2-mark", year:"CT2", tags:["important","tricky"], answer_key:"A) Number of features" },
      { id:"u2q3", question:"If number of input features is 2, the hyperplane is a _____.", answer:"With 2 input features, the hyperplane is a LINE. Equation: w₁x₁ + w₂x₂ + b = 0 is a line in 2D space. Dimension = 2 − 1 = 1.", type:"2-mark", year:"CT2", tags:["easy","important"], answer_key:"A) Line" },
      { id:"u2q4", question:"Explain the Kernel Trick in SVM. Describe RBF kernel.", answer:"Kernel Trick: Maps data to higher-dimensional space implicitly using K(xᵢ,xⱼ) = φ(xᵢ)·φ(xⱼ), avoiding explicit computation.\n\nRBF Kernel: K(x,z) = exp(−γ||x−z||²)\n• Most popular kernel\n• γ controls influence radius\n• Small γ → wide influence (underfitting)\n• Large γ → narrow influence (overfitting)", type:"10-mark", year:"CT1", tags:["important","repeated"] },
    ]
  },
  {
    id:"unit3", unit:"Unit 3", title:"Dimensionality Reduction", color:"#06b6d4",
    topics:["PCA","Eigenvectors & Eigenvalues","Covariance Matrix","SVD","Autoencoders","t-SNE"],
    summary:"Techniques to reduce features while preserving maximum information: PCA, SVD, and autoencoders.",
    questions:[
      { id:"u3q1", question:"What is the primary goal of PCA?", answer:"Primary goal: DIMENSIONALITY REDUCTION. PCA transforms high-dimensional data to lower-dimensional space while retaining maximum variance. Finds orthogonal directions of maximum variance (principal components).", type:"2-mark", year:"CT2", tags:["important","easy"], answer_key:"C) Dimensionality reduction" },
      { id:"u3q2", question:"In PCA, what are the principal components?", answer:"Principal components are the EIGENVECTORS of the covariance matrix. They represent directions of maximum variance. First PC captures most variance; second PC (orthogonal to first) captures next most.", type:"2-mark", year:"CT1", tags:["important","repeated"], answer_key:"C) Eigenvectors of covariance matrix" },
      { id:"u3q3", question:"What does SVD provide for a given matrix?", answer:"SVD factorizes matrix A = UΣVᵀ where:\n• U: Left singular vectors (orthogonal)\n• Σ: Diagonal matrix of singular values (σ₁ ≥ σ₂ ≥ ... ≥ 0)\n• Vᵀ: Right singular vectors (orthogonal)\n\nRank of A = number of non-zero singular values.", type:"5-mark", year:"CT2", tags:["important"], answer_key:"c) Factorization U, Σ, Vᵀ" },
      { id:"u3q4", question:"Explain PCA step by step with mathematical formulation.", answer:"1. Standardize: X_std = (X − μ)/σ\n2. Covariance Matrix: C = (1/n-1) XᵀX\n3. Eigen decomposition: C·v = λ·v\n4. Sort eigenvectors by decreasing λ\n5. Select top k eigenvectors → W\n6. Transform: X_pca = X × W\n\nExplained variance ratio = λᵢ / Σλⱼ\nRetain components explaining ≥ 95% variance.", type:"10-mark", year:"CT1-CT2", tags:["important","repeated"] },
    ]
  },
  {
    id:"unit4", unit:"Unit 4", title:"Clustering Algorithms", color:"#10b981",
    topics:["K-Means","DBSCAN","Hierarchical","Mean-Shift","Silhouette Score","Elbow Method"],
    summary:"Unsupervised learning clustering: centroid-based, density-based, and hierarchical approaches.",
    questions:[
      { id:"u4q1", question:"Which clustering algorithm is based on centroids?", answer:"K-MEANS clustering uses centroids. Steps: (1) Initialize k centroids, (2) Assign each point to nearest centroid, (3) Update centroids as cluster means, (4) Repeat until convergence.", type:"2-mark", year:"CT1", tags:["easy","important"], answer_key:"a) K-Means" },
      { id:"u4q2", question:"K-means algorithm: select the correct statements.", answer:"K-means is: (A) UNSUPERVISED learning algorithm ✓ — no labels needed. (B) A CLUSTERING algorithm ✓. It is NOT supervised and NOT a classification algorithm (no ground-truth labels during training).", type:"5-mark", year:"CT1", tags:["important","easy"], answer_key:"A and B" },
      { id:"u4q3", question:"Explain K-Means with limitations and how to choose K.", answer:"Objective: Minimize WCSS = Σᵢ Σₓ∈Cᵢ ||x − μᵢ||²\n\nChoosing K:\n• Elbow Method: plot WCSS vs k\n• Silhouette Score: (b−a)/max(a,b)\n\nLimitations:\n• Must specify k in advance\n• Sensitive to initialization (use K-means++)\n• Assumes spherical clusters\n• Sensitive to outliers\n• Fails on non-convex shapes", type:"10-mark", year:"CT1-CT2", tags:["important","repeated"] },
    ]
  },
  {
    id:"unit5", unit:"Unit 5", title:"Probabilistic Methods & Applications", color:"#f59e0b",
    topics:["Naive Bayes","Bayes Theorem","Random Forest","Ensemble Methods","Spam Classification","Digit Recognition"],
    summary:"Probabilistic classifiers, ensemble methods, and real-world applications.",
    questions:[
      { id:"u5q1", question:"Spam Classification is an example of which algorithm?", answer:"Spam Classification is a classic Naive Bayes example. Uses Bayes' theorem with conditional independence assumption: P(Spam|words) ∝ P(Spam) × ΠP(wordᵢ|Spam). Works extremely well in practice despite the naive assumption.", type:"2-mark", year:"CT1", tags:["easy","important"], answer_key:"a) Naive Bayes" },
      { id:"u5q2", question:"In handwritten digit recognition, what is the purpose of feature extraction?", answer:"Feature extraction extracts RELEVANT INFORMATION from images for classification. Rather than raw pixels, it identifies meaningful patterns: strokes, curves, edges, spatial arrangements. Reduces dimensionality and improves robustness.", type:"2-mark", year:"CT1", tags:["easy","important"], answer_key:"c) Extract relevant info for classification" },
      { id:"u5q3", question:"Explain Naive Bayes with Bayes' theorem and its assumptions.", answer:"Bayes' Theorem: P(C|X) = P(X|C)·P(C) / P(X)\n\nNaive Assumption: Features are conditionally independent given class:\nP(X|C) = P(x₁|C) × P(x₂|C) × ... × P(xₙ|C)\n\nTypes:\n1. Gaussian NB — continuous features\n2. Multinomial NB — word counts (text)\n3. Bernoulli NB — binary features\n\nLaplace Smoothing: P(xᵢ|C) = (count+α)/(N+α·|V|)\nFixes zero-probability problem.", type:"10-mark", year:"CT1-CT2", tags:["important","repeated"] },
    ]
  },
];

const CHEATSHEETS = [
  { id:"cs1", title:"Regression Formulas", unit:"Unit 1", color:"#6366f1", icon:"📐",
    items:[
      {label:"OLS Loss", formula:"L = Σ(yᵢ - ŷᵢ)²", note:"Minimize squared residuals"},
      {label:"Ridge (L2)", formula:"L = RSS + λΣβⱼ²", note:"Shrinks → 0, never = 0"},
      {label:"Lasso (L1)", formula:"L = RSS + λΣ|βⱼ|", note:"Shrinks to exactly 0"},
      {label:"R² Score", formula:"R² = 1 - SS_res/SS_tot", note:"1 = perfect, 0 = baseline"},
      {label:"Bias-Variance", formula:"Error = Bias² + Var + Noise", note:"Core ML tradeoff"},
    ]},
  { id:"cs2", title:"SVM Key Concepts", unit:"Unit 2", color:"#8b5cf6", icon:"⚡",
    items:[
      {label:"Hyperplane", formula:"w·x + b = 0", note:"Decision boundary"},
      {label:"Margin", formula:"M = 2/||w||", note:"Maximize this"},
      {label:"Objective", formula:"Min ½||w||² s.t. yᵢ(w·xᵢ+b) ≥ 1", note:"Constrained optimization"},
      {label:"RBF Kernel", formula:"K(x,z) = exp(−γ||x−z||²)", note:"Most popular kernel"},
      {label:"Hyp. Dim", formula:"dim = n_features − 1", note:"2 features → line"},
    ]},
  { id:"cs3", title:"PCA & SVD Reference", unit:"Unit 3", color:"#06b6d4", icon:"🔢",
    items:[
      {label:"SVD", formula:"A = UΣVᵀ", note:"U, V orthogonal; Σ diagonal"},
      {label:"Covariance", formula:"C = (1/n-1) XᵀX", note:"After mean centering"},
      {label:"Transform", formula:"X_pca = X × W", note:"W = top-k eigenvectors"},
      {label:"Var Ratio", formula:"ratio = λᵢ / Σλⱼ", note:"% variance per component"},
    ]},
  { id:"cs4", title:"Clustering Formulas", unit:"Unit 4", color:"#10b981", icon:"🎯",
    items:[
      {label:"WCSS", formula:"Σᵢ Σₓ∈Cᵢ ||x − μᵢ||²", note:"K-Means objective"},
      {label:"Silhouette", formula:"s = (b−a)/max(a,b)", note:"−1 to 1; higher = better"},
      {label:"Centroid", formula:"μᵢ = (1/|Cᵢ|) Σₓ∈Cᵢ x", note:"Mean of cluster"},
    ]},
  { id:"cs5", title:"Naive Bayes & Probability", unit:"Unit 5", color:"#f59e0b", icon:"🎲",
    items:[
      {label:"Bayes Thm", formula:"P(C|X) = P(X|C)·P(C)/P(X)", note:"Posterior = Likelihood × Prior / Evidence"},
      {label:"Naive Assum.", formula:"P(X|C) = ΠP(xᵢ|C)", note:"Features independent given class"},
      {label:"Laplace", formula:"P(xᵢ|C) = (cnt+α)/(N+α|V|)", note:"Fixes zero probability"},
    ]},
];

const PYQS = [
  { id:"pyq-ct1", exam:"CT1 - Set 1", year:"2024-25", totalMarks:20, duration:"1 hour",
    questions:[
      {id:"p1", question:"The best fit line method for data in Linear Regression?", options:["A) Least Square Error","B) Maximum Likelihood","C) Logarithmic Loss","D) Both A and B"], answer:"A) Least Square Error", unit:"Unit 1", tags:["MCQ","important","repeated"]},
      {id:"p2", question:"In terms of bias and variance, which is true when you fit Degree 2 polynomial?", options:["A) Bias high, variance high","B) Bias low, variance high","C) Bias high, variance low","D) Bias low, variance low"], answer:"D) Bias low, variance low", unit:"Unit 1", tags:["MCQ","important","tricky"]},
      {id:"p3", question:"For Ridge Regression, if λ = 0, what does it mean?", options:["A) Coefficients not penalized","B) Overfitting not accounted","C) Loss same as OLS","D) All of the above"], answer:"D) All of the above", unit:"Unit 1", tags:["MCQ","important"]},
      {id:"p4", question:"Penalty term for Lasso Regression?", options:["A) Square of coefficients","B) Square root","C) Absolute sum of coefficients","D) Sum"], answer:"C) Absolute sum of coefficients", unit:"Unit 1", tags:["MCQ","important","repeated"]},
      {id:"p5", question:"SVM can be used for _____.", options:["A) Classification only","B) Regression only","C) Both","D) Neither"], answer:"C) Both", unit:"Unit 2", tags:["MCQ","easy"]},
      {id:"p6", question:"K-means: select correct statements.", options:["A) Unsupervised learning","B) Clustering algorithm","C) Supervised learning","D) Classification algorithm"], answer:"A and B", unit:"Unit 4", tags:["MCQ","important"]},
      {id:"p7", question:"In PCA, principal components are?", options:["A) Dataset features","B) Eigenvalues of covariance","C) Eigenvectors of covariance","D) Data points"], answer:"C) Eigenvectors of covariance matrix", unit:"Unit 3", tags:["MCQ","important","repeated"]},
      {id:"p8", question:"Clustering algorithm based on centroids?", options:["a) K-Means","b) DBSCAN","c) Agglomerative","d) Mean-Shift"], answer:"a) K-Means", unit:"Unit 4", tags:["MCQ","easy"]},
      {id:"p9", question:"Spam Classification is an example of?", options:["a) Naive Bayes","b) Probabilistic condition","c) Random Forest","d) SVM"], answer:"a) Naive Bayes", unit:"Unit 5", tags:["MCQ","easy","important"]},
      {id:"p10", question:"In handwritten digit recognition, purpose of feature extraction?", options:["a) Convert to binary","b) Resize images","c) Extract relevant info for classification","d) Remove noise"], answer:"c) Extract relevant info for classification", unit:"Unit 5", tags:["MCQ","easy"]},
    ]},
  { id:"pyq-ct2", exam:"CT2 - Set 1", year:"2024-25", totalMarks:20, duration:"1 hour",
    questions:[
      {id:"p11", question:"Which is NOT a simple linear regression model?", options:["a) Salary = a × Experience","b) Salary = a × Experience + b","c) Salary = a × Experience + b × Age","d) All"], answer:"c) Salary = a × Experience + b × Age", unit:"Unit 1", tags:["MCQ","important","easy"]},
      {id:"p12", question:"For Lasso with very high λ, which are true?", options:["A) Selects important features","B) Shrinks coefficients to 0","C) Same as OLS","D) Same as Ridge"], answer:"A and B", unit:"Unit 1", tags:["MCQ","important","repeated"]},
      {id:"p13", question:"In MLR, R² is called the?", options:["a) Coefficient of determination","b) Variance","c) Covariance","d) Cross-product"], answer:"a) Coefficient of determination", unit:"Unit 1", tags:["MCQ","easy"]},
      {id:"p14", question:"In SVM, hyperplane dimension depends on?", options:["A) Number of features","B) Number of samples","C) Target variables","D) All"], answer:"A) Number of features", unit:"Unit 2", tags:["MCQ","important","tricky"]},
      {id:"p15", question:"If input features = 2, SVM hyperplane is a?", options:["A) Line","B) Circle","C) Plane","D) Point"], answer:"A) Line", unit:"Unit 2", tags:["MCQ","easy","important"]},
      {id:"p16", question:"Primary goal of PCA?", options:["A) Classification","B) Clustering","C) Dimensionality reduction","D) Regression"], answer:"C) Dimensionality reduction", unit:"Unit 3", tags:["MCQ","easy","important"]},
      {id:"p17", question:"Relationship between 1st and 2nd principal components?", options:["A) Orthogonal (uncorrelated)","B) Positively correlated","C) Negatively correlated","D) No relationship"], answer:"A) Orthogonal (uncorrelated)", unit:"Unit 3", tags:["MCQ","important"]},
      {id:"p18", question:"What does SVD provide for a matrix?", options:["a) Eigenvalues only","b) Orthogonal basis","c) Factorization U, Σ, Vᵀ","d) Inverse"], answer:"c) Factorization into U, Σ, and Vᵀ", unit:"Unit 3", tags:["MCQ","important"]},
      {id:"p19", question:"How does matrix rank relate to SVD?", options:["a) = non-zero singular values","b) = non-zero rows","c) = columns","d) = sum of singular values"], answer:"a) Rank = number of non-zero singular values", unit:"Unit 3", tags:["MCQ","tricky"]},
      {id:"p20", question:"In deep autoencoders, purpose of encoder component?", options:["a) Reconstruct input","b) Compress to low-dim representation","c) Generate synthetic data","d) Classify input"], answer:"b) Compress input to low-dimensional representation", unit:"Unit 3", tags:["MCQ","important"]},
    ]},
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useProgress() {
  const [completed, setCompleted] = useState({});
  useEffect(() => {
    try { setCompleted(JSON.parse(localStorage.getItem("sml-progress") || "{}")); } catch {}
  }, []);
  const toggle = (id) => setCompleted(prev => {
    const next = { ...prev, [id]: !prev[id] };
    try { localStorage.setItem("sml-progress", JSON.stringify(next)); } catch {}
    return next;
  });
  const reset = () => { setCompleted({}); try { localStorage.removeItem("sml-progress"); } catch {} };
  const allQ = UNITS.flatMap(u => u.questions);
  const done = Object.values(completed).filter(Boolean).length;
  return { toggle, reset, isCompleted: (id) => !!completed[id], done, total: allQ.length, pct: allQ.length ? Math.round(done/allQ.length*100) : 0 };
}

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("sml-theme");
    const d = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
  }, []);
  const toggle = () => setDark(v => { localStorage.setItem("sml-theme", !v ? "dark" : "light"); return !v; });
  return { dark, toggle };
}

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copy, copied };
}

function useSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!q.trim()) { setResults([]); return; }
      const terms = q.toLowerCase().split(/\s+/);
      const all = UNITS.flatMap(u => u.questions.map(qq => ({ q: qq, unit: u })));
      const scored = all.map(({ q: qq, unit }) => {
        const hay = `${qq.question} ${qq.answer} ${unit.title}`.toLowerCase();
        let score = 0;
        terms.forEach(t => { if (hay.includes(t)) score++; if (qq.question.toLowerCase().includes(t)) score += 2; });
        return { question: qq, unit, score };
      }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
      setResults(scored);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);
  return { q, setQ, results };
}

// ─── TAG STYLES ───────────────────────────────────────────────────────────────

const TAG = {
  important: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.2)" },
  repeated:  { bg: "rgba(249,115,22,0.1)", color: "#f97316", border: "rgba(249,115,22,0.2)" },
  easy:      { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.2)" },
  tricky:    { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  MCQ:       { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "rgba(59,130,246,0.2)" },
};

const TYPE = {
  "2-mark":  { bg: "rgba(100,116,139,0.1)", color: "#64748b", border: "rgba(100,116,139,0.2)" },
  "5-mark":  { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", border: "rgba(59,130,246,0.2)" },
  "10-mark": { bg: "rgba(168,85,247,0.1)",  color: "#a855f7", border: "rgba(168,85,247,0.2)" },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TagPill({ label, style }) {
  const s = style || { bg: "rgba(100,116,139,0.1)", color: "#64748b", border: "rgba(100,116,139,0.2)" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function QuestionCard({ question, index, defaultOpen = false, highlight = "", theme }) {
  const [open, setOpen] = useState(defaultOpen);
  const { toggle, isCompleted } = useProgress();
  const { copy, copied } = useCopy();
  const done = isCompleted(question.id);
  const isDark = theme === "dark";

  const hl = (text) => {
    if (!highlight?.trim()) return text;
    const re = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(re);
    return parts.map((p, i) => re.test(p) ? <mark key={i} style={{ background: "rgba(250,204,21,0.3)", color: "inherit", borderRadius: 2, padding: "0 2px" }}>{p}</mark> : p);
  };

  const cardBg = done
    ? (isDark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)")
    : (isDark ? "#16161a" : "#ffffff");
  const cardBorder = done
    ? "rgba(16,185,129,0.3)"
    : (isDark ? "#27272f" : "#e5e7eb");

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, overflow: "hidden", transition: "all 0.2s" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
        {index !== undefined && (
          <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isDark ? "#1e1e24" : "#f1f5f9", color: isDark ? "#5c5c6e" : "#94a3b8", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", marginTop: 1 }}>
            {index + 1}
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: done ? (isDark ? "#5c5c6e" : "#94a3b8") : (isDark ? "#f4f4f6" : "#0a0a0a"), textDecoration: done ? "line-through" : "none", margin: 0 }}>
            {hl(question.question)}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            <TagPill label={question.type} style={TYPE[question.type]} />
            {question.year && <TagPill label={question.year} style={{ bg: isDark ? "#1e1e24" : "#f1f5f9", color: isDark ? "#5c5c6e" : "#94a3b8", border: isDark ? "#27272f" : "#e5e7eb" }} />}
            {question.tags.filter(t => t !== "10-mark").map(t => <TagPill key={t} label={t} style={TAG[t]} />)}
          </div>
        </div>
        <span style={{ flexShrink: 0, color: isDark ? "#5c5c6e" : "#94a3b8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", marginTop: 2 }}>▾</span>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ borderTop: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`, paddingTop: 14 }}>
            {question.answer_key && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                ✓ Answer Key: {question.answer_key}
              </div>
            )}
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.75, color: isDark ? "#8b8b9a" : "#6b7280", fontFamily: "inherit", margin: 0 }}>{question.answer}</pre>
            <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}` }}>
              <button onClick={(e) => { e.stopPropagation(); toggle(question.id); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer", border: done ? "1px solid rgba(16,185,129,0.3)" : `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`, background: done ? "rgba(16,185,129,0.1)" : "transparent", color: done ? "#10b981" : (isDark ? "#8b8b9a" : "#6b7280"), transition: "all 0.15s" }}>
                ✓ {done ? "Completed" : "Mark done"}
              </button>
              <button onClick={(e) => { e.stopPropagation(); copy(`Q: ${question.question}\n\nA: ${question.answer}`, question.id); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer", border: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`, background: "transparent", color: isDark ? "#8b8b9a" : "#6b7280", transition: "all 0.15s" }}>
                {copied === question.id ? "✓ Copied!" : "⎘ Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, id, children, theme }) {
  return (
    <section id={id} style={{ scrollMarginTop: 72 }}>
      {title && <h2 style={{ fontSize: 20, fontWeight: 700, color: theme === "dark" ? "#f4f4f6" : "#0a0a0a", marginBottom: 20 }}>{title}</h2>}
      {children}
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { toggle, reset, isCompleted, done, total, pct } = useProgress();
  const { q, setQ, results } = useSearch();
  const { copy, copied } = useCopy();
  const [activeSection, setActiveSection] = useState("overview");
  const [revisionMode, setRevisionMode] = useState(false);
  const [activePYQ, setActivePYQ] = useState(PYQS[0].id);
  const [showPYQAnswers, setShowPYQAnswers] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [unitFilters, setUnitFilters] = useState({});

  const t = dark ? {
    bg: "#0c0c0f", bgSec: "#111115", bgTer: "#18181d",
    surface: "#16161a", surfaceHover: "#1e1e24", border: "#27272f",
    text: "#f4f4f6", textSec: "#8b8b9a", textTer: "#5c5c6e",
    accent: "#818cf8", accentLight: "rgba(129,140,248,0.1)",
  } : {
    bg: "#ffffff", bgSec: "#f8f9fa", bgTer: "#f1f5f9",
    surface: "#ffffff", surfaceHover: "#f8f9fa", border: "#e5e7eb",
    text: "#0a0a0a", textSec: "#6b7280", textTer: "#9ca3af",
    accent: "#6366f1", accentLight: "rgba(99,102,241,0.1)",
  };

  const NAV = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "important", label: "Important Questions", icon: "★" },
    { id: "pyq", label: "Previous Year Papers", icon: "📄" },
    { id: "cheatsheets", label: "Cheat Sheets", icon: "⚡" },
  ];

  const navigate = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNav(false);
  };

  const allImportant = UNITS.flatMap(u => u.questions.filter(q => q.tags.includes("important"))).map(q => ({ question: q }));
  const allRepeated = UNITS.flatMap(u => u.questions.filter(q => q.tags.includes("repeated"))).map(q => ({ question: q }));
  const paper = PYQS.find(p => p.id === activePYQ);

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>SML</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>SML Exam Hub</div>
          <div style={{ fontSize: 11, color: t.textTer }}>Semester VI · CSE</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: t.textTer, fontWeight: 500 }}>Progress</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.accent }}>{done}/{total}</span>
        </div>
        <div style={{ height: 5, background: t.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: t.accent, borderRadius: 99, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ fontSize: 11, color: t.textTer, marginTop: 4 }}>{pct}% complete</div>
      </div>

      {/* Revision toggle */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${t.border}` }}>
        <button onClick={() => setRevisionMode(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, border: revisionMode ? "1px solid rgba(245,158,11,0.3)" : `1px solid ${t.border}`, background: revisionMode ? "rgba(245,158,11,0.08)" : "transparent", color: revisionMode ? "#f59e0b" : t.textSec, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
          <span>🎯 Revision Mode</span>
          <div style={{ width: 28, height: 16, borderRadius: 8, background: revisionMode ? "#f59e0b" : t.border, position: "relative", transition: "background 0.2s" }}>
            <div style={{ position: "absolute", top: 2, left: revisionMode ? 14 : 2, width: 12, height: 12, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, border: "none", background: activeSection === item.id ? t.accentLight : "transparent", color: activeSection === item.id ? t.accent : t.textSec, fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s", marginBottom: 1 }}>
            <span style={{ width: 16, textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {activeSection === item.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />}
          </button>
        ))}

        <div style={{ padding: "16px 12px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textTer }}>Units</div>

        {UNITS.map(unit => (
          <button key={unit.id} onClick={() => navigate(unit.id)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: "none", background: activeSection === unit.id ? t.accentLight : "transparent", color: activeSection === unit.id ? t.accent : t.textSec, fontSize: 12, cursor: "pointer", transition: "all 0.15s", marginBottom: 1 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: unit.color, flexShrink: 0 }} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{unit.unit}: {unit.title}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: "10px 20px", borderTop: `1px solid ${t.border}`, fontSize: 11, color: t.textTer, textAlign: "center" }}>
        SML · Statistical Machine Learning · 2024-25
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 14 }}>

      {/* Sidebar desktop */}
      <div style={{ position: "fixed", top: 0, left: 0, width: 260, height: "100vh", background: t.bgSec, borderRight: `1px solid ${t.border}`, zIndex: 40, display: "flex", flexDirection: "column" }} className="hidden-mobile">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNav && (
        <>
          <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={{ position: "fixed", top: 0, left: 0, width: 280, height: "100vh", background: t.bgSec, borderRight: `1px solid ${t.border}`, zIndex: 60 }}>
            <SidebarContent />
          </div>
        </>
      )}

      {/* Header */}
      <header style={{ position: "fixed", top: 0, right: 0, left: 0, height: 56, background: `${t.bg}cc`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.border}`, zIndex: 30, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", paddingLeft: "calc(260px + 16px)" }}>
        <button onClick={() => setMobileNav(true)} style={{ display: "none", padding: 6, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, cursor: "pointer" }} className="mobile-only">☰</button>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 520, position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.textTer, fontSize: 14 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search questions, topics, answers…" style={{ width: "100%", height: 36, paddingLeft: 32, paddingRight: q ? 32 : 12, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13, outline: "none", transition: "border-color 0.15s" }} />
          {q && <button onClick={() => setQ("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: t.textTer, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>}
        </div>

        {q && <span style={{ fontSize: 12, color: t.textTer, whiteSpace: "nowrap" }}>{results.length} results</span>}
        <div style={{ flex: 1 }} />

        <button onClick={toggleTheme} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {dark ? "☀" : "🌙"}
        </button>
      </header>

      {/* Search overlay */}
      {q && (
        <div style={{ position: "fixed", top: 56, right: 0, left: 260, zIndex: 20, padding: "0 16px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", background: t.bg, border: `1px solid ${t.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", maxHeight: "60vh", overflowY: "auto", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 13, color: t.textSec }}><strong style={{ color: t.text }}>{results.length}</strong> results for "<span style={{ color: t.accent }}>{q}</span>"</span>
              <button onClick={() => setQ("")} style={{ fontSize: 11, color: t.textTer, background: "none", border: "none", cursor: "pointer" }}>Close</button>
            </div>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: t.textTer }}>🔍 No results found</div>
            ) : results.map((r, i) => (
              <div key={r.question.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textTer, marginBottom: 4 }}>{r.unit.unit}: {r.unit.title}</div>
                <QuestionCard question={r.question} defaultOpen={results.length <= 2} highlight={q} theme={dark ? "dark" : "light"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ paddingLeft: 260, paddingTop: 56 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 64 }}>

          {/* OVERVIEW */}
          <Section id="overview" theme={dark ? "dark" : "light"}>
            <div style={{ background: `linear-gradient(135deg, ${t.accentLight}, transparent)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: "32px 32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {["SML","Semester VI","CSE"].map(l => <TagPill key={l} label={l} style={{ bg: t.accentLight, color: t.accent, border: `1px solid rgba(129,140,248,0.3)` }} />)}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px", color: t.text }}>Statistical Machine Learning</h1>
              <p style={{ fontSize: 14, color: t.textSec, maxWidth: 600, lineHeight: 1.6, margin: 0 }}>{OVERVIEW.description}</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total Qs", value: UNITS.flatMap(u => u.questions).length, color: t.accent },
                { label: "2-Mark", value: UNITS.flatMap(u => u.questions.filter(q => q.type === "2-mark")).length, color: "#06b6d4" },
                { label: "5-Mark", value: UNITS.flatMap(u => u.questions.filter(q => q.type === "5-mark")).length, color: "#8b5cf6" },
                { label: "10-Mark", value: UNITS.flatMap(u => u.questions.filter(q => q.type === "10-mark")).length, color: "#ec4899" },
                { label: "Important", value: allImportant.length, color: "#ef4444" },
                { label: "Repeated", value: allRepeated.length, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: t.textTer, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Exam pattern */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 14 }}>Exam Pattern</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                {Object.entries(OVERVIEW.examPattern).map(([k, v]) => (
                  <div key={k} style={{ background: t.bgSec, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", color: t.textTer }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginTop: 3 }}>{v.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: t.accent, margin: "4px 0 2px" }}>{v.marks}</div>
                    <div style={{ fontSize: 11, color: t.textTer }}>{v.units}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics + refs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>🔥 High-Frequency Topics</h3>
                {OVERVIEW.importantTopics.map((topic, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</span>
                    <span style={{ fontSize: 13, color: t.textSec }}>{topic}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>📚 References</h3>
                {OVERVIEW.references.map((ref, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <span style={{ color: t.textTer, marginTop: 1 }}>›</span>
                    <span style={{ fontSize: 12, color: t.textSec, lineHeight: 1.4 }}>{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* UNITS */}
          {UNITS.map(unit => {
            const typeFilter = unitFilters[unit.id] || "all";
            const filtered = unit.questions.filter(q => {
              if (revisionMode && !q.tags.includes("important")) return false;
              if (typeFilter !== "all" && q.type !== typeFilter) return false;
              return true;
            });
            return (
              <Section key={unit.id} id={unit.id} theme={dark ? "dark" : "light"}>
                <div style={{ background: `${unit.color}08`, border: `1px solid ${unit.color}30`, borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 6, background: unit.color, color: "white" }}>{unit.unit}</span>
                    {revisionMode && <TagPill label="🎯 Revision Mode" style={{ bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" }} />}
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 6px" }}>{unit.title}</h2>
                  <p style={{ fontSize: 13, color: t.textSec, margin: 0 }}>{unit.summary}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {unit.topics.map(tp => (
                      <span key={tp} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: `${unit.color}12`, color: unit.color, border: `1px solid ${unit.color}30` }}>{tp}</span>
                    ))}
                  </div>
                </div>

                {/* Type filter */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  {["all","2-mark","5-mark","10-mark"].map(type => {
                    const cnt = type === "all" ? unit.questions.filter(q => !revisionMode || q.tags.includes("important")).length : unit.questions.filter(q => q.type === type && (!revisionMode || q.tags.includes("important"))).length;
                    const active = typeFilter === type;
                    return (
                      <button key={type} onClick={() => setUnitFilters(f => ({ ...f, [unit.id]: type }))} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${active ? t.accent : t.border}`, background: active ? t.accentLight : "transparent", color: active ? t.accent : t.textSec, fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                        {type} ({cnt})
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: t.textTer }}>No questions for this filter.</div>
                  ) : filtered.map((q, i) => <QuestionCard key={q.id} question={q} index={i} theme={dark ? "dark" : "light"} />)}
                </div>
              </Section>
            );
          })}

          {/* IMPORTANT */}
          <Section id="important" theme={dark ? "dark" : "light"}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔁</div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>Most Repeated Questions</h2>
                  <p style={{ fontSize: 12, color: t.textTer, margin: 0 }}>Appeared in multiple CTs — highest priority</p>
                </div>
                <TagPill label={`${allRepeated.length} questions`} style={{ bg: "rgba(249,115,22,0.1)", color: "#f97316", border: "rgba(249,115,22,0.2)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allRepeated.map((r, i) => <QuestionCard key={r.question.id} question={r.question} index={i} theme={dark ? "dark" : "light"} />)}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>★</div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>All Important Questions</h2>
                  <p style={{ fontSize: 12, color: t.textTer, margin: 0 }}>Curated must-know questions across all units</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allImportant.map((r, i) => <QuestionCard key={r.question.id} question={r.question} index={i} theme={dark ? "dark" : "light"} />)}
              </div>
            </div>
          </Section>

          {/* PYQ */}
          <Section id="pyq" theme={dark ? "dark" : "light"}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 4px" }}>Previous Year Papers</h2>
                <p style={{ fontSize: 13, color: t.textTer, margin: 0 }}>Actual CT questions with answer keys from your ZIP</p>
              </div>
              <button onClick={() => setShowPYQAnswers(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, border: `1px solid ${showPYQAnswers ? "rgba(16,185,129,0.3)" : t.border}`, background: showPYQAnswers ? "rgba(16,185,129,0.1)" : "transparent", color: showPYQAnswers ? "#10b981" : t.textSec, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
                {showPYQAnswers ? "👁 Hide Answers" : "👁 Show Answers"}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {PYQS.map(p => (
                <button key={p.id} onClick={() => setActivePYQ(p.id)} style={{ padding: "8px 16px", borderRadius: 9, border: `1px solid ${activePYQ === p.id ? t.accent : t.border}`, background: activePYQ === p.id ? t.accentLight : "transparent", color: activePYQ === p.id ? t.accent : t.textSec, fontSize: 13, fontWeight: activePYQ === p.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                  {p.exam} <span style={{ opacity: 0.5, fontSize: 11 }}>{p.year}</span>
                </button>
              ))}
            </div>

            {paper && (
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden" }}>
                {/* Meta */}
                <div style={{ background: t.bgSec, borderBottom: `1px solid ${t.border}`, padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: 24 }}>
                  {[["Exam", paper.exam], ["Total Marks", paper.totalMarks], ["Duration", paper.duration], ["Questions", paper.questions.length]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 11, color: t.textTer }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Questions */}
                {paper.questions.map((q, i) => <PYQRow key={q.id} q={q} index={i} showAnswer={showPYQAnswers} theme={t} isDark={dark} />)}
              </div>
            )}
          </Section>

          {/* CHEATSHEETS */}
          <Section id="cheatsheets" theme={dark ? "dark" : "light"}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>Cheat Sheets</h2>
            <p style={{ fontSize: 13, color: t.textTer, marginBottom: 20 }}>Key formulas and concepts — quick reference before the exam</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
              {CHEATSHEETS.map(sheet => <CheatCard key={sheet.id} sheet={sheet} theme={t} isDark={dark} copy={copy} copied={copied} />)}
            </div>
          </Section>

          <footer style={{ textAlign: "center", padding: "32px 0", borderTop: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 13, color: t.textTer, margin: "0 0 4px" }}>SML Exam Hub · Statistical Machine Learning · 2024–25</p>
            <p style={{ fontSize: 12, color: t.textTer, margin: 0 }}>Built for students, by students. Study smart. 🎓</p>
          </footer>
        </div>
      </main>

      {/* Progress widget */}
      <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 30 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
          <svg viewBox="0 0 36 36" style={{ width: 38, height: 38, transform: "rotate(-90deg)", flexShrink: 0 }}>
            <circle cx="18" cy="18" r="15" fill="none" stroke={t.border} strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke={t.accent} strokeWidth="3" strokeDasharray={`${(pct/100)*94.2} 94.2`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.7s ease" }} />
          </svg>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.accent }}>{pct}%</div>
            <div style={{ fontSize: 11, color: t.textSec, fontWeight: 600 }}>Progress</div>
            <div style={{ fontSize: 10, color: t.textTer }}>{done}/{total} done</div>
          </div>
          {done > 0 && (
            <button onClick={reset} title="Reset" style={{ background: "none", border: "none", color: t.textTer, cursor: "pointer", fontSize: 14, padding: "2px 4px", borderRadius: 4, transition: "color 0.15s" }}>↺</button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          main { padding-left: 0 !important; }
          header { padding-left: 16px !important; }
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

function PYQRow({ q, index, showAnswer, theme: t, isDark }) {
  const [open, setOpen] = useState(false);
  const show = showAnswer || open;
  return (
    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: isDark ? "#1e1e24" : "#f1f5f9", color: isDark ? "#5c5c6e" : "#94a3b8", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{index+1}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: t.text, margin: "0 0 8px", lineHeight: 1.4 }}>{q.question}</p>
          {q.options && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
              {q.options.map((opt, i) => {
                const correct = show && q.answer.includes(opt.split(")")[0].trim());
                return (
                  <div key={i} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 7, border: `1px solid ${correct ? "rgba(16,185,129,0.3)" : t.border}`, background: correct ? "rgba(16,185,129,0.08)" : "transparent", color: correct ? "#10b981" : t.textSec, fontWeight: correct ? 600 : 400 }}>
                    {correct && "✓ "}{opt}
                  </div>
                );
              })}
            </div>
          )}
          {show && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              ✓ {q.answer}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: isDark ? "#1e1e24" : "#f1f5f9", color: t.textTer }}>{q.unit}</span>
            {q.tags.map(tg => <span key={tg} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: isDark ? "#1e1e24" : "#f1f5f9", color: t.textTer }}>{tg}</span>)}
            {!showAnswer && (
              <button onClick={() => setOpen(v => !v)} style={{ marginLeft: "auto", fontSize: 11, color: t.accent, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                {open ? "Hide" : "Reveal"} answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheatCard({ sheet, theme: t, isDark, copy, copied }) {
  const [collapsed, setCollapsed] = useState(false);
  const fullText = `${sheet.title}\n${"─".repeat(40)}\n` + sheet.items.map(i => `${i.label}:\n  Formula: ${i.formula}\n  Note: ${i.note}`).join("\n\n");
  return (
    <div style={{ background: t.surface, border: `1px solid ${sheet.color}30`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${sheet.color}20`, background: `${sheet.color}08` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{sheet.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{sheet.title}</div>
            <div style={{ fontSize: 11, color: sheet.color }}>{sheet.unit}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => copy(fullText, sheet.id)} style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, fontSize: 11, cursor: "pointer" }}>
            {copied === sheet.id ? "✓ Copied" : "⎘ Copy"}
          </button>
          <button onClick={() => setCollapsed(c => !c)} style={{ padding: "4px 8px", borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, fontSize: 12, cursor: "pointer" }}>
            {collapsed ? "▾" : "▴"}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div>
          {sheet.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "10px 16px", borderBottom: i < sheet.items.length-1 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textTer, width: 100, flexShrink: 0, marginTop: 2 }}>{item.label}</div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: sheet.color, display: "block" }}>{item.formula}</code>
                <div style={{ fontSize: 11, color: t.textTer, marginTop: 2 }}>{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
