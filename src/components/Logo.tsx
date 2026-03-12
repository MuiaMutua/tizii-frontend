interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = "", size = 120 }: LogoProps) => {
  const teal = "hsl(174 72% 46%)"; // Primary teal from your gradient

  const spokes = Array.from({ length: 12 }).map((_, i) => {
    const angle = (360 / 12) * i;
    return (
      <rect
        key={i}
        x="48"
        y="8"
        width="4"
        height="42"
        rx="2"
        fill={teal}
        transform={`rotate(${angle} 50 50)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 12 spokes */}
      {spokes}

      {/* Center circle */}
      <circle cx="50" cy="50" r="10" fill={teal} />
    </svg>
  );
};
