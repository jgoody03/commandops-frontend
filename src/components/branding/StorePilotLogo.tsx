import clsx from "clsx";

type Props = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: {
    icon: "h-7 w-7",
    text: "text-lg",
    gap: "gap-2.5",
  },
  md: {
    icon: "h-9 w-9",
    text: "text-xl",
    gap: "gap-3",
  },
  lg: {
    icon: "h-11 w-11",
    text: "text-2xl",
    gap: "gap-3.5",
  },
};

export default function StorePilotLogo({
  className,
  iconClassName,
  textClassName,
  showWordmark = true,
  inverted = false,
  size = "md",
}: Props) {
  const palette = inverted
    ? {
        stroke: "#FFFFFF",
        fill: "#FFFFFF",
        text: "text-white",
        sub: "text-slate-300",
      }
    : {
        stroke: "#0F172A",
        fill: "#0F172A",
        text: "text-slate-900",
        sub: "text-slate-500",
      };

  const sizing = sizeMap[size];

  return (
    <div className={clsx("inline-flex items-center", sizing.gap, className)}>
      <svg
        viewBox="0 0 64 64"
        className={clsx("shrink-0", sizing.icon, iconClassName)}
        aria-label="StorePilot logo"
        role="img"
      >
        <circle
          cx="32"
          cy="32"
          r="17"
          stroke={palette.stroke}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M32 12C43.046 12 52 20.954 52 32"
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 18C39.732 18 46 24.268 46 32"
          stroke={palette.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.72"
          fill="none"
        />
        <circle cx="32" cy="32" r="4.5" fill={palette.fill} />
      </svg>

      {showWordmark ? (
        <div className="flex min-w-0 flex-col">
          <div
            className={clsx(
              "font-semibold tracking-tight leading-none",
              sizing.text,
              palette.text,
              textClassName
            )}
          >
            StorePilot
          </div>
          <div className={clsx("mt-1 text-[11px] uppercase tracking-[0.16em] leading-none", palette.sub)}>
            Calm control
          </div>
        </div>
      ) : null}
    </div>
  );
}