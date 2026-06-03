from pydantic import BaseModel, Field


class ChatMessageResponse(BaseModel):
    threads: list[dict]
    messages: list[dict]
    reply: str


