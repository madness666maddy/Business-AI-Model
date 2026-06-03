from pydantic import BaseModel, Field


class ChatEmailAction(BaseModel):
    available: bool = False
    label: str = "Email a summary"
    recipient: str | None = None
    status: str | None = None


class ChatMessageResponse(BaseModel):
    threads: list[dict]
    messages: list[dict]
    reply: str
    intent: str = "business_question"
    intentLabel: str = "Business Q&A"
    confidence: float = 0.0
    followUpQuestion: str = ""
    suggestedReplies: list[str] = Field(default_factory=list)
    knowledgeSnippets: list[str] = Field(default_factory=list)
    emailAction: ChatEmailAction | None = None


class ChatEmailSummaryRequest(BaseModel):
    threadId: int = Field(ge=1)


class ChatEmailSummaryResponse(BaseModel):
    success: bool
    message: str
    recipient: str | None = None
    subject: str | None = None
    threadTitle: str | None = None
    providerId: str | None = None
