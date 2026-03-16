import { DiagnosticQuestion } from "@/lib/biem-insight/types";

export const mentorOpeners = [
  "Let's start with something important.",
  "I want to understand the foundation of your business thinking.",
  "This will help me identify where your structure is strong—and where it needs reinforcement."
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "q1",
    mentorIntro: "First, I want to understand your problem clarity.",
    prompt: "How clear is the problem you are solving for your customer?",
    dimension: "idea_clarity",
    options: [
      { id: "a", label: "Still very broad and undefined", score: 1 },
      { id: "b", label: "Somewhat clear, but still changing", score: 2 },
      { id: "c", label: "Clear for one segment", score: 3 },
      { id: "d", label: "Very clear and consistently validated", score: 4 }
    ]
  },
  {
    id: "q2",
    mentorIntro: "Now, let's assess the strategic origin of the idea.",
    prompt: "Where did your business idea come from?",
    dimension: "idea_clarity",
    options: [
      { id: "a", label: "Personal intuition only", score: 1 },
      { id: "b", label: "Personal experience with some external input", score: 2 },
      { id: "c", label: "Repeated market patterns I observed", score: 3 },
      { id: "d", label: "Clear market pain + validated opportunities", score: 4 }
    ]
  },
  {
    id: "q3",
    mentorIntro: "I need to understand your market validation depth.",
    prompt: "What evidence do you have that people want this solution?",
    dimension: "market_validation",
    options: [
      { id: "a", label: "No direct evidence yet", score: 1 },
      { id: "b", label: "Conversations but no buying behavior", score: 2 },
      { id: "c", label: "Early paying clients or pilots", score: 3 },
      { id: "d", label: "Consistent demand and repeat clients", score: 4 }
    ]
  },
  {
    id: "q4",
    mentorIntro: "Let's check customer definition.",
    prompt: "How specific is your ideal customer profile today?",
    dimension: "market_validation",
    options: [
      { id: "a", label: "Very generic audience", score: 1 },
      { id: "b", label: "I have hypotheses but no precision", score: 2 },
      { id: "c", label: "Segment identified with moderate clarity", score: 3 },
      { id: "d", label: "Segment and buying triggers are very clear", score: 4 }
    ]
  },
  {
    id: "q5",
    mentorIntro: "Now I want to evaluate your strategic focus.",
    prompt: "How focused is your current strategy?",
    dimension: "strategic_focus",
    options: [
      { id: "a", label: "Too many ideas and no clear priority", score: 1 },
      { id: "b", label: "Some priorities, but constant pivots", score: 2 },
      { id: "c", label: "Clear priorities with occasional dispersion", score: 3 },
      { id: "d", label: "Disciplined priorities and execution cadence", score: 4 }
    ]
  },
  {
    id: "q6",
    mentorIntro: "Let's understand your decision process.",
    prompt: "How do you usually make strategic decisions?",
    dimension: "decision_making_mindset",
    options: [
      { id: "a", label: "I delay decisions due to uncertainty", score: 1 },
      { id: "b", label: "I react quickly, often without a framework", score: 2 },
      { id: "c", label: "I combine intuition with some data", score: 3 },
      { id: "d", label: "I use clear criteria and evidence consistently", score: 4 }
    ]
  },
  {
    id: "q7",
    mentorIntro: "Acquisition is essential for strategic viability.",
    prompt: "How predictable is your customer acquisition system?",
    dimension: "strategic_focus",
    options: [
      { id: "a", label: "No reliable acquisition channel", score: 1 },
      { id: "b", label: "Mostly referrals and sporadic leads", score: 2 },
      { id: "c", label: "At least one channel with some consistency", score: 3 },
      { id: "d", label: "Multi-channel system with measurable pipeline", score: 4 }
    ]
  },
  {
    id: "q8",
    mentorIntro: "Execution discipline often defines real outcomes.",
    prompt: "How structured is your execution rhythm week to week?",
    dimension: "execution_capacity",
    options: [
      { id: "a", label: "Highly reactive and improvised", score: 1 },
      { id: "b", label: "Some routine, but little accountability", score: 2 },
      { id: "c", label: "Regular cadence with basic tracking", score: 3 },
      { id: "d", label: "Strong operating rhythm and clear ownership", score: 4 }
    ]
  },
  {
    id: "q9",
    mentorIntro: "Let's surface your biggest structural constraint.",
    prompt: "What best describes your current main challenge?",
    dimension: "execution_capacity",
    options: [
      { id: "a", label: "I don't know what to prioritize", score: 1 },
      { id: "b", label: "I know priorities but execution breaks", score: 2 },
      { id: "c", label: "Execution works but growth is unstable", score: 3 },
      { id: "d", label: "Main challenge is scaling existing traction", score: 4 }
    ]
  },
  {
    id: "q10",
    mentorIntro: "Finally, I want to understand your growth vision maturity.",
    prompt: "How clearly can you describe your business in 12 months?",
    dimension: "decision_making_mindset",
    options: [
      { id: "a", label: "No concrete vision yet", score: 1 },
      { id: "b", label: "General ambition without clear metrics", score: 2 },
      { id: "c", label: "Defined goals with partial roadmap", score: 3 },
      { id: "d", label: "Clear strategic outcomes and execution roadmap", score: 4 }
    ]
  }
];

export function getMentorMessage(index: number): string {
  if (index < mentorOpeners.length) return mentorOpeners[index];
  return "Thank you—this helps me understand your strategic structure with more precision.";
}
