import { getScoreColor, getOverallStatus, SCORE_STATUS_MAP } from "@/types/assessment";

type ScoreCircleProps = {
  score: number;
  size?: "sm" | "md" | "lg";
};

const SIZE_CONFIG = {
  sm: { dim: 80, stroke: 6, textSize: "text-xl" },
  md: { dim: 112, stroke: 8, textSize: "text-2xl" },
  lg: { dim: 144, stroke: 10, textSize: "text-3xl" },
};

export function ScoreCircle({ score, size = "md" }: ScoreCircleProps) {
  const config = SIZE_CONFIG[size];
  const { dim, stroke } = config;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const status = getOverallStatus(score);
  const { label } = SCORE_STATUS_MAP[status];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          style={{ transform: "rotate(-90deg)" }}
          viewBox={`0 0 ${dim} ${dim}`}
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold leading-none ${config.textSize}`}
            style={{ color }}
          >
            {score}%
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{
          color: SCORE_STATUS_MAP[status].color,
          backgroundColor: SCORE_STATUS_MAP[status].bgColor,
        }}
      >
        {label}
      </span>
    </div>
  );
}
