
import { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  Utensils
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Feedback.css';

const categories = [
  'Taste',
  'Food Quality',
  'Quantity',
  'Hygiene',
  'Variety'
];

const categoryOptions = {
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

const mealSlots = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const WEEKLY_DISHES = [
  ['Idli & Sambar', 'Rice & Dal', 'Vegetable Samosa', 'Chapati & Paneer Curry'],
  ['Masala Dosa', 'Veg Fried Rice', 'Bread Pakora', 'Vegetable Pulao'],
  ['Poha & Chutney', 'Sambar Rice', 'Bhel Puri', 'Aloo Paratha'],
  ['Pongal & Chutney', 'Curd Rice', 'Onion Pakoda', 'Dal Tadka & Roti'],
  ['Upma & Chutney', 'Vegetable Biryani', 'Fruit & Sprouts', 'Paneer Fried Rice'],
  ['Poori & Potato Curry', 'Tomato Rice', 'Veg Sandwich', 'Chapati & Mixed Curry'],
  ['Pesarattu', 'Meals Special', 'Sweet Corn Chaat', 'Veg Noodles']
];

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDishesForDate(date) {
  if (!date) return [];

  const selectedDate = new Date(`${date}T12:00:00`);
  const mondayFirstDay = (selectedDate.getDay() + 6) % 7;

  return WEEKLY_DISHES[mondayFirstDay] || [];
}

function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState(getToday);
  const [meal, setMeal] = useState('Breakfast');
  const [dish, setDish] = useState('');
  const [category, setCategory] = useState('Taste');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const dishes = getDishesForDate(date);
  const selectedDish = dishes.includes(dish) ? dish : dishes[0] || '';

  function handleDateChange(event) {
    setDate(event.target.value);
    setDish('');
  }

  function handleCategoryChange(item) {
    setCategory(item);
    setSelectedOptions([]);
  }

  function handleOptionToggle(option) {
    setSelectedOptions((previous) =>
      previous.includes(option)
        ? previous.filter((item) => item !== option)
        : [...previous, option]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !date ||
      !selectedDish ||
      !rating ||
      selectedOptions.length === 0
    ) {
      return;
    }

    if (!anonymous && !name.trim()) {
      return;
    }

    const newFeedback = {
      id: Date.now(),
      mealId: `${date}-${meal.toLowerCase()}`,
      date,
      meal,
      dish: selectedDish,
      category,
      selectedOptions,
      rating,
      comment: comment.trim(),
      anonymous,
      name: anonymous ? 'Anonymous Student' : name.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      const existingFeedback = JSON.parse(
        localStorage.getItem('messmate_feedback') || '[]'
      );

      if (!Array.isArray(existingFeedback)) {
        throw new Error('Invalid feedback data');
      }

      const updatedFeedback = [...existingFeedback, newFeedback];

      localStorage.setItem(
        'messmate_feedback',
        JSON.stringify(updatedFeedback)
      );

      window.dispatchEvent(new Event('messmate-feedback-updated'));

      setSuccess(true);
      setRating(0);
      setComment('');
      setName('');
      setCategory('Taste');
      setSelectedOptions([]);
      setMeal('Breakfast');
      setDish('');
      setDate(getToday());
      setAnonymous(true);
    } catch {
      alert('Unable to save feedback. Please try again.');
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        role="student"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <div className="feedback-topbar">
          <button
            className="dashboard-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <span>Student Portal / Feedback</span>
        </div>

        <div className="feedback-page">
          <section className="feedback-heading">
            <span className="section-eyebrow">STUDENT VOICE</span>
            <h1>Your feedback can improve every meal.</h1>
            <p>
              Share your honest experience about a specific meal.
              Your suggestions help the mess committee understand
              what students really need.
            </p>
          </section>

          {success ? (
            <div className="feedback-success">
              <CheckCircle2 size={48} />
              <h2>Feedback submitted!</h2>
              <p>
                Thank you for helping make MESSMATE better.
                Your feedback has been saved with its meal and dish details.
              </p>
              <button
                className="primary-button"
                onClick={() => setSuccess(false)}
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="feedback-form-header">
                <div>
                  <MessageSquare size={22} />
                  <h2>Share your experience</h2>
                </div>
                <span>YOUR VOICE MATTERS</span>
              </div>

              <div className="feedback-field">
                <label htmlFor="feedback-date">
                  <CalendarDays size={17} /> Which date are you reviewing?
                </label>
                <input
                  id="feedback-date"
                  className="feedback-name-input"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="feedback-field">
                <label>Which meal are you reviewing?</label>
                <div className="feedback-choice-grid">
                  {mealSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`feedback-choice ${meal === slot ? 'active' : ''}`}
                      onClick={() => setMeal(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-field">
                <label htmlFor="feedback-dish">
                  <Utensils size={17} /> Which dish are you reviewing?
                </label>
                <select
                  id="feedback-dish"
                  className="feedback-name-input"
                  value={selectedDish}
                  onChange={(event) => setDish(event.target.value)}
                  required
                >
                  {dishes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="feedback-helper">
                  Choose the dish you actually ate.
                </span>
              </div>

              <div className="feedback-field">
                <label>What would you like to comment on?</label>
                <div className="feedback-choice-grid">
                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={`feedback-choice ${category === item ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-field">
                <label>
                  Select your feedback about {category}
                </label>
                <span className="feedback-helper">
                  You can select more than one option.
                </span>

                <div className="feedback-choice-grid">
                  {categoryOptions[category].map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={`feedback-choice ${
                        selectedOptions.includes(option) ? 'active' : ''
                      }`}
                      onClick={() => handleOptionToggle(option)}
                    >
                      {selectedOptions.includes(option) ? '✓ ' : ''}
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-field">
                <label>How would you rate this meal?</label>
                <div className="feedback-stars">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      aria-label={`Rate ${value} out of 5`}
                      className={value <= rating ? 'selected' : ''}
                    >
                      <Star
                        size={30}
                        fill={value <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                  <span>{rating ? `${rating}/5` : 'Select a rating'}</span>
                </div>
              </div>

              <div className="feedback-field">
                <label htmlFor="feedback-comment">
                  Additional comments (Optional)
                </label>
                <textarea
                  id="feedback-comment"
                  rows="5"
                  placeholder="Any other suggestions or details you would like to share?"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
                <span className="feedback-helper">
                  Share any additional suggestions that are not covered above.
                </span>
              </div>

              <div className="feedback-identity">
                <div className="feedback-identity-heading">
                  <ShieldCheck size={22} />
                  <div>
                    <h3>Privacy preference</h3>
                    <p>Choose how your feedback should be displayed.</p>
                  </div>
                </div>

                <label className="anonymous-toggle">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                  />
                  <span>Submit anonymously</span>
                </label>

                {!anonymous && (
                  <input
                    className="feedback-name-input"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                )}

                <p className="feedback-privacy-note">
                  Feedback is stored in this browser for the demonstration.
                  Anonymous mode hides the name in the displayed feedback record.
                </p>
              </div>

              <button
                type="submit"
                className="primary-button feedback-submit"
                disabled={
                  !date ||
                  !selectedDish ||
                  !rating ||
                  selectedOptions.length === 0 ||
                  (!anonymous && !name.trim())
                }
              >
                Submit Feedback <Send size={17} />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Feedback;

