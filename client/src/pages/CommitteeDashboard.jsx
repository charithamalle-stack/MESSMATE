


import { useMemo, useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Utensils,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  CalendarDays
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import './CommitteeDashboard.css';

const RATING_KEY = 'messmate_meal_ratings';
const FEEDBACK_KEY = 'messmate_feedback';

const DISHES = [
  ['Idli & Sambar', 'Rice & Dal', 'Vegetable Samosa', 'Chapati & Paneer Curry'],
  ['Masala Dosa', 'Veg Fried Rice', 'Bread Pakora', 'Vegetable Pulao'],
  ['Poha & Chutney', 'Sambar Rice', 'Bhel Puri', 'Aloo Paratha'],
  ['Pongal & Chutney', 'Curd Rice', 'Onion Pakoda', 'Dal Tadka & Roti'],
  ['Upma & Chutney', 'Vegetable Biryani', 'Fruit & Sprouts', 'Paneer Fried Rice'],
  ['Poori & Potato Curry', 'Tomato Rice', 'Veg Sandwich', 'Chapati & Mixed Curry'],
  ['Pesarattu', 'Meals Special', 'Sweet Corn Chaat', 'Veg Noodles']
];

const SLOTS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const FEEDBACK_SUBOPTIONS = {
  Taste: [
    'It tastes good.',
    'It tastes bad.',
    'It tastes raw.',
    'It tastes like it was made yesterday.'
  ],
  'Food Quality': [
    'Food is fresh and well-prepared.',
    'Food is stale.',
    'Food is overcooked or undercooked.',
    'Ingredients are of poor quality.'
  ],
  Quantity: [
    'Quantity is sufficient.',
    'Quantity is too little.',
    'Quantity is too much.',
    'Food gets over before everyone is served.'
  ],
  Hygiene: [
    'Food and utensils are clean.',
    'Food contains dirt or foreign particles.',
    'Serving area is not clean.',
    'Food is not properly covered.'
  ],
  Variety: [
    'Menu has good variety.',
    'Same dishes are repeated too often.',
    'More healthy options are needed.',
    'More new dishes should be introduced.'
  ]
};

function getCurrentWeekMeals() {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();

  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');

    return SLOTS.map((slot, slotIndex) => ({
      id: `${dateKey}-${slot.toLowerCase()}`,
      name: DISHES[index][slotIndex],
      slot
    }));
  }).flat();
}

