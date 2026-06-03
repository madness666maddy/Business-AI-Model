from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Iterable

try:  # pragma: no cover - optional dependency in lightweight environments
    import numpy as np
except ImportError:  # pragma: no cover
    np = None


TOKEN_PATTERN = re.compile(r"[a-z0-9']+")


INTENT_LABELS: dict[str, str] = {
    "greeting": "Greeting",
    "website_analysis": "Website Analysis",
    "review_intelligence": "Review Intelligence",
    "competitor_intelligence": "Competitor Intelligence",
    "swot_analysis": "SWOT Analysis",
    "recommendations": "Recommendations",
    "priority_planning": "Priority Planning",
    "email_summary": "Email Summary",
    "business_question": "Business Q&A",
    "support": "Support / Fix Issue",
    "gratitude": "Thanks / Wrap Up",
}


INTENT_SUGGESTIONS: dict[str, list[str]] = {
    "greeting": [
        "Show my business health score",
        "Analyze my website",
        "Compare my competitors",
    ],
    "website_analysis": [
        "Summarize the SEO issues",
        "Highlight CTA and conversion blockers",
        "Turn this into a fix-it checklist",
    ],
    "review_intelligence": [
        "Show the top complaints",
        "Summarize positive feedback",
        "Extract the main customer topics",
    ],
    "competitor_intelligence": [
        "Compare booking features",
        "Show SEO gaps against competitors",
        "Find content opportunities",
    ],
    "swot_analysis": [
        "List the biggest strengths",
        "Turn SWOT into action steps",
        "Show the highest-risk threats",
    ],
    "recommendations": [
        "Show the evidence-backed recommendations",
        "Estimate the revenue impact",
        "Build a 90-day growth plan",
    ],
    "priority_planning": [
        "Rank tasks by impact and effort",
        "Show the fastest wins first",
        "Assign owners and deadlines",
    ],
    "email_summary": [
        "Email a summary of this chat",
        "Prepare a client-ready recap",
        "Send the next steps to my inbox",
    ],
    "business_question": [
        "Explain what matters most",
        "Give me the next best action",
        "Compare the findings across pages",
    ],
    "support": [
        "Help me fix the assistant flow",
        "Re-run the business analysis",
        "Show me how to use the dashboard",
    ],
    "gratitude": [
        "Show another recommendation",
        "Give me the next best step",
        "Wrap this into a short plan",
    ],
}


INTENT_KEYWORDS: dict[str, list[str]] = {
    "greeting": ["hello", "hi", "hey", "start", "good morning", "good afternoon"],
    "website_analysis": [
        "website",
        "site",
        "seo",
        "search",
        "analyze",
        "analysis",
        "audit",
        "issues",
        "biggest issues",
        "meta",
        "title",
        "cta",
        "landing page",
        "homepage",
        "conversion",
        "speed",
        "check",
    ],
    "review_intelligence": [
        "review",
        "reviews",
        "sentiment",
        "complaint",
        "complaints",
        "feedback",
        "rating",
        "customer",
        "google reviews",
        "topic",
    ],
    "competitor_intelligence": [
        "competitor",
        "competitors",
        "competitor analysis",
        "benchmark",
        "compare",
        "gap",
        "rivals",
        "feature comparison",
    ],
    "swot_analysis": ["swot", "strength", "weakness", "opportunity", "threat"],
    "recommendations": [
        "recommendation",
        "recommendations",
        "what should i do",
        "next steps",
        "best actions",
        "growth plan",
        "improve",
    ],
    "priority_planning": [
        "priority",
        "prioritize",
        "rank",
        "effort",
        "impact",
        "roadmap",
        "action plan",
        "90 day",
    ],
    "email_summary": [
        "email",
        "send summary",
        "share summary",
        "send report",
        "inbox",
        "mail",
        "forward",
    ],
    "business_question": [
        "how much",
        "revenue",
        "roi",
        "estimate",
        "explain",
        "understand",
        "why",
        "what does this mean",
    ],
    "support": [
        "not working",
        "bug",
        "error",
        "help",
        "retry",
        "problem",
        "fix",
        "broken",
    ],
    "gratitude": ["thanks", "thank you", "appreciate", "great", "nice"],
}


