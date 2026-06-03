import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const rawToken = window.localStorage.getItem("abga_token");

    if (rawToken) {
      config.headers = config.headers || {};
      try {
        const token = JSON.parse(rawToken);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Ignore malformed local storage values and continue without auth.
      }
    }
  }

  return config;
});

function triggerDownload(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

const fallbackAuth = {
  access_token: "demo-token",
  token_type: "bearer",
  user: {
    id: 1,
    fullName: "Business Owner",
    businessName: "Your Business",
    email: "owner@example.com",
    role: "Business Owner",
    initials: "AB",
  },
};

function emptyAnalysis(url = "") {
  return {
    url,
    score: 0,
    subtitle: "Connect the backend to generate a live website analysis.",
    seoMetrics: [],
    contactSignals: [],
    ctaFindings: [],
    serviceFindings: [],
    opportunities: [],
  };
}

function emptyChatResponse(message = "") {
  const timestamp = "Now";
  return {
    threads: [],
    messages: message
      ? [
          {
            id: Date.now(),
            role: "user",
            timestamp,
            text: message,
          },
          {
            id: Date.now() + 1,
            role: "assistant",
            timestamp,
            text: "Connect the backend to get a live advisor response.",
          },
        ]
      : [],
    reply: message ? "Connect the backend to get a live advisor response." : "Connect the backend to start a live advisor conversation.",
    intent: "business_question",
    intentLabel: "Business guidance",
    confidence: 0,
    followUpQuestion: "",
    suggestedReplies: [],
    knowledgeSnippets: [],
    emailAction: {
      available: false,
      label: "Email a summary",
      recipient: null,
      status: "Unavailable until the backend is running",
    },
  };
}

async function safeRequest(requestFn, fallbackValue) {
  try {
    const response = await requestFn();
    return response.data;
  } catch {
    return fallbackValue;
  }
}

export const authApi = {
  login: async (credentials) =>
    safeRequest(
      () => apiClient.post("/auth/login", credentials),
      fallbackAuth,
    ),
  register: async (payload) =>
    safeRequest(
      () => apiClient.post("/auth/register", payload),
      fallbackAuth,
    ),
};

export const dashboardApi = {
  getOverview: async () => ({ businessName: "", website: "", dateRange: "", summaryCards: [] }),
};

export const analysisApi = {
  analyzeWebsite: async (payload) =>
    safeRequest(
      () => apiClient.post("/analysis/website", payload),
      emptyAnalysis(payload?.url || ""),
    ),
  extractOcr: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return safeRequest(
      () =>
        apiClient.post("/analysis/ocr", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      {
        text: "",
        sourceName: file?.name || "uploaded file",
        characterCount: 0,
        storedInKnowledgeBase: false,
      },
    );
  },
  analyzeReviews: async () =>
    safeRequest(
      () => apiClient.post("/analysis/reviews", new FormData(), {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      { totalReviews: 0, sentimentBreakdown: [], trend: [], topComplaints: [], topPraises: [], topics: [] },
    ),
  analyzeCompetitors: async () =>
    safeRequest(() => apiClient.post("/analysis/competitors", { urls: [] }), { competitors: [], featureMatrix: [], seoComparison: [], contentGap: [] }),
  getSwot: async () => safeRequest(() => apiClient.get("/analysis/swot"), { strengths: [], weaknesses: [], opportunities: [], threats: [] }),
  getRecommendations: async () => safeRequest(() => apiClient.get("/analysis/recommendations"), []),
  getActionPlan: async () => safeRequest(() => apiClient.get("/analysis/action-plan"), []),
};

export const chatApi = {
  sendMessage: async (payload) =>
    safeRequest(
      () => apiClient.post("/chat/message", payload),
      emptyChatResponse(payload?.message || ""),
    ),
  sendSummaryEmail: async (payload) =>
    safeRequest(
      () => apiClient.post("/chat/email-summary", payload),
      {
        success: false,
        message: "Email summaries need the backend and Resend integration to be running.",
        recipient: null,
        subject: null,
      },
    ),
};

export const settingsApi = {
  saveSettings: async (payload) =>
    safeRequest(() => apiClient.post("/settings", payload), { success: true }),
};

export const reportApi = {
  downloadPdf: async () => {
    const response = await apiClient.get("/reports/pdf", {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    triggerDownload(blob, "ai-business-growth-assistant-report.pdf");
    return { success: true };
  },
};
