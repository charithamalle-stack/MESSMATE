
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Utensils,
  TrendingUp,
  Menu,
  Bell,
  CalendarDays
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import MealCard from '../components/MealCard';
import './StudentDashboard.css';

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meals = [
    {
      dish: 'Masala Dosa',
      mealType: 'Breakfast',
      time: '8:00 AM',
      rating: '4.6',
      category: 'Vegetarian',
      description: 'Crispy dosa served with chutney and sambar.'
    },
    {
      dish: 'Veg Fried Rice',
      mealType: 'Lunch',
      time: '1:00 PM',
      rating: '4.2',
      category: 'Vegetarian',
      description: 'Freshly prepared rice with seasonal vegetables.'
    },
    {
      dish: 'Paneer Butter Masala',
      mealType: 'Dinner',
      time: '8:00 PM',
      rating: '4.8',
      category: 'Vegetarian',
      description: 'Creamy paneer curry served with soft chapati.'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        role="student"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <button
            className="dashboard-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={21} />
          </button>

          <div className="dashboard-breadcrumb">
            Student Portal <span>/</span> Dashboard
          </div>

          <button className="notification-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
        </div>

        <div className="dashboard-content">
          <section className="student-welcome">
            <div>
              <span className="welcome-eyebrow">YOUR MESSMATE SPACE</span>
              <h1>Good afternoon, Student! 👋</h1>
              <p>
                Your opinion matters. Let's make every meal better.
              </p>
            </div>

            <div className="welcome-date">
              <CalendarDays size={17} />
              This week's meals
            </div>
          </section>

          <section className="student-stats">
            <StatCard
              title="Your Ratings"
              value="12"
              description="Meals rated so far"
              icon={Star}
            />

            <StatCard
              title="Feedback Shared"
              value="05"
              description="Your voice matters"
              icon={MessageSquare}
            />

            <StatCard
              title="Average Food Rating"
              value="4.2/5"
              description="Your overall experience"
              icon={TrendingUp}
            />

            <StatCard
              title="Meals This Week"
              value="28"
              description="4 meal slots × 7 days"
              icon={Utensils}
            />
          </section>

          <section className="student-meals-section">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">TODAY'S MENU</span>
                <h2>What's cooking today?</h2>
                <p>Explore the dishes and see how students rated them.</p>
              </div>

              <Link to="/menu" className="section-link">
                View full menu →
              </Link>
            </div>

            <div className="student-meal-grid">
              {meals.map((meal) => (
                <MealCard key={meal.dish} {...meal} />
              ))}
            </div>
          </section>

          <section className="student-feedback-banner">
            <div>
              <span>YOUR VOICE MAKES A DIFFERENCE</span>
              <h2>Have something to say about today's food?</h2>
              <p>
                Share honest feedback. You can even submit it anonymously.
              </p>
            </div>

            <Link to="/feedback" className="primary-button">
              Share Feedback →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;

