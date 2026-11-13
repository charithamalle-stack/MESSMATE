import './StatCard.css';
import { TrendingDown, TrendingUp } from 'lucide-react';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = 'up'
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>

        {Icon && (
          <div className="stat-card-icon">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      <div className="stat-card-bottom">
        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trendType === 'down'
              ? <TrendingDown size={14} />
              : <TrendingUp size={14} />
            }
            {trend}
          </span>
        )}

        {description && (
          <span className="stat-card-description">{description}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
