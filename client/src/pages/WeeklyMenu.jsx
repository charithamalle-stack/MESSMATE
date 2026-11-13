
import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Star,
  CheckCircle2,
  LockKeyhole,
  Utensils
} from 'lucide-react';

import './WeeklyMenu.css';

const MEAL_SLOTS = [
  { id: 'breakfast', name: 'Breakfast', time: '07:00', displayTime: '7:00 AM' },
  { id: 'lunch', name: 'Lunch', time: '12:00', displayTime: '12:00 PM' },
  { id: 'snacks', name: 'Snacks', time: '16:00', displayTime: '4:00 PM' },
  { id: 'dinner', name: 'Dinner', time: '19:00', displayTime: '7:00 PM' }
];

const WEEKLY_DISHES = [
  ['Idli & Sambar', 'Rice & Dal', 'Vegetable Samosa', 'Chapati & Paneer Curry'],
  ['Masala Dosa', 'Veg Fried Rice', 'Bread Pakora', 'Vegetable Pulao'],
  ['Poha & Chutney', 'Sambar Rice', 'Bhel Puri', 'Aloo Paratha'],
  ['Pongal & Chutney', 'Curd Rice', 'Onion Pakoda', 'Dal Tadka & Roti'],
  ['Upma & Chutney', 'Vegetable Biryani', 'Fruit & Sprouts', 'Paneer Fried Rice'],
  ['Poori & Potato Curry', 'Tomato Rice', 'Veg Sandwich', 'Chapati & Mixed Curry'],
  ['Pesarattu', 'Meals Special', 'Sweet Corn Chaat', 'Veg Noodles']
];

const STORAGE_KEY = 'messmate_meal_ratings';

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);

  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      dayName: date.toLocaleDateString('en-IN', { weekday: 'long' }),
      shortDate: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      })
    };
  });
}

const WEEK_DATES = getWeekDates();

function getMealDateTime(dateKey, time) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

