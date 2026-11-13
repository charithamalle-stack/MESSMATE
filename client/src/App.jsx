
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import WeeklyMenu from './pages/WeeklyMenu';
import Feedback from './pages/Feedback';
import CommitteeDashboard from './pages/CommitteeDashboard';

function Home() {
  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '680px' }}>
        <div style={{
          display: 'inline-flex',
          padding: '8px 14px',
          background: 'var(--green-100)',
          color: 'var(--green-900)',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          marginBottom: '24px'
        }}>
          SMARTER MESS. BETTER MEALS.
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 68px)',
          lineHeight: 1.08,
          letterSpacing: '-3px',
          marginBottom: '20px'
        }}>
          Your mess.<br />
          Your voice.<br />
          <span style={{ color: 'var(--green-700)' }}>Better food.</span>
        </h1>

        <p style={{
          maxWidth: '520px',
          color: 'var(--text-secondary)',
          fontSize: '17px',
          lineHeight: 1.8,
          marginBottom: '32px'
        }}>
          A smarter way to rate meals, share honest feedback, and help
          your hostel mess serve food students actually love.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/student" className="primary-button">
            Explore MESSMATE →
          </a>
          <a href="/menu" className="secondary-button">
            View Weekly Menu
          </a>
        </div>
      </div>

      <div style={{
        marginTop: '70px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {[
          ['01', 'Rate your meals', 'Give every dish an honest rating.'],
          ['02', 'Share your voice', 'Submit feedback, even anonymously.'],
          ['03', 'See real change', 'Help the mess committee improve.']
        ].map(([number, title, description]) => (
          <div className="card" key={number} style={{ padding: '24px' }}>
            <div style={{
              color: 'var(--green-700)',
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              {number}
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>
              {title}
            </h3>
            <p className="muted-text" style={{
              fontSize: '13px',
              lineHeight: 1.6,
              marginBottom: 0
            }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/menu" element={<WeeklyMenu />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/committee" element={<CommitteeDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;