INTENT_FOLLOW_UPS: dict[str, str] = {
    "greeting": "Would you like me to start with the website, reviews, or competitors?",
    "website_analysis": "Do you want the SEO, CTA, or service-page gaps first?",
    "review_intelligence": "Should I focus on complaints, positive feedback, or topic trends?",
    "competitor_intelligence": "Would you like a feature comparison or an SEO gap analysis?",
    "swot_analysis": "Do you want the SWOT summary or the action priorities next?",
    "recommendations": "Should I rank these by impact, effort, or revenue potential?",
    "priority_planning": "Do you want a 7-day quick win plan or a 90-day roadmap?",
    "email_summary": "Who should I send the summary to?",
    "business_question": "Should I connect this to your website, reviews, or competitors?",
    "support": "Is the issue with the chat flow, the dashboard, or an analysis page?",
    "gratitude": "Happy to help. Want me to turn this into a short action plan?",
}


TRAINING_EXAMPLES: dict[str, list[str]] = {
    "greeting": [
        "hello there",
        "hi assistant",
        "hey, can you help me",
        "good morning team",
        "start the business review",
        "i want to begin",
    ],
    "website_analysis": [
        "analyze my website seo",
        "check my site speed and cta placement",
        "review the homepage and landing pages",
        "what website issues are hurting conversions",
        "find technical seo gaps on my site",
        "audit the website for local search",
    ],
    "review_intelligence": [
        "summarize the google reviews",
        "what are the biggest customer complaints",
        "show positive feedback from customers",
        "analyze review sentiment and topics",
        "find patterns in my reviews",
        "what do customers keep saying",
    ],
    "competitor_intelligence": [
        "compare me with my competitors",
        "show a competitor benchmark",
        "find content gaps against rivals",
        "analyze competitor websites",
        "compare booking features across businesses",
        "what are competitors doing better",
    ],
    "swot_analysis": [
        "build a swot analysis",
        "show strengths weaknesses opportunities threats",
        "give me the swot matrix",
        "what are the biggest threats and opportunities",
        "summarize my strengths and weaknesses",
        "turn the swot into business advice",
    ],
    "recommendations": [
        "give me recommendations",
        "what should i improve first",
        "show evidence backed growth ideas",
        "tell me the best next actions",
        "how can i grow revenue",
        "recommend the most useful improvements",
    ],
    "priority_planning": [
        "rank the tasks by impact and effort",
        "build a priority action plan",
        "create a 90 day roadmap",
        "what should happen first second and third",
        "show the fastest wins",
        "assign owners and due dates",
    ],
    "email_summary": [
        "email me the summary",
        "send this report to my inbox",
        "share the conversation by email",
        "forward the findings to my email",
        "prepare a client summary email",
        "send a recap of this chat",
    ],
    "business_question": [
        "what does this mean for revenue",
        "explain the business impact",
        "estimate roi from these changes",
        "why is this important",
        "help me understand the findings",
        "how much growth could this drive",
    ],
    "support": [
        "the assistant is not working",
        "i found an error",
        "please retry the analysis",
        "there is a bug on the page",
        "help me with the dashboard",
        "fix the chat assistant",
    ],
    "gratitude": [
        "thanks for the help",
        "thank you that is useful",
        "great work",
        "appreciate it",
        "nice summary",
        "perfect thanks",
    ],
}


@dataclass
class IntentPrediction:
    intent: str
    intent_label: str
    confidence: float
    probabilities: dict[str, float]
    suggested_replies: list[str]
    follow_up_question: str = ""
    should_email_summary: bool = False


