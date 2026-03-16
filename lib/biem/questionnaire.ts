import { BIEMQuestion } from "@/lib/biem/types";

export const biemQuestionnaire: BIEMQuestion[] = [
  { id: "Q01", question: "How clearly is the target market segment defined?", type: "multiple_choice", weight: 1.1, category: "market_problem_validation", contributesTo: ["strategy"] },
  { id: "Q02", question: "How frequently do customers report the core problem you solve?", type: "multiple_choice", weight: 1.2, category: "market_problem_validation", contributesTo: ["strategy"] },
  { id: "Q03", question: "How many customer interviews were conducted in the last 90 days?", type: "numeric", scale: { min: 0, max: 50 }, weight: 0.9, category: "market_problem_validation", contributesTo: ["strategy"] },
  { id: "Q04", question: "Do you have evidence of willingness to pay before scaling?", type: "boolean", weight: 1.3, category: "market_problem_validation", contributesTo: ["strategy", "revenue_structure"] },
  { id: "Q05", question: "How strong is your understanding of competitors and substitutes?", type: "multiple_choice", weight: 1, category: "market_problem_validation", contributesTo: ["strategy", "value_proposition"] },
  { id: "Q06", question: "Is the customer pain urgent enough to trigger immediate action?", type: "multiple_choice", weight: 1.1, category: "market_problem_validation", contributesTo: ["strategy"] },

  { id: "Q07", question: "How clearly is your core value proposition expressed in one sentence?", type: "multiple_choice", weight: 1.2, category: "value_proposition_differentiation", contributesTo: ["value_proposition"] },
  { id: "Q08", question: "Does your offer solve a measurable customer outcome?", type: "boolean", weight: 1.2, category: "value_proposition_differentiation", contributesTo: ["value_proposition"] },
  { id: "Q09", question: "How differentiated is your solution compared with alternatives?", type: "multiple_choice", weight: 1.4, category: "value_proposition_differentiation", contributesTo: ["value_proposition"] },
  { id: "Q10", question: "How well do customers understand why they should choose you?", type: "multiple_choice", weight: 1, category: "value_proposition_differentiation", contributesTo: ["value_proposition", "customer_acquisition"] },
  { id: "Q11", question: "Do you have social proof (cases, testimonials, outcomes) to reinforce positioning?", type: "boolean", weight: 1.1, category: "value_proposition_differentiation", contributesTo: ["value_proposition", "customer_acquisition"] },
  { id: "Q12", question: "How consistent is your messaging across channels and sales assets?", type: "multiple_choice", weight: 0.9, category: "value_proposition_differentiation", contributesTo: ["value_proposition"] },

  { id: "Q13", question: "How many active acquisition channels generate leads today?", type: "numeric", scale: { min: 0, max: 10 }, weight: 1.3, category: "customer_acquisition_system", contributesTo: ["customer_acquisition", "scalability"] },
  { id: "Q14", question: "Do you use a predictable lead capture process?", type: "boolean", weight: 1.2, category: "customer_acquisition_system", contributesTo: ["customer_acquisition", "digitalization"] },
  { id: "Q15", question: "How efficient is your lead-to-opportunity conversion?", type: "multiple_choice", weight: 1.1, category: "customer_acquisition_system", contributesTo: ["customer_acquisition"] },
  { id: "Q16", question: "Do you track CAC (customer acquisition cost) by channel?", type: "boolean", weight: 1.1, category: "customer_acquisition_system", contributesTo: ["customer_acquisition", "revenue_structure"] },
  { id: "Q17", question: "How repeatable is your customer acquisition process?", type: "multiple_choice", weight: 1.3, category: "customer_acquisition_system", contributesTo: ["customer_acquisition", "scalability"] },
  { id: "Q18", question: "How fast can you activate a new acquisition channel?", type: "multiple_choice", weight: 0.9, category: "customer_acquisition_system", contributesTo: ["customer_acquisition", "scalability"] },

  { id: "Q19", question: "How diversified are your revenue streams?", type: "multiple_choice", weight: 1.4, category: "revenue_structure", contributesTo: ["revenue_structure", "scalability"] },
  { id: "Q20", question: "Do you have recurring revenue components?", type: "boolean", weight: 1.2, category: "revenue_structure", contributesTo: ["revenue_structure", "scalability"] },
  { id: "Q21", question: "What is your current average gross margin (%)?", type: "numeric", scale: { min: 0, max: 90 }, weight: 1, category: "revenue_structure", contributesTo: ["revenue_structure"] },
  { id: "Q22", question: "How clearly are pricing tiers aligned to customer segments?", type: "multiple_choice", weight: 1, category: "revenue_structure", contributesTo: ["revenue_structure", "value_proposition"] },
  { id: "Q23", question: "Do you monitor LTV/CAC ratio regularly?", type: "boolean", weight: 1.2, category: "revenue_structure", contributesTo: ["revenue_structure"] },
  { id: "Q24", question: "How resilient is your revenue model to demand fluctuations?", type: "multiple_choice", weight: 1.1, category: "revenue_structure", contributesTo: ["revenue_structure", "strategy"] },

  { id: "Q25", question: "How integrated are your digital tools (CRM, marketing, analytics)?", type: "multiple_choice", weight: 1.2, category: "digitalization_scalability", contributesTo: ["digitalization"] },
  { id: "Q26", question: "Do you have an automated follow-up workflow for leads/customers?", type: "boolean", weight: 1.3, category: "digitalization_scalability", contributesTo: ["digitalization", "scalability"] },
  { id: "Q27", question: "How much of your operation is dependent on manual execution?", type: "multiple_choice", weight: 1.2, category: "digitalization_scalability", contributesTo: ["digitalization", "scalability"] },
  { id: "Q28", question: "How scalable is your service delivery without proportional hiring?", type: "multiple_choice", weight: 1.4, category: "digitalization_scalability", contributesTo: ["scalability"] },
  { id: "Q29", question: "Do you use real-time dashboards for strategic decision-making?", type: "boolean", weight: 1, category: "digitalization_scalability", contributesTo: ["digitalization", "strategy"] },
  { id: "Q30", question: "How prepared is your tech stack to support 3x growth?", type: "multiple_choice", weight: 1.3, category: "digitalization_scalability", contributesTo: ["digitalization", "scalability"] }
];
