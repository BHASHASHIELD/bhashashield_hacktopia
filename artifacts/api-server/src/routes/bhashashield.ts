import { Router, type IRouter } from "express";
import {
  AnalyzeCallBody,
  AnalyzeCallResponse,
  CreateTrustedPersonBody,
  CreateTrustedPersonResponse,
  ListDemoScenariosResponse,
  ListDirectoryEntriesResponse,
  ListTrustedPeopleResponse,
  SubmitFeedbackBody,
  SubmitFeedbackResponse,
  VerifyDirectoryNumberBody,
  VerifyDirectoryNumberResponse,
  GetDashboardResponse,
  type Analysis,
  type AnalysisSummary,
  type DemoScenario,
  type DirectoryEntry,
  type TrustedPerson,
} from "@workspace/api-zod";

const router: IRouter = Router();

const scenarios: DemoScenario[] = [
  {
    id: "safe-family",
    label: "Safe family call",
    description: "A known contact calling from their saved number with no sensitive request.",
    expectedLevel: "LOW",
    caller: "Dad · saved contact",
    transcript: "Beta, main ghar pahunch gaya. Kal shaam ko milte hain. Take care.",
    voiceClass: "human",
    accent: "Hindi + English",
  },
  {
    id: "human-scam",
    label: "Human scam",
    description: "A real human voice creates urgency and asks for a one-time password.",
    expectedLevel: "CRITICAL",
    caller: "Unknown number",
    transcript: "Aapka bank account suspend ho jayega. Abhi OTP bata dijiye, warna legal action hoga.",
    voiceClass: "human",
    accent: "Hindi + English",
  },
  {
    id: "ai-impersonation",
    label: "AI voice impersonation",
    description: "A synthetic voice impersonates a trusted person and asks for an urgent transfer.",
    expectedLevel: "CRITICAL",
    caller: "Unknown number · claims to be Dad",
    transcript: "Main Dad bol raha hoon. Phone kho gaya hai, turant ₹80,000 transfer kar do. Kisi ko mat batana.",
    voiceClass: "synthetic",
    accent: "English",
  },
  {
    id: "scheme-scam",
    label: "Government scheme scam",
    description: "A real scheme from the profile is weaponised with urgency and an OTP request.",
    expectedLevel: "CRITICAL",
    caller: "Unknown number · claims to be scheme desk",
    transcript: "Aapki PM benefit renewal aaj expire ho rahi hai. OTP share kijiye, warna payment ruk jayega.",
    voiceClass: "human",
    accent: "Hindi + English",
  },
  {
    id: "scheme-legit",
    label: "Legitimate scheme conversation",
    description: "A relevant scheme is discussed through a verified channel without a credential request.",
    expectedLevel: "LOW",
    caller: "Verified government directory",
    transcript: "Aapka scheme application receive hua hai. Status dekhne ke liye official portal par sign in kijiye.",
    voiceClass: "human",
    accent: "Hindi",
  },
  {
    id: "bank-impersonation",
    label: "Bank impersonation",
    description: "An unknown caller claims bank authority and asks for an OTP.",
    expectedLevel: "CRITICAL",
    caller: "Unknown number · claims to be SBI",
    transcript: "Main SBI verification desk se bol raha hoon. KYC complete karne ke liye OTP abhi batayein.",
    voiceClass: "human",
    accent: "Hindi + English",
  },
  {
    id: "trusted-person",
    label: "Trusted person impersonation",
    description: "The caller claims to be a saved contact, but the number does not match.",
    expectedLevel: "CRITICAL",
    caller: "Unknown number · claims to be Mom",
    transcript: "Main Mom hoon, mera phone band hai. Is number par paise bhej do aur kisi ko mat batana.",
    voiceClass: "human",
    accent: "Hindi + English",
  },
];

const trustedPeople: TrustedPerson[] = [
  {
    id: "tp-dad",
    name: "Dad",
    relationship: "Parent",
    phone: "+91 98765 43210",
    verified: true,
    channel: "Phone call",
  },
  {
    id: "tp-mom",
    name: "Mom",
    relationship: "Parent",
    phone: "+91 98123 45678",
    verified: true,
    channel: "Phone call",
  },
  {
    id: "tp-sister",
    name: "Anika",
    relationship: "Sibling",
    phone: "+91 99887 11223",
    verified: true,
    channel: "WhatsApp",
  },
];

