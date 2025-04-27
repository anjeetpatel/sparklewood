import type { Incident } from "@/lib/types"

export const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description:
      "Algorithm consistently favored certain demographics in job recommendations, leading to reduced visibility of opportunities for underrepresented groups. The issue was traced to training data imbalances.",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z",
    status: "In Review",
    category: "Bias",
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description:
      "LLM provided incorrect safety procedure information when asked about emergency protocols in a manufacturing setting. This could have led to dangerous situations if the information had been followed without verification.",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z",
    status: "New",
    category: "Hallucination",
    steps_to_reproduce: [
      "Ask the model about emergency shutdown procedures for chemical processing equipment",
      "Compare response with official safety documentation",
      "Note discrepancies in critical steps",
    ],
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description:
      "Chatbot inadvertently exposed non-sensitive user metadata in its responses. While no personal identifiable information was leaked, the incident revealed a potential vulnerability in the system's data handling.",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z",
    status: "Resolved",
    category: "Data Leak",
  },
  {
    id: 4,
    title: "Autonomous Vehicle Navigation Error",
    description:
      "AI navigation system misinterpreted road markings during heavy rain, causing the vehicle to briefly cross into the opposite lane. Safety systems caught and corrected the error, but the incident highlights weather-related perception challenges.",
    severity: "High",
    reported_at: "2025-03-25T16:45:00Z",
    status: "In Review",
    category: "Performance",
    assigned_to: "Engineering",
  },
  {
    id: 5,
    title: "Content Moderation False Positive",
    description:
      "AI content moderation system incorrectly flagged educational medical content as inappropriate, restricting access to valuable health information. The system was overly sensitive to anatomical terminology.",
    severity: "Medium",
    reported_at: "2025-03-10T11:20:00Z",
    status: "Resolved",
    category: "Bias",
  },
  {
    id: 6,
    title: "Facial Recognition Misidentification",
    description:
      "Facial recognition system incorrectly identified an individual in a security application, leading to a false security alert. Investigation revealed poor performance with certain lighting conditions.",
    severity: "Medium",
    reported_at: "2025-03-05T13:10:00Z",
    status: "Resolved",
    category: "Performance",
  },
  {
    id: 7,
    title: "Translation Error in Medical Instructions",
    description:
      "AI translation system mistranslated dosage instructions for medication, potentially leading to incorrect dosing. The error was caught during review before reaching patients.",
    severity: "High",
    reported_at: "2025-03-18T08:30:00Z",
    status: "New",
    category: "Hallucination",
    assigned_to: "AI Safety Team",
  },
  {
    id: 8,
    title: "Sentiment Analysis Bias in Customer Service",
    description:
      "Sentiment analysis tool consistently misinterpreted neutral feedback from non-native English speakers as negative, affecting customer service metrics and response prioritization.",
    severity: "Medium",
    reported_at: "2025-03-22T15:45:00Z",
    status: "In Review",
    category: "Bias",
  },
]
