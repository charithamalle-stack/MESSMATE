
import { NavLink, Link } from 'react-router-dom';
import { Utensils, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Student Portal', path: '/student' },
    { name: 'Weekly Menu', path: '/menu' },
    { name: 'Feedback', path: '/feedback' },
    { name: 'Committee', path: '/committee' }
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <Utensils size={21} />
          </span>
          <span>
            <strong>MESSMATE</strong>
            <small>SMARTER MESS. BETTER MEALS.</small>
          </span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
