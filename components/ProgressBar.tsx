/*
  ProgressBar: one progress bar style for the whole app.
  - percent: 0–100 (use progressPercent() from lib/progress.ts)
  - label:   what it measures, read out by screen readers and shown above
  - detail:  optional words on the right, e.g. "3 of 8"
*/

type ProgressBarProps = {
  percent: number;
  label: string;
  detail?: string;
  showLabel?: boolean;
  className?: string;
};

export default function ProgressBar({ percent, label, detail, showLabel = true, className = "" }: ProgressBarProps) {
  const value = Math.round(Math.min(100, Math.max(0, percent)));
  return (
    <div className={`progress-bar ${className}`}>
      {showLabel && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span>{detail ?? `${value}%`}</span>
        </div>
      )}
      <div
        className="lesson-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={detail ? `${value}% (${detail})` : `${value}%`}
      >
        <div className="lesson-progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
