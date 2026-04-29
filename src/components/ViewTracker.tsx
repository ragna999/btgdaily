"use client";
import { useEffect } from "react";

function getSessionId(): string {
  let id = localStorage.getItem("bdaily_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("bdaily_session_id", id);
  }
  return id;
}

export default function ViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    const sessionId = getSessionId();
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, sessionId }),
    });
  }, [articleId]);

  return null;
}