class BusinessIntentRNN:
    def __init__(self, hidden_size: int = 24, learning_rate: float = 0.04, epochs: int = 72) -> None:
        self.hidden_size = hidden_size
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.intent_order = list(INTENT_LABELS.keys())
        self.intent_to_index = {intent: index for index, intent in enumerate(self.intent_order)}
        self.vocab = self._build_vocab()
        self._use_numpy = np is not None
        self._trained = False
        self._rng = np.random.default_rng(42) if self._use_numpy else None

        if self._use_numpy:
            self._initialize_weights()
            self._train_model()

    def predict(self, text: str, context_texts: Iterable[str] | None = None) -> IntentPrediction:
        combined_text = self._combine_context(text, context_texts)
        tokens = self._tokenize(combined_text)

        rnn_scores = self._predict_rnn_scores(tokens)
        rule_scores = self._predict_rule_scores(combined_text, tokens)

        blended_scores = []
        for intent_index, intent in enumerate(self.intent_order):
            rnn_score = rnn_scores[intent_index] if intent_index < len(rnn_scores) else 0.0
            blended_scores.append(0.72 * rnn_score + 0.28 * rule_scores[intent])

        total = sum(blended_scores)
        if total > 0:
            blended_scores = [score / total for score in blended_scores]
        else:
            blended_scores = [1.0 / len(self.intent_order) for _ in self.intent_order]

        top_index = max(range(len(blended_scores)), key=lambda index: blended_scores[index])
        intent = self.intent_order[top_index]
        confidence = float(blended_scores[top_index])

        if confidence < 0.45:
            keyword_intent = max(rule_scores, key=rule_scores.get)
            if rule_scores[keyword_intent] > 0:
                intent = keyword_intent
                confidence = float(min(0.94, 0.52 + rule_scores[keyword_intent] * 0.35))

        lowered_text = combined_text.lower()
        website_signals = ["website", "site", "seo", "landing page", "homepage", "cta", "conversion"]
        if any(signal in lowered_text for signal in website_signals) and rule_scores["website_analysis"] > 0:
            intent = "website_analysis"
            confidence = float(max(confidence, min(0.96, 0.65 + rule_scores["website_analysis"] * 0.25)))

        follow_up = INTENT_FOLLOW_UPS.get(intent, "")
        should_email_summary = intent == "email_summary" or "email" in tokens or "summary" in tokens

        return IntentPrediction(
            intent=intent,
            intent_label=INTENT_LABELS[intent],
            confidence=round(confidence, 3),
            probabilities={intent_name: round(score, 4) for intent_name, score in zip(self.intent_order, blended_scores)},
            suggested_replies=INTENT_SUGGESTIONS.get(intent, INTENT_SUGGESTIONS["business_question"])[:3],
            follow_up_question=follow_up,
            should_email_summary=should_email_summary,
        )

    def _build_vocab(self) -> dict[str, int]:
        vocabulary = {"<unk>": 0}
        for phrases in TRAINING_EXAMPLES.values():
            for phrase in phrases:
                for token in self._tokenize(phrase):
                    if token not in vocabulary:
                        vocabulary[token] = len(vocabulary)

        for phrases in INTENT_KEYWORDS.values():
            for phrase in phrases:
                for token in self._tokenize(phrase):
                    if token not in vocabulary:
                        vocabulary[token] = len(vocabulary)

        return vocabulary

    def _initialize_weights(self) -> None:
        vocab_size = len(self.vocab)
        intent_count = len(self.intent_order)
        self.Wxh = self._rng.normal(0.0, 0.08, size=(self.hidden_size, vocab_size))
        self.Whh = self._rng.normal(0.0, 0.08, size=(self.hidden_size, self.hidden_size))
        self.bh = np.zeros(self.hidden_size)
        self.Why = self._rng.normal(0.0, 0.08, size=(intent_count, self.hidden_size))
        self.by = np.zeros(intent_count)

    def _train_model(self) -> None:
        samples: list[tuple[list[int], int]] = []
        for intent, phrases in TRAINING_EXAMPLES.items():
            label_index = self.intent_to_index[intent]
            for phrase in phrases:
                samples.append((self._encode(phrase), label_index))

        if not samples:
            return

        for _ in range(self.epochs):
            self._rng.shuffle(samples)
            for token_ids, label_index in samples:
                states, logits = self._forward(token_ids)
                probabilities = self._softmax(logits)

                dy = probabilities.copy()
                dy[label_index] -= 1.0

                dWhy = np.outer(dy, states[-1])
                dby = dy.copy()
                dh = self.Why.T @ dy
                dWxh = np.zeros_like(self.Wxh)
                dWhh = np.zeros_like(self.Whh)
                dbh = np.zeros_like(self.bh)

                for position in reversed(range(len(token_ids))):
                    hidden_state = states[position + 1]
                    previous_state = states[position]
                    dh_raw = dh * (1.0 - hidden_state * hidden_state)
                    dbh += dh_raw
                    dWxh[:, token_ids[position]] += dh_raw
                    dWhh += np.outer(dh_raw, previous_state)
                    dh = self.Whh.T @ dh_raw

                self.Wxh -= self.learning_rate * np.clip(dWxh, -4.0, 4.0)
                self.Whh -= self.learning_rate * np.clip(dWhh, -4.0, 4.0)
                self.bh -= self.learning_rate * np.clip(dbh, -4.0, 4.0)
                self.Why -= self.learning_rate * np.clip(dWhy, -4.0, 4.0)
                self.by -= self.learning_rate * np.clip(dby, -4.0, 4.0)

        self._trained = True

    def _predict_rnn_scores(self, token_sources: Iterable[str]) -> list[float]:
        if not self._use_numpy:
            return [1.0 / len(self.intent_order) for _ in self.intent_order]

        token_ids = self._encode(" ".join(token_sources) if isinstance(token_sources, list) else str(token_sources))
        if not token_ids:
            token_ids = [0]

        _, logits = self._forward(token_ids)
        probabilities = self._softmax(logits)
        return probabilities.tolist()

    def _predict_rule_scores(self, text: str, tokens: Iterable[str]) -> dict[str, float]:
        token_set = set(tokens)
        lowered = f" {text.lower()} "
        scores: dict[str, float] = {}

        for intent, phrases in INTENT_KEYWORDS.items():
            matches = 0.0
            for phrase in phrases:
                normalized_phrase = phrase.lower().strip()
                if " " in normalized_phrase:
                    if f" {normalized_phrase} " in lowered:
                        matches += 1.35
                elif normalized_phrase in token_set:
                    matches += 1.0

            scores[intent] = min(1.0, matches / 3.0)

        return scores

    def _forward(self, token_ids: list[int]) -> tuple[list["np.ndarray"], "np.ndarray"]:
        hidden_states = [np.zeros(self.hidden_size)]
        hidden = hidden_states[0]

        for token_id in token_ids:
            input_column = self.Wxh[:, token_id]
            hidden = np.tanh(input_column + self.Whh @ hidden + self.bh)
            hidden_states.append(hidden)

        logits = self.Why @ hidden + self.by
        return hidden_states, logits

    def _softmax(self, logits: "np.ndarray") -> "np.ndarray":
        shifted = logits - np.max(logits)
        exp_values = np.exp(shifted)
        total = np.sum(exp_values)
        if total <= 0:
            return np.full_like(logits, 1.0 / len(logits))
        return exp_values / total

    def _tokenize(self, text: str) -> list[str]:
        return TOKEN_PATTERN.findall(text.lower())

    def _encode(self, text: str) -> list[int]:
        tokens = self._tokenize(text)
        if not tokens:
            return [0]
        return [self.vocab.get(token, 0) for token in tokens]

    def _combine_context(self, text: str, context_texts: Iterable[str] | None) -> str:
        parts = [str(part).strip() for part in (context_texts or []) if str(part).strip()]
        parts.append(text.strip())
        return " ".join(parts)