function readStorage(key) {
  try {
    const fallback = key === RATING_KEY ? '{}' : '[]';
    const data = JSON.parse(localStorage.getItem(key) || fallback);

    if (key === RATING_KEY) {
      return data && typeof data === 'object' && !Array.isArray(data)
        ? data
        : {};
    }

    return Array.isArray(data) ? data : [];
  } catch {
    return key === RATING_KEY ? {} : [];
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Date not recorded';

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function CommitteeDashboard() {
  const [ratings, setRatings] = useState(() => readStorage(RATING_KEY));
  const [feedback, setFeedback] = useState(() => readStorage(FEEDBACK_KEY));

  const meals = useMemo(() => getCurrentWeekMeals(), []);

  // AUTOMATICALLY REFRESH DATA

  useEffect(() => {
    function refreshRatings() {
      setRatings(readStorage(RATING_KEY));
    }

    function refreshFeedback() {
      setFeedback(readStorage(FEEDBACK_KEY));
    }

    function refreshAll() {
      refreshRatings();
      refreshFeedback();
    }

    window.addEventListener('storage', refreshAll);
    window.addEventListener('messmate-ratings-updated', refreshRatings);
    window.addEventListener('messmate-feedback-updated', refreshFeedback);
    window.addEventListener('focus', refreshAll);

    const handleVisibility = () => {
      if (!document.hidden) refreshAll();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const refreshInterval = window.setInterval(refreshAll, 1500);

    return () => {
      window.removeEventListener('storage', refreshAll);
      window.removeEventListener('messmate-ratings-updated', refreshRatings);
      window.removeEventListener('messmate-feedback-updated', refreshFeedback);
      window.removeEventListener('focus', refreshAll);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(refreshInterval);
    };
  }, []);

  // WEEKLY MENU RATING CALCULATIONS

  const mealStats = meals.map((meal) => {
    const votes = Array.isArray(ratings[meal.id])
      ? ratings[meal.id]
      : [];

    const validVotes = votes.filter((item) => {
      const rating = Number(item?.rating);
      return Number.isFinite(rating) && rating >= 1 && rating <= 5;
    });

    const total = validVotes.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    return {
      ...meal,
      count: validVotes.length,
      average: validVotes.length ? total / validVotes.length : 0
    };
  });

  const ratedMeals = mealStats.filter((meal) => meal.count > 0);

  // TOTAL RATINGS FROM THE FEEDBACK FORM

  const validFeedbackRatings = feedback.filter((item) => {
    const rating = Number(item?.rating);
    return Number.isFinite(rating) && rating >= 1 && rating <= 5;
  });

  const totalVotes = validFeedbackRatings.length;

  const overallAverage = totalVotes
    ? validFeedbackRatings.reduce(
        (sum, item) => sum + Number(item.rating),
        0
      ) / totalVotes
    : 0;

  const rankedMeals = [...ratedMeals].sort(
    (a, b) => b.average - a.average
  );

  const bestMeal = rankedMeals[0];

  const worstMeal = rankedMeals.length
    ? rankedMeals[rankedMeals.length - 1]
    : null;

  // FEEDBACK CATEGORY COUNTS

  const categoryCounts = feedback.reduce((counts, item) => {
    const category = item.category || 'Other';
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  // SUB-OPTION RESPONSE COUNTS

  const subOptionCounts = feedback.reduce((counts, item) => {
    const options = Array.isArray(item.selectedOptions)
      ? item.selectedOptions
      : [];

    options.forEach((option) => {
      counts[option] = (counts[option] || 0) + 1;
    });

    return counts;
  }, {});

  const feedbackDetails = Object.entries(FEEDBACK_SUBOPTIONS).map(
    ([category, options]) => ({
      category,
      options: options.map((option) => ({
        label: option,
        count: subOptionCounts[option] || 0
      }))
    })
  );

  // KEYWORD-BASED COMPLAINT INSIGHTS

  const complaintKeywords = [
    { label: 'Taste', words: ['taste', 'tasteless', 'spicy', 'bland', 'salty'] },
    { label: 'Quality', words: ['quality', 'stale', 'fresh', 'undercooked', 'overcooked'] },
    { label: 'Quantity', words: ['quantity', 'portion', 'less food', 'not enough'] },
    { label: 'Hygiene', words: ['hygiene', 'clean', 'dirty', 'hair', 'unclean'] },
    { label: 'Variety', words: ['variety', 'repetitive', 'repeat', 'boring', 'same food'] }
  ];

  const complaintInsights = complaintKeywords.map((item) => {
    const matchingFeedback = feedback.filter((entry) => {
      const text = String(entry.comment || '').toLowerCase();
      return item.words.some((word) => text.includes(word));
    });

    return {
      label: item.label,
      count: matchingFeedback.length
    };
  }).sort((a, b) => b.count - a.count);

  // RECENT FEEDBACK

  const recentFeedback = [...feedback]
    .sort(
      (a, b) =>
        new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
    )
    .slice(0, 5);

  // DISH-WISE FEEDBACK

  const feedbackByDish = feedback.reduce((groups, item) => {
    const dishName = item.dish || 'Dish not specified';

    if (!groups[dishName]) {
      groups[dishName] = [];
    }

    groups[dishName].push(item);
    return groups;
  }, {});

  const dishFeedbackGroups = Object.entries(feedbackByDish)
    .map(([dish, entries]) => ({
      dish,
      entries: [...entries].sort(
        (a, b) =>
          new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
      )
    }))
    .sort((a, b) => b.entries.length - a.entries.length);

  return (
    <div className="dashboard-layout">
      <Sidebar role="committee" />

      <main className="dashboard-main">
        <div className="committee-content">

          {/* DASHBOARD HEADING */}

          <section className="committee-heading">
            <div>
              <span className="section-eyebrow">MESS MANAGEMENT</span>
              <h1>Committee Dashboard</h1>
              <p>
                Understand student experiences and make better food decisions.
              </p>
            </div>

            <div className="committee-live-label">
              <span />
              Current week overview
            </div>
          </section>

          {/* STATISTICS */}

          <section className="committee-stats">
            <div className="committee-stat-card">
              <div className="committee-stat-icon">
                <Star size={21} />
              </div>
              <span>Total Ratings</span>
              <strong>{totalVotes}</strong>
              <small>Star ratings submitted through feedback</small>
            </div>

            <div className="committee-stat-card">
              <div className="committee-stat-icon">
                <MessageSquare size={21} />
              </div>
              <span>Feedback Received</span>
              <strong>{feedback.length}</strong>
              <small>Student submissions</small>
            </div>

            <div className="committee-stat-card">
              <div className="committee-stat-icon">
                <TrendingUp size={21} />
              </div>
              <span>Overall Rating</span>
              <strong>{totalVotes ? overallAverage.toFixed(1) : '—'}/5</strong>
              <small>Average of feedback star ratings</small>
            </div>

            <div className="committee-stat-card">
              <div className="committee-stat-icon">
                <Utensils size={21} />
              </div>
              <span>Meals Rated</span>
              <strong>{ratedMeals.length}/28</strong>
              <small>Weekly Menu meals with votes</small>
            </div>
          </section>

          {/* BEST AND WORST MEALS */}

          <section className="committee-ranking-grid">
            <article className="committee-panel ranking-panel">
              <div className="committee-panel-heading">
                <div>
                  <span className="section-eyebrow">STUDENT FAVOURITE</span>
                  <h2>Top-rated meal</h2>
                </div>
                <TrendingUp size={21} />
              </div>

              {bestMeal ? (
                <>
                  <h3>{bestMeal.name}</h3>
                  <div className="ranking-rating">
                    <Star size={20} fill="currentColor" />
                    {bestMeal.average.toFixed(1)}/5
                  </div>
                  <p>{bestMeal.count} votes received</p>
                </>
              ) : (
                <p className="committee-empty">
                  No meal ratings available yet.
                </p>
              )}
            </article>

            <article className="committee-panel ranking-panel">
              <div className="committee-panel-heading">
                <div>
                  <span className="section-eyebrow">NEEDS ATTENTION</span>
                  <h2>Lowest-rated meal</h2>
                </div>
                <TrendingDown size={21} />
              </div>

              {worstMeal ? (
                <>
                  <h3>{worstMeal.name}</h3>
                  <div className="ranking-rating low-rating">
                    <Star size={20} fill="currentColor" />
                    {worstMeal.average.toFixed(1)}/5
                  </div>
                  <p>{worstMeal.count} votes received</p>
                </>
              ) : (
                <p className="committee-empty">
                  No meal ratings available yet.
                </p>
              )}
            </article>
          </section>

          {/* MEAL LEADERBOARD */}

          <section className="committee-panel">
            <div className="committee-panel-heading">
              <div>
                <span className="section-eyebrow">MEAL PERFORMANCE</span>
                <h2>Dish rating leaderboard</h2>
                <p>Ratings and vote counts for this week's meals.</p>
              </div>
              <BarChart3 size={23} />
            </div>

            <div className="committee-table-wrapper">
              <table className="committee-table">
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Meal slot</th>
                    <th>Average rating</th>
                    <th>Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedMeals.map((meal, index) => (
                    <tr key={meal.id}>
                      <td>
                        <span className="leaderboard-rank">
                          #{index + 1}
                        </span>
                        {meal.name}
                      </td>
                      <td>{meal.slot}</td>
                      <td>
                        <span className="table-rating">
                          <Star size={14} fill="currentColor" />
                          {meal.average.toFixed(1)}
                        </span>
                      </td>
                      <td>{meal.count}</td>
                    </tr>
                  ))}

                  {rankedMeals.length === 0 && (
                    <tr>
                      <td colSpan="4" className="committee-empty">
                        Ratings will appear here after students submit them.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* INSIGHTS AND CATEGORY BREAKDOWN */}

          <section className="committee-insights-grid">
            <article className="committee-panel">
              <div className="committee-panel-heading">
                <div>
                  <span className="section-eyebrow">STUDENT VOICE RADAR</span>
                  <h2>Common complaint themes</h2>
                </div>
                <MessageSquare size={21} />
              </div>

              <p className="committee-description">
                Keyword-based classification of feedback comments.
              </p>

              <div className="complaint-list">
                {complaintInsights.map((item) => (
                  <div className="complaint-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>

              <p className="committee-footnote">
                A comment may match more than one theme. These are keyword
                indicators, not AI-generated conclusions.
              </p>
            </article>

            <article className="committee-panel">
              <div className="committee-panel-heading">
                <div>
                  <span className="section-eyebrow">FEEDBACK BREAKDOWN</span>
                  <h2>Feedback categories</h2>
                </div>
                <BarChart3 size={21} />
              </div>

              {Object.keys(categoryCounts).length ? (
                <div className="complaint-list">
                  {Object.entries(categoryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div className="complaint-row" key={category}>
                        <span>{category}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="committee-empty">
                  Feedback category statistics will appear after submissions.
                </p>
              )}
            </article>
          </section>

          {/* DETAILED SUB-OPTION FEEDBACK */}

          <section className="committee-panel">
            <div className="committee-panel-heading">
              <div>
                <span className="section-eyebrow">DETAILED STUDENT OPINIONS</span>
                <h2>Student Feedback Details</h2>
                <p>
                  See exactly what students are saying about each aspect of food.
                </p>
              </div>
              <MessageSquare size={23} />
            </div>

            <div className="committee-feedback-details">
              {feedbackDetails.map((group) => (
                <div
                  className="committee-feedback-category"
                  key={group.category}
                >
                  <h3>{group.category}</h3>

                  <div className="complaint-list">
                    {group.options.map((option) => (
                      <div className="complaint-row" key={option.label}>
                        <span>{option.label}</span>
                        <strong>
                          {option.count}{' '}
                          {option.count === 1 ? 'response' : 'responses'}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="committee-footnote">
              Counts represent the number of saved feedback submissions
              that selected each option. One submission can select multiple
              options.
            </p>
          </section>

          {/* RECENT FEEDBACK */}

          <section className="committee-panel">
            <div className="committee-panel-heading">
              <div>
                <span className="section-eyebrow">LATEST STUDENT RESPONSES</span>
                <h2>Recent feedback</h2>
              </div>
              <MessageSquare size={21} />
            </div>

            <div className="recent-feedback-list">
              {recentFeedback.map((item, index) => (
                <article
                  className="recent-feedback-item"
                  key={item.id || index}
                >
                  <div>
                    <strong>
                      {item.anonymous ? 'Anonymous Student' : item.name}
                    </strong>
                    <span>{item.category} · {item.meal}</span>
                  </div>

                  <div className="recent-feedback-rating">
                    <Star size={14} fill="currentColor" />
                    {item.rating}/5
                  </div>

                  <p>
                    <strong>Dish:</strong> {item.dish || 'Not specified'}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(item.date)}
                  </p>

                  {Array.isArray(item.selectedOptions) &&
                    item.selectedOptions.length > 0 && (
                      <p>
                        <strong>Selected feedback:</strong>{' '}
                        {item.selectedOptions.join(' · ')}
                      </p>
                    )}

                  {item.comment && <p>{item.comment}</p>}
                </article>
              ))}

              {recentFeedback.length === 0 && (
                <p className="committee-empty">
                  <CheckCircle2 size={18} />
                  No feedback submissions yet.
                </p>
              )}
            </div>
          </section>

          {/* DISH-WISE FEEDBACK */}

          <section className="committee-panel">
            <div className="committee-panel-heading">
              <div>
                <span className="section-eyebrow">MEAL-WISE FEEDBACK ANALYSIS</span>
                <h2>Feedback by dish</h2>
                <p>
                  Find out exactly which dishes students are commenting on.
                </p>
              </div>
              <Utensils size={23} />
            </div>

            {dishFeedbackGroups.length > 0 ? (
              <div className="recent-feedback-list">
                {dishFeedbackGroups.map((group) => (
                  <article
                    className="recent-feedback-item"
                    key={group.dish}
                  >
                    <div>
                      <strong>{group.dish}</strong>
                      <span>
                        {group.entries.length} feedback submission(s)
                      </span>
                    </div>

                    {group.entries.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="dish-feedback-entry"
                      >
                        <p>
                          <CalendarDays size={14} />
                          {formatDate(item.date)}
                          {' · '}
                          {item.meal || 'Meal not specified'}
                        </p>

                        <p>
                          <strong>{item.category || 'General feedback'}</strong>
                          {' · '}
                          <span className="recent-feedback-rating">
                            <Star size={13} fill="currentColor" />
                            {item.rating || '—'}/5
                          </span>
                        </p>

                        {Array.isArray(item.selectedOptions) &&
                          item.selectedOptions.length > 0 && (
                            <p>
                              <strong>Selected:</strong>{' '}
                              {item.selectedOptions.join(' · ')}
                            </p>
                          )}

                        {item.comment && <p>{item.comment}</p>}

                        <small>
                          {item.anonymous
                            ? 'Anonymous Student'
                            : item.name || 'Student'}
                        </small>
                      </div>
                    ))}
                  </article>
                ))}
              </div>
            ) : (
              <p className="committee-empty">
                Dish-wise feedback will appear here after students submit
                feedback using the updated form.
              </p>
            )}
          </section>

          {/* DATA TRANSPARENCY */}

          <section className="committee-action-note">
            <AlertCircle size={21} />
            <div>
              <strong>Data transparency</strong>
              <p>
                Total Ratings and Overall Rating are calculated from star
                ratings saved through the Feedback form. Meal leaderboard
                statistics use the separate Weekly Menu rating data.
                This demonstration does not combine data from different devices.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default CommitteeDashboard;