const directory: DirectoryEntry[] = [
  {
    id: "dir-sbi",
    institution: "State Bank of India",
    number: "1800 1234",
    category: "Banking",
    purpose: "Customer support",
    source: "Synthetic demo directory",
    priority: "High",
    lastVerified: "2026-09-29",
  },
  {
    id: "dir-cybercrime",
    institution: "National Cyber Crime Helpline",
    number: "1930",
    category: "Cybercrime",
    purpose: "Report financial fraud",
    source: "Synthetic demo directory",
    priority: "Critical",
    lastVerified: "2026-09-29",
  },
  {
    id: "dir-uidai",
    institution: "UIDAI",
    number: "1947",
    category: "Government services",
    purpose: "Aadhaar support",
    source: "Synthetic demo directory",
    priority: "High",
    lastVerified: "2026-09-29",
  },
  {
    id: "dir-insurance",
    institution: "Insurance Ombudsman",
    number: "1800 4254 732",
    category: "Insurance",
    purpose: "Policy grievance support",
    source: "Synthetic demo directory",
    priority: "Medium",
    lastVerified: "2026-09-29",
  },
];

const history: AnalysisSummary[] = [
  { id: "history-1", caller: "Unknown number", score: 94, level: "CRITICAL", time: "12 min ago", action: "VERIFY" },
  { id: "history-2", caller: "Dad · saved contact", score: 12, level: "LOW", time: "Yesterday", action: "CONTINUE" },
  { id: "history-3", caller: "Unknown number", score: 82, level: "HIGH", time: "Yesterday", action: "BLOCK" },
  { id: "history-4", caller: "Verified directory", score: 24, level: "LOW", time: "2 days ago", action: "CONTINUE" },
];

function scenarioFor(id: string, transcript?: string, voiceClass?: string): DemoScenario {
  const selected = scenarios.find((scenario) => scenario.id === id) ?? scenarios[1];
  return {
    ...selected,
    transcript: transcript?.trim() || selected.transcript,
    voiceClass: voiceClass || selected.voiceClass,
  };
}

function redactSensitive(text: string): string {
  return text
    .replace(/\b\d{4,8}\b/g, "[REDACTED]")
    .replace(/\b(otp|one[- ]time password|pin|cvv|password)\s*(is|:)?\s*[a-z0-9-]+/gi, "$1 [REDACTED]");
}

function createAnalysis(
  scenario: DemoScenario,
  offline = false,
  callerNumber = "+91 70000 12345",
): Analysis {
  const isSafe = scenario.id === "safe-family" || scenario.id === "scheme-legit";
  const scores: Record<string, number> = {
    "safe-family": 12,
    "human-scam": 86,
    "ai-impersonation": 96,
    "scheme-scam": 94,
    "scheme-legit": 22,
    "bank-impersonation": 91,
    "trusted-person": 88,
  };
  const score = scores[scenario.id] ?? 64;
  const level = score <= 25 ? "LOW" : score <= 50 ? "MEDIUM" : score <= 75 ? "HIGH" : "CRITICAL";
  const otpRequest = /otp|one[- ]time|verification code|kyc/i.test(scenario.transcript);
  const moneyRequest = /transfer|paise|₹|money/i.test(scenario.transcript);
  const urgency = /urgent|abhi|turant|today|expire|suspend|legal action|kisi ko mat/i.test(scenario.transcript);
  const schemeMatch = /scheme|benefit|renewal|payment/i.test(scenario.transcript);
  const bankMatch = /bank|sbi|kyc|account/i.test(scenario.transcript);
  const synthetic = scenario.voiceClass === "synthetic";
  const callerKnown = scenario.id === "safe-family";
  const channelVerified = scenario.id === "scheme-legit";
  const evidence = isSafe
    ? [
        channelVerified ? "Verified institutional channel" : "Known contact and saved number",
        "No credential or money request",
        "Conversation matches expected behaviour",
      ]
    : [
        ...(otpRequest ? ["Sensitive credential requested"] : []),
        ...(urgency ? ["Urgency or pressure detected"] : []),
        ...(synthetic ? ["Synthetic voice signal detected"] : []),
        ...(!callerKnown ? ["Caller number is not in trusted contacts"] : []),
        ...(schemeMatch ? ["Profile-linked scheme reference detected"] : []),
        ...(bankMatch ? ["Bank authority claim needs independent verification"] : []),
        ...(moneyRequest ? ["Money transfer requested"] : []),
      ];

  return AnalyzeCallResponse.parse({
    id: `analysis-${Date.now()}`,
    score,
    level,
    confidence: offline ? 0.73 : isSafe ? 0.94 : 0.91,
    caller: scenario.caller,
    callerNumber,
    channel: "Phone",
    language: scenario.accent ?? "Hindi + English",
    voice: {
      classification: synthetic ? "synthetic" : "human",
      probability: synthetic ? 0.92 : 0.12,
      confidence: offline ? 0.74 : 0.9,
      label: synthetic ? "Synthetic signal" : "Human signal",
    },
    intent: {
      type: otpRequest ? "OTP_REQUEST" : moneyRequest ? "MONEY_TRANSFER" : schemeMatch ? "SCHEME_REVIEW" : "GENERAL_CONVERSATION",
      urgency: urgency ? "HIGH" : "LOW",
      requestedAction: otpRequest ? "Share OTP" : moneyRequest ? "Send money" : "No sensitive action",
      socialEngineering: !isSafe && (otpRequest || moneyRequest || urgency),
    },
    context: {
      schemeMatch,
      bankingMatch: bankMatch,
      contextualMatch: schemeMatch || bankMatch,
      matchedContext: schemeMatch ? "PM benefit renewal" : bankMatch ? "Banking service" : "No profile context used",
      channelVerified,
    },
    behaviour: {
      anomalyScore: isSafe ? 0.08 : Math.min(0.99, score / 100),
      signals: isSafe
        ? ["Known contact", "Normal timing", "Expected conversation"]
        : ["Unknown or mismatched caller", ...(urgency ? ["Urgency"] : []), ...(otpRequest ? ["Credential request"] : []), ...(moneyRequest ? ["Unusual money request"] : [])],
    },
    evidence,
    explanation: isSafe
      ? "This interaction matches a known contact or verified channel and does not request sensitive information. Continue with normal caution."
      : `This call appears ${level.toLowerCase()} risk because ${evidence.slice(0, 3).join(", ").toLowerCase()}. Verify through an independent channel before sharing anything.`,
    recommendedAction: isSafe ? (score <= 25 ? "CONTINUE" : "VERIFY") : score >= 76 ? "VERIFY" : "VERIFY",
    analysisMode: offline ? "Offline / Limited Analysis" : "Full signal analysis",
    transcript: redactSensitive(scenario.transcript),
    analyzedAt: new Date().toISOString(),
  });
}

