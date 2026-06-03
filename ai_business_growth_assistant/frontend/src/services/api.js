import axios from "axios";
import {
  actionPlanItems,
  chatMessages,
  chatThreads,
  competitorIntelligence,
  dashboardOverview,
  mockAuthUser,
  recommendations,
  reviewAnalytics,
  swotMatrix,
  websiteAnalysis,
} from "../data/mockData";

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
  user: mockAuthUser,
};

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
  getOverview: async () =>
    safeRequest(() => apiClient.get("/dashboard/overview"), dashboardOverview),
};

export const analysisApi = {
  analyzeWebsite: async (payload) =>
    safeRequest(
      () => apiClient.post("/analysis/website", payload),
      websiteAnalysis,
    ),
  analyzeReviews: async (formData) =>
    safeRequest(
      () =>
        apiClient.post("/analysis/reviews", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      reviewAnalytics,
    ),
  analyzeCompetitors: async (payload) =>
    safeRequest(
      () => apiClient.post("/analysis/competitors", payload),
      competitorIntelligence,
    ),
  getSwot: async () =>
    safeRequest(() => apiClient.get("/analysis/swot"), swotMatrix),
  getRecommendations: async () =>
    safeRequest(() => apiClient.get("/analysis/recommendations"), recommendations),
  getActionPlan: async () =>
    safeRequest(() => apiClient.get("/analysis/action-plan"), actionPlanItems),
};

export const chatApi = {
  sendMessage: async (payload) =>
    safeRequest(
      () => apiClient.post("/chat/message", payload),
      {
        threads: chatThreads,
        messages: chatMessages,
        reply:
          "I can help you compare opportunities, summarize your review sentiment, or draft the next action plan.",
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
