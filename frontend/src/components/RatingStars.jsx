const RatingStars = ({ rating = 0 }) => {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < filled ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

export default RatingStars;
