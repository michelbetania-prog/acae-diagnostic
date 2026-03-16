"use client";

import { ReactNode, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { diagnosticQuestions, getMentorMessage } from "@/lib/conversation-engine";
import { Answers, FullReport, Lead } from "@/lib/biem-insight/types";

type Step =
  | "landing"
  | "capture"
  | "conversation"
  | "analyzing"
  | "report-1"
  | "report-2"
  | "report-3"
  | "report-4"
  | "email-offer"
  | "booking";

export default function BIEMInsightPage() {
  const [step, setStep] = useState<Step>("landing");
  const [lead, setLead] = useState<Lead>({ name: "", email: "", businessType: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [report, setReport] = useState<FullReport | null>(null);
  const [sending, setSending] = useState(false);

  const question = diagnosticQuestions[index];
  const completion = Math.round((Object.keys(answers).length / diagnosticQuestions.length) * 100);
  const intro = useMemo(() => getMentorMessage(index % 3), [index]);

  const startEvaluation = async () => {
    if (!lead.name || !lead.email) return;
    await fetch("/api/insight/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
    setStep("conversation");
  };

  const answerQuestion = (optionId: string) => {
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    if (index < diagnosticQuestions.length - 1) {
      setIndex(index + 1);
      return;
    }

    setStep("analyzing");
    setSending(true);
    setTimeout(async () => {
      const response = await fetch("/api/insight/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, answers: nextAnswers })
      });
      const data = (await response.json()) as FullReport;
      setReport(data);
      setSending(false);
      setStep("report-1");
    }, 3200);
  };

  return (
    <main className="py-8 md:py-14">
      <Container className="max-w-3xl space-y-6">
        {step === "landing" && (
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-brand-700 p-10 text-white shadow-soft">
            <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm">BIEM Strategic System</p>
            <h1 className="text-4xl font-bold">BIEM Insight</h1>
            <p className="mt-4 text-lg text-slate-100">
              Strategic diagnostic to identify the stage and structural challenges of your idea, project or business.
            </p>
            <button
              onClick={() => setStep("capture")}
              className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start Diagnostic
            </button>
          </section>
        )}

        {step === "capture" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Before we begin</h2>
            <p className="mt-2 text-slate-600">Your strategic report will be generated after completing the diagnostic.</p>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              <input className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
              <input className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Business type (optional)" value={lead.businessType} onChange={(e) => setLead({ ...lead, businessType: e.target.value })} />
            </div>
            <button
              onClick={startEvaluation}
              disabled={!lead.name || !lead.email}
              className="mt-6 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Start Evaluation
            </button>
          </section>
        )}

        {step === "conversation" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-medium text-brand-700">{intro}</p>
            <p className="mt-2 text-slate-600">{question.mentorIntro}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{question.prompt}</h2>
            <p className="mt-2 text-sm text-slate-500">Progress: {completion}%</p>
            <div className="mt-6 space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => answerQuestion(option.id)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-left transition hover:border-brand-500 hover:bg-brand-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "analyzing" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Analyzing your business structure...</h2>
            <p className="mt-3 text-slate-600">Our strategic engine is organizing your diagnostic signals.</p>
            <div className="mx-auto mt-5 h-2 w-56 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-600" />
            </div>
            {sending ? <p className="mt-3 text-sm text-slate-500">Please wait a few seconds.</p> : null}
          </section>
        )}

        {step === "report-1" && report && (
          <ReportCard title="Primary Result" onNext={() => setStep("report-2")}>
            <p className="text-sm font-semibold text-brand-700">Stage detected</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">{report.stage.replaceAll("_", " ")}</h2>
            <p className="mt-4 text-slate-700">From what I see in your responses, your current structure has potential, but key strategic elements must be reinforced to unlock sustainable growth.</p>
            <p className="mt-3 text-slate-600">Potential level: <strong>{report.potential_level}</strong></p>
          </ReportCard>
        )}

        {step === "report-2" && report && (
          <ReportCard title="Strengths" onNext={() => setStep("report-3")}>
            <p className="text-slate-700">You already have meaningful foundations:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              {report.strengths.map((strength) => <li key={strength}>{strength}</li>)}
            </ul>
          </ReportCard>
        )}

        {step === "report-3" && report && (
          <ReportCard title="Structural Challenges" onNext={() => setStep("report-4")}>
            <p className="text-slate-700">The main structural issues to address now are:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              {report.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
            </ul>
          </ReportCard>
        )}

        {step === "report-4" && report && (
          <ReportCard title="Strategic Focus" onNext={() => setStep("email-offer")}>
            <p className="text-slate-700">{report.recommendation}</p>
          </ReportCard>
        )}

        {step === "email-offer" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Would you like to receive the full report in your email?</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setStep("booking")} className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Yes, send it</button>
              <button onClick={() => setStep("booking")} className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">No thanks</button>
            </div>
          </section>
        )}

        {step === "booking" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-3xl font-bold text-slate-900">Strategic Session with BIEM</h2>
            <p className="mt-3 text-slate-700">If you would like to go deeper into your case, you can schedule a free strategic session with Bethania from BIEM.</p>
            <p className="mt-4 text-slate-700">In this session we review:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>your diagnostic results</li>
              <li>structural challenges</li>
              <li>strategic direction for your business</li>
            </ul>
            <a href="https://cal.com" target="_blank" className="mt-6 inline-flex rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700" rel="noreferrer">View available dates</a>
          </section>
        )}
      </Container>
    </main>
  );
}

function ReportCard({ title, children, onNext }: { title: string; children: ReactNode; onNext: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
      <button onClick={onNext} className="mt-7 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Continue</button>
    </section>
  );
}
