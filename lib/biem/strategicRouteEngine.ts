import { DetectedProblem, StrategicRoute } from "@/lib/biem/types";

const ROUTE_MAP: Record<string, StrategicRoute[]> = {
  P01: [
    {
      id: "R01",
      title: "Build customer acquisition system",
      description: "Design a multi-channel acquisition engine with measurable CAC and conversion goals.",
      complexity_level: "high",
      related_business_dimension: "customer_acquisition"
    },
    {
      id: "R02",
      title: "Implement lead capture system",
      description: "Deploy lead magnets, landing pages, and CRM workflows to capture and nurture demand.",
      complexity_level: "medium",
      related_business_dimension: "customer_acquisition"
    }
  ],
  P02: [
    {
      id: "R03",
      title: "Define value proposition",
      description: "Reframe messaging around measurable outcomes and unique differentiators by segment.",
      complexity_level: "medium",
      related_business_dimension: "value_proposition"
    }
  ],
  P03: [
    {
      id: "R04",
      title: "Diversify revenue streams",
      description: "Add complementary offers, tiers, or recurring contracts to reduce concentration risk.",
      complexity_level: "high",
      related_business_dimension: "revenue_structure"
    },
    {
      id: "R05",
      title: "Create entry-level offer",
      description: "Launch a lower-friction product to increase pipeline volume and monetization options.",
      complexity_level: "medium",
      related_business_dimension: "revenue_structure"
    }
  ],
  P04: [
    {
      id: "R06",
      title: "Improve digital presence",
      description: "Standardize website, analytics, and marketing automation for real-time execution.",
      complexity_level: "medium",
      related_business_dimension: "digitalization"
    }
  ],
  P05: [
    {
      id: "R07",
      title: "Run structured market validation",
      description: "Execute interview, demand test, and pilot loops to validate pains and willingness to pay.",
      complexity_level: "medium",
      related_business_dimension: "strategy"
    }
  ],
  P06: [
    {
      id: "R08",
      title: "Design scalable delivery model",
      description: "Reduce manual dependencies via productization, SOPs, and automation.",
      complexity_level: "high",
      related_business_dimension: "scalability"
    }
  ]
};

export function recommendStrategicRoutes(problems: DetectedProblem[]): StrategicRoute[] {
  const deduped = new Map<string, StrategicRoute>();

  problems.forEach((problem) => {
    (ROUTE_MAP[problem.id] ?? []).forEach((route) => {
      deduped.set(route.id, route);
    });
  });

  return [...deduped.values()];
}