router.get("/dashboard", (_req, res) => {
  res.json(
    GetDashboardResponse.parse({
      totalAnalyses: 24,
      highRiskCount: 9,
      protectedContextCount: 14,
      averageScore: 57,
      recentAnalyses: history,
      systemStatus: "All protection layers online",
    }),
  );
});

router.get("/demo-scenarios", (_req, res) => {
  res.json(ListDemoScenariosResponse.parse(scenarios));
});

router.post("/analyze", (req, res) => {
  const input = AnalyzeCallBody.parse(req.body);
  const scenario = scenarioFor(input.scenarioId, input.transcript, input.voiceClass);
  const analysis = createAnalysis(scenario, input.offline, input.callerNumber);
  history.unshift({
    id: analysis.id,
    caller: analysis.caller,
    score: analysis.score,
    level: analysis.level,
    time: "Just now",
    action: analysis.recommendedAction,
  });
  history.splice(6);
  res.json(analysis);
});

router.post("/feedback", (req, res) => {
  const input = SubmitFeedbackBody.parse(req.body);
  res.json(
    SubmitFeedbackResponse.parse(
      {
        saved: true,
        message: `Feedback recorded as ${input.outcome}. Voice audio was not retained.`,
      },
    ),
  );
});

router.get("/trusted-people", (_req, res) => {
  res.json(ListTrustedPeopleResponse.parse(trustedPeople));
});

router.post("/trusted-people", (req, res) => {
  const input = CreateTrustedPersonBody.parse(req.body);
  const person = CreateTrustedPersonResponse.parse({
    id: `tp-${Date.now()}`,
    ...input,
    verified: false,
  });
  trustedPeople.push(person);
  res.status(201).json(person);
});

router.get("/directory", (_req, res) => {
  res.json(ListDirectoryEntriesResponse.parse(directory));
});

router.post("/directory/verify", (req, res) => {
  const input = VerifyDirectoryNumberBody.parse(req.body);
  const institution = directory.find((entry) =>
    entry.institution.toLowerCase().includes(input.institution.toLowerCase()),
  );
  const numberMatches = Boolean(institution && (!input.number || input.number.replace(/\s/g, "") === institution.number.replace(/\s/g, "")));
  res.json(
    VerifyDirectoryNumberResponse.parse({
      verified: numberMatches,
      institution: institution?.institution ?? input.institution,
      officialNumber: institution?.number,
      message: institution
        ? numberMatches
          ? `Exact number match. Use ${institution.number} for independent verification.`
          : `Do not trust this number. The stored official number is ${institution.number}.`
        : "No exact institutional record found in the demo directory.",
    }),
  );
});

export default router;