/*
  TopicStatusBadge: a topic's status as an icon plus words, so it never
  relies on color alone (see STATUS_LABELS in lib/skillChecks.ts).
*/

import { STATUS_LABELS, type TopicStatus } from "../../lib/skillChecks";

export default function TopicStatusBadge({ status }: { status: TopicStatus }) {
  const { icon, label } = STATUS_LABELS[status];
  return (
    <span className={`topic-status topic-status-${status}`}>
      <span aria-hidden="true">{icon}</span> {label}
    </span>
  );
}