function readRatings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}'
    );

    return saved &&
      typeof saved === 'object' &&
      !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function WeeklyMenu() {
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [notice, setNotice] = useState('');

  const [ratings, setRatings] = useState(readRatings);

  useEffect(() => {
    function updateRatings(event) {
      if (event.key === STORAGE_KEY || !event.key) {
        setRatings(readRatings());
      }
    }

    window.addEventListener('storage', updateRatings);
    window.addEventListener('messmate-ratings-updated', updateRatings);

    return () => {
      window.removeEventListener('storage', updateRatings);
      window.removeEventListener('messmate-ratings-updated', updateRatings);
    };
  }, []);

  const meals = WEEK_DATES.flatMap((day, dayIndex) =>
    MEAL_SLOTS.map((slot, slotIndex) => ({
      id: `${day.key}-${slot.id}`,
      dateKey: day.key,
      dayName: day.dayName,
      shortDate: day.shortDate,
      slot: slot.id,
      mealName: WEEKLY_DISHES[dayIndex][slotIndex],
      mealType: slot.name,
      time: slot.time,
      displayTime: slot.displayTime
    }))
  );

  const filteredMeals = meals.filter((meal) => {
    const matchesDay =
      selectedDay === 'all' || meal.dateKey === selectedDay;

    const matchesSlot =
      selectedSlot === 'all' || meal.slot === selectedSlot;

    return matchesDay && matchesSlot;
  });

  function isMealAvailable(meal) {
    const scheduledTime = getMealDateTime(meal.dateKey, meal.time);
    return new Date() >= scheduledTime;
  }

  function getMealStats(mealId) {
    const mealRatings = Array.isArray(ratings[mealId])
      ? ratings[mealId]
      : [];

    if (mealRatings.length === 0) {
      return { average: null, count: 0 };
    }

    const total = mealRatings.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    return {
      average: (total / mealRatings.length).toFixed(1),
      count: mealRatings.length
    };
  }

  function handleRateClick(meal) {
    if (!isMealAvailable(meal)) {
      setSelectedMeal(null);
      setSelectedRating(0);
      setNotice(
        `Rating blocked! ${meal.mealType} (${meal.mealName}) is scheduled for ${meal.shortDate} at ${meal.displayTime}. You cannot rate a future meal.`
      );
      return;
    }

    setNotice('');
    setSelectedMeal(meal);
    setSelectedRating(0);
  }

  function submitRating() {
    if (!selectedMeal || selectedRating < 1 || selectedRating > 5) {
      setNotice('Please select a rating between 1 and 5 stars.');
      return;
    }

    if (!isMealAvailable(selectedMeal)) {
      setSelectedMeal(null);
      setSelectedRating(0);
      setNotice('Rating blocked! This meal has not started yet.');
      return;
    }

    const updatedRatings = {
      ...ratings,
      [selectedMeal.id]: [
        ...(ratings[selectedMeal.id] || []),
        { rating: selectedRating }
      ]
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRatings)
      );

      setRatings(updatedRatings);

      window.dispatchEvent(
        new Event('messmate-ratings-updated')
      );
    } catch {
      setNotice('Unable to save your rating in this browser.');
      return;
    }

    setNotice(
      `Your ${selectedRating}-star rating for ${selectedMeal.mealName} has been saved!`
    );

    setSelectedMeal(null);
    setSelectedRating(0);
  }

  return (
    <main className="weekly-menu-page">
      <div className="weekly-menu-container">

        {/* Page heading */}
        <section className="weekly-menu-heading">
          <div>
            <span className="menu-eyebrow">YOUR FOOD. YOUR CHOICE.</span>
            <h1>Weekly Mess Menu</h1>
            <p>
              Explore every meal, rate dishes and help improve your mess.
            </p>
          </div>

          <div className="menu-week-badge">
            <CalendarDays size={17} />
            <span>Weekly Schedule</span>
          </div>
        </section>

        {/* Rating information */}
        <section className="rating-rule-banner">
          <div className="rule-icon">
            <LockKeyhole size={20} />
          </div>

          <div>
            <strong>Fair Rating System</strong>
            <p>
              Ratings open only when a meal's scheduled start time arrives.
              Every average is displayed with its vote count.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="menu-filters">

          <div className="filter-group">
            <label htmlFor="day-filter">FILTER BY DAY</label>

            <select
              id="day-filter"
              className="menu-filter-select"
              value={selectedDay}
              onChange={(event) => {
                setSelectedDay(event.target.value);
                setSelectedMeal(null);
                setNotice('');
              }}
            >
              <option value="all">All days</option>

              {WEEK_DATES.map((day) => (
                <option key={day.key} value={day.key}>
                  {day.dayName} · {day.shortDate}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="slot-filter">FILTER BY MEAL</label>

            <select
              id="slot-filter"
              className="menu-filter-select"
              value={selectedSlot}
              onChange={(event) => {
                setSelectedSlot(event.target.value);
                setSelectedMeal(null);
                setNotice('');
              }}
            >
              <option value="all">All meal slots</option>

              {MEAL_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setSelectedDay('all');
              setSelectedSlot('all');
              setSelectedMeal(null);
              setNotice('');
            }}
          >
            Clear filters
          </button>
        </section>

        {/* Notifications */}
        {notice && (
          <div
            className={`rating-notice ${
              notice.includes('blocked') ? 'notice-warning' : 'notice-success'
            }`}
            role="status"
          >
            {notice.includes('blocked')
              ? <LockKeyhole size={19} />
              : <CheckCircle2 size={19} />
            }

            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Meal schedule */}
        <section className="meal-schedule-section">
          <div className="schedule-heading">
            <div>
              <span className="menu-eyebrow">THE FOOD LINEUP</span>
              <h2>{filteredMeals.length} meals found</h2>
            </div>

            <span className="schedule-count">
              7 Days · 4 Meal Slots
            </span>
          </div>

          <div className="weekly-meal-grid">
            {filteredMeals.map((meal) => {
              const available = isMealAvailable(meal);
              const stats = getMealStats(meal.id);
              const myRating = ratings[meal.id]?.at(-1)?.rating;

              return (
                <article className="weekly-meal-card" key={meal.id}>

                  <div className="weekly-meal-top">
                    <span className="meal-slot-tag">
                      {meal.mealType}
                    </span>

                    <span
                      className={`meal-status ${
                        available ? 'status-open' : 'status-locked'
                      }`}
                    >
                      {available ? 'Rating open' : 'Future meal'}
                    </span>
                  </div>

                  <div className="weekly-meal-icon">
                    <Utensils size={27} />
                  </div>

                  <div className="weekly-meal-date">
                    {meal.dayName}, {meal.shortDate}
                  </div>

                  <h3>{meal.mealName}</h3>

                  <div className="weekly-meal-time">
                    <Clock size={14} />
                    <span>{meal.displayTime}</span>
                  </div>

                  <div className="meal-rating-summary">
                    {stats.average !== null ? (
                      <>
                        <span className="average-rating">
                          <Star size={16} fill="currentColor" />
                          {stats.average}/5
                        </span>

                        <span className="vote-count">
                          {stats.count} {stats.count === 1 ? 'vote' : 'votes'}
                        </span>
                      </>
                    ) : (
                      <span className="no-ratings">
                        No ratings yet · 0 votes
                      </span>
                    )}
                  </div>

                  {myRating && (
                    <div className="your-rating-label">
                      Last demo rating: {myRating}/5
                    </div>
                  )}

                  <button
                    type="button"
                    className={`rate-meal-button ${
                      !available ? 'rate-locked' : ''
                    }`}
                    onClick={() => handleRateClick(meal)}
                  >
                    {available ? 'Rate this meal' : 'Rating locked'}

                    {!available && <LockKeyhole size={14} />}
                  </button>

                </article>
              );
            })}
          </div>

          {filteredMeals.length === 0 && (
            <div className="empty-menu-state">
              No meals match your selected filters.
            </div>
          )}
        </section>

        {/* Rating modal */}
        {selectedMeal && (
          <div className="rating-modal-backdrop">
            <div
              className="rating-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rating-modal-title"
            >
              <div className="rating-modal-icon">
                <Star size={25} />
              </div>

              <h2 id="rating-modal-title">Rate your meal</h2>

              <p>
                {selectedMeal.mealName} · {selectedMeal.mealType}
              </p>

              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={star <= selectedRating ? 'star-selected' : ''}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      size={34}
                      fill={star <= selectedRating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>

              <div className="selected-rating-text">
                {selectedRating === 0
                  ? 'Select your rating'
                  : `${selectedRating} out of 5 stars`
                }
              </div>

              <div className="rating-modal-actions">
                <button
                  type="button"
                  className="rating-cancel-button"
                  onClick={() => {
                    setSelectedMeal(null);
                    setSelectedRating(0);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="rating-submit-button"
                  onClick={submitRating}
                  disabled={selectedRating === 0}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default WeeklyMenu;



