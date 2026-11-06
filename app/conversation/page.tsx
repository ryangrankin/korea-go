"use client";

/*
  Conversation tab: pick a travel scenario, then talk with a simulated
  Korean speaker by building sentences from a word bank. Rule-based (no AI):
  see data/conversations.ts and lib/conversationEngine.ts.
*/

import Link from "next/link";
import BottomNav from "../../components/BottomNav";
import { scenarios } from "../../data/conversations";
import { useConversationProgress } from "../../lib/conversationProgress";
import "../../components/conversation/conversation.css";

export default function ConversationPage() {
  const progress = useConversationProgress();

  return (
    <main className="basic-page convo-page">
      <div className="basic-container">
        <h1>Conversation 💬</h1>
        <p className="page-description">
          Talk your way through real travel situations. A Korean speaker starts the conversation — you build each
          answer by tapping words, and they respond to what you say. No typing, and there&apos;s more than one right answer.
        </p>

        <div className="convo-scenarios">
          {scenarios.map((scenario) => {
            const record = progress[scenario.id];
            return (
              <Link key={scenario.id} href={`/conversation/${scenario.id}`} className="convo-scenario">
                <span className="convo-icon" aria-hidden="true">{scenario.icon}</span>
                <span className="convo-scenario-text">
                  <strong>{scenario.title}</strong>
                  <span>{scenario.goal}</span>
                  <small>
                    {scenario.level} · {scenario.minutes}
                  </small>
                  {record && record.completions > 0 && (
                    <small className="convo-done-badge">
                      ✓ Completed {record.completions}× · {record.sentences} correct sentences
                    </small>
                  )}
                </span>
                <span className="lesson-arrow" aria-hidden="true">›</span>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
