import './MealCard.css';
import { Star, Clock, Utensils } from 'lucide-react';

function MealCard({
  dish,
  mealType,
  time,
  rating,
  category,
  description,
  onRate
}) {
  return (
    <article className="meal-card">
      <div className="meal-card-image">
        <div className="meal-placeholder">
          <Utensils size={34} />
        </div>

        {category && (
          <span className="meal-category">{category}</span>
        )}
      </div>

      <div className="meal-card-content">
        <div className="meal-card-meta">
          <span>{mealType}</span>
          {time && (
            <span className="meal-time">
              <Clock size={13} />
              {time}
            </span>
          )}
        </div>

        <h3>{dish}</h3>

        {description && (
          <p className="meal-description">{description}</p>
        )}

        <div className="meal-card-footer">
          <div className="meal-rating">
            <Star size={16} fill="currentColor" />
            <strong>{rating ?? 'New'}</strong>
            <span>/ 5</span>
          </div>

          {onRate && (
            <button className="meal-rate-button" onClick={onRate}>
              Rate dish
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default MealCard;
