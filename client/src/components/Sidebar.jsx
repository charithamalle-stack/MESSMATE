import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Utensils,
  X
} from 'lucide-react';

function Sidebar({ role = 'student', isOpen = false, onClose }) {
  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Weekly Menu', path: '/menu', icon: CalendarDays },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare }
  ];

  const committeeLinks = [
    { name: 'Overview', path: '/committee', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Intelligence', path: '/intelligence', icon: Lightbulb },
    { name: 'Weekly Menu', path: '/menu', icon: CalendarDays },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare }
  ];

  const links = role === 'committee' ? committeeLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-heading">
          <div>
            <span className="sidebar-label">WORKSPACE</span>
            <h3>{role === 'committee' ? 'Committee' : 'Student'} Portal</h3>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-section-label">MENU</div>

        <nav className="sidebar-navigation">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/student' || path === '/committee'}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="sidebar-tip-icon">
              <Utensils size={18} />
            </div>
            <strong>Better meals start here.</strong>
            <p>Your feedback can make a difference.</p>
          </div>

          <span className="sidebar-version">MESSMATE · 1.0</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
