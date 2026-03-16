import { Lead, Answers, FullReport } from "@/lib/biem-insight/types";
import { getMentorMessage } from "@/lib/conversation-engine";
import { runDiagnosticEngine } from "@/lib/diagnostic-engine";
import { calculateScore } from "@/lib/scoring-engine";

export function buildStrategicReport(lead: Lead, answers: Answers): FullReport {
  const { report, interpretation } = runDiagnosticEngine(answers);
  const score = calculateScore(answers);

  return {
    ...report,
    lead,
    answers,
    score,
    conversationSummary: `${getMentorMessage(0)} ${interpretation}`
  };
}
