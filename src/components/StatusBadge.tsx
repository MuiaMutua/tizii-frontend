interface StatusBadgeProps {
  status: string;
  variant?: "lemon" | "paon" | "pending" | "settled" | "refunded" | "processing" | "available" | "booked" | "blocked";
}

const StatusBadge = ({ status, variant }: StatusBadgeProps) => {
  const getClassName = () => {
    if (variant) return `badge badge-${variant.toLowerCase()}`;
    
    // Auto-detect based on status string
    const s = status.toLowerCase();
    if (s.includes("confirm") || s.includes("settled") || s.includes("success")) return "badge badge-settled";
    if (s.includes("pend") || s.includes("wait") || s.includes("process")) return "badge badge-pending";
    if (s.includes("cancel") || s.includes("refund")) return "badge badge-refunded";
    if (s.includes("avail")) return "badge badge-available";
    if (s.includes("book")) return "badge badge-booked";
    if (s.includes("block")) return "badge badge-blocked";
    
    return "badge badge-lemon";
  };

  return (
    <span className={getClassName()}>
      {status}
    </span>
  );
};

export default StatusBadge;
