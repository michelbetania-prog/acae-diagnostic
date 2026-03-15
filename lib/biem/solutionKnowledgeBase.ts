import { BusinessStage, Solution, SolutionCategory } from "@/lib/biem/types";

type Blueprint = {
  category: SolutionCategory;
  applicable_problem: string;
  titles: string[];
};

const maturityCycle: BusinessStage[] = ["idea", "validation", "early_growth", "scaling", "established"];
const complexityCycle: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

const blueprints: Blueprint[] = [
  {
    category: "Market Validation",
    applicable_problem: "Insufficient market validation",
    titles: [
      "Customer interview sprint",
      "Problem statement clarity workshop",
      "Competitor substitution map",
      "Willingness-to-pay test",
      "Segment pain quantification",
      "Pilot demand campaign",
      "Voice-of-customer dashboard"
    ]
  },
  {
    category: "Positioning",
    applicable_problem: "Weak value proposition",
    titles: [
      "Unique mechanism articulation",
      "Message-market-fit refinement",
      "Proof architecture design",
      "Offer narrative simplification",
      "Positioning against alternatives",
      "Customer language mirroring",
      "Brand promise audit"
    ]
  },
  {
    category: "Customer Acquisition",
    applicable_problem: "Customer acquisition dependency",
    titles: [
      "Channel diversification roadmap",
      "Referral growth loop",
      "Paid media experimentation framework",
      "Partner acquisition program",
      "Outbound prospecting sequence",
      "Lead nurturing cadence",
      "Acquisition analytics baseline"
    ]
  },
  {
    category: "Digital Transformation",
    applicable_problem: "Low operational automation",
    titles: [
      "CRM implementation blueprint",
      "Automated lead qualification",
      "Marketing automation stack",
      "Data pipeline instrumentation",
      "Digital SOP standardization",
      "Dashboard command center",
      "Workflow integration audit"
    ]
  },
  {
    category: "Offer Structure",
    applicable_problem: "Weak value proposition",
    titles: [
      "Entry-level offer architecture",
      "Core offer packaging",
      "Premium tier expansion",
      "Outcome-based guarantee design",
      "Bundle strategy model",
      "Onboarding journey optimization",
      "Customer success handoff"
    ]
  },
  {
    category: "Monetization",
    applicable_problem: "Revenue concentration risk",
    titles: [
      "Recurring revenue offer",
      "Pricing elasticity study",
      "Cross-sell pathway design",
      "LTV expansion experiments",
      "Upsell sequence playbook",
      "Margin improvement diagnostics",
      "Revenue resilience planning"
    ]
  },
  {
    category: "Growth Systems",
    applicable_problem: "Scalability friction",
    titles: [
      "Growth operating rhythm",
      "Weekly KPI governance",
      "Pipeline forecast model",
      "Scale-readiness scorecard",
      "Experiment backlog process",
      "Execution accountability board",
      "Cross-functional growth pod"
    ]
  },
  {
    category: "Optimization",
    applicable_problem: "Low conversion efficiency",
    titles: [
      "Funnel bottleneck analysis",
      "Conversion copy optimization",
      "Sales process standardization",
      "Customer journey instrumentation",
      "Churn reduction initiative",
      "Cycle-time compression",
      "Win-loss review cadence"
    ]
  },
  {
    category: "Innovation",
    applicable_problem: "Stagnant strategic options",
    titles: [
      "Adjacent market exploration",
      "New business model scan",
      "Product-led growth pilot",
      "AI-enabled service prototype",
      "Strategic partnership experiments",
      "Innovation portfolio scoring",
      "Future scenario planning"
    ]
  }
];

export const solutionKnowledgeBase: Solution[] = blueprints.flatMap((blueprint, categoryIndex) =>
  blueprint.titles.map((title, titleIndex) => {
    const idx = categoryIndex * 10 + titleIndex + 1;
    return {
      id: `SOL-${String(idx).padStart(3, "0")}`,
      title,
      description: `${title} to resolve ${blueprint.applicable_problem.toLowerCase()} with a structured execution approach.`,
      category: blueprint.category,
      applicable_problem: blueprint.applicable_problem,
      complexity_level: complexityCycle[(categoryIndex + titleIndex) % complexityCycle.length],
      maturity_stage: maturityCycle[(categoryIndex + titleIndex) % maturityCycle.length]
    };
  })
);

export function getSolutionsForProblems(problemNames: string[]): Solution[] {
  const names = new Set(problemNames);
  return solutionKnowledgeBase.filter((solution) => names.has(solution.applicable_problem));
}
