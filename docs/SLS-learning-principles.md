# SLS learning principles in Korea GO!

This document explains how Second Language Studies (SLS) research shapes the
app, with the most detail on the **Conversation** tab (`/conversation`).
Content and rules live in editable files:

- `data/conversations.ts` — scenarios, word banks, dialogue steps, replies
- `lib/conversationEngine.ts` — rule-based sentence checking and feedback
- `lib/conversationState.ts` — the deterministic conversation state machine
- `components/conversation/ConversationSimulator.tsx` — the UI

No AI service is used: every response and piece of feedback comes from rules
written by the team, so the same answer always gets the same response.

## 1. Output Hypothesis (Swain)

Learners notice gaps in their knowledge when they have to *produce* language,
not only recognize it.

- In the Conversation tab learners **build** each sentence from single word
  tiles (김밥, 을, 주세요…). Whole sentences are never offered as choices.
- Particles and endings are separate tiles, so the learner must decide that
  김밥 needs 을, not 를.
- Lessons already include "Missions" where learners pick what to say; the
  Conversation tab moves one step further, from choosing to constructing.

## 2. Noticing Hypothesis (Schmidt)

Input becomes intake when learners consciously notice a form.

- Each scenario has a **"Notice"** focus on its introduction screen (e.g.
  을/를 after consonants and vowels, counters 개 and 잔).
- Feedback points to the exact form: *"김밥 ends in a consonant, so use 을 instead
  of 를."* and shows the corrected sentence.
- Sentence preview shows how tiles join with natural Korean spacing, making
  attachment of particles visible.

## 3. Task-Based Language Teaching (TBLT)

Learning is organized around real-world tasks with a clear outcome.

- Every scenario is a travel task with a goal: order food, ask a price and
  buy something, order drinks at a café.
- Success is defined by **completing the task** (the conversation reaches its
  end), not by matching one model sentence.
- Structure follows a task cycle: Introduction → Vocabulary preview →
  Conversation (task) → Feedback → Completion, with an invitation to repeat
  the task using different sentences.

## 4. Scaffolding (Vygotsky / Zone of Proximal Development)

Support is given while needed and can be removed as learners grow.

- **Translations** toggle: English under word tiles and speaker lines.
- **Hints** toggle: what to say next, with example answers.
- Both start ON for Beginner learners and OFF for others (from Settings), and
  learners can switch them at any time.
- Romanization follows the learner's Settings choice.
- Audio (🔊) for every tile, speaker line and the learner's own sentence.
- Lessons use similar scaffolding: romanization hints, slow audio, the
  "New to Korean letters?" card, and objectives at the start of each lesson.

## 5. Pragmatic competence

Knowing what is appropriate to say in context, not only what is grammatical.

- The engine separates **grammatical** from **appropriate right now**: if a
  learner builds a correct sentence that doesn't fit the moment (e.g. 감사합니다
  before ordering), it is marked as good Korean with an explanation of what the
  speaker is waiting for — never as "wrong".
- Speaker notes explain social meaning, e.g. answering a negative question
  ("더 필요한 거 없으세요?") with 네 or 아니요, and why 주세요 is the polite
  way to request.
- Lessons cover related pragmatics, such as 안녕히 가세요 vs. 안녕히 계세요
  depending on who is leaving.

## How feedback is categorized

| Status | Meaning | Tone |
| --- | --- | --- |
| valid | Correct Korean the engine recognizes | Praise + speaker replies (if it fits the step) |
| incomplete | Right idea, a piece is missing | Suggests what to add |
| invalid | A specific, known error (particle, word order, counter) | Names the rule and shows a fix |
| unrecognized | Not in the rules | Neutral: "this may not be wrong", suggests a pattern |

Multiple valid answers are accepted for every step (see tests in
`lib/conversationEngine.test.ts`), and progress counts every correct sentence,
so learners are encouraged to explore alternatives rather than memorize one.

## Adding or editing a scenario

1. Add tiles (Korean, English, romanization, grammatical role) to a scenario
   in `data/conversations.ts`.
2. Add steps with `task`, `hint`, `examples`, and the intents each step
   accepts (`order`, `askPrice`, `buy`, `yes`, `no`, `thanks`, …) with the
   speaker's reply and next step.
3. Run `npm test` — the engine tests check accepted answers and feedback.
4. Ask a fluent Korean speaker to review new lines before release.
