const RatingStars = ({ rating = 0, size = "sm" }) => {
  const filled = Math.round(rating);
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  };

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < filled ? "text-amber-400" : "text-slate-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
