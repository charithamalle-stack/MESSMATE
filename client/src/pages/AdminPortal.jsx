

import { useEffect, useState } from 'react';
import { Plus, Trash2, Clock, Utensils, CheckCircle2, XCircle } from 'lucide-react';

const KEY = 'messmate_admin_menu';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MEALS = [
  { id: 'breakfast', name: 'Breakfast', start: '07:00', end: '09:00', items: ['Idli & Sambar'] },
  { id: 'lunch', name: 'Lunch', start: '12:00', end: '14:00', items: ['Rice & Dal'] },
  { id: 'snacks', name: 'Snacks', start: '16:00', end: '17:00', items: ['Vegetable Samosa'] },
  { id: 'dinner', name: 'Dinner', start: '19:00', end: '21:00', items: ['Chapati & Curry'] }
];

function createMenu() {
  return DAYS.map(day => ({
    day,
    meals: MEALS.map(meal => ({
      ...meal,
      items: meal.items.map((name, i) => ({
        id: `${day}-${meal.id}-${i}`,
        name,
        available: true
      })),
      closedManually: false
    }))
  }));
}

function loadMenu() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || createMenu();
  } catch {
    return createMenu();
  }
}

function status(meal) {
  if (meal.closedManually) return 'CLOSED';
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = meal.start.split(':').map(Number);
  const [eh, em] = meal.end.split(':').map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (current < start) return 'UPCOMING';
  if (current >= end) return 'CLOSED';
  return 'SERVING NOW';
}

const card = {
  background: 'var(--bg-card, #111a14)',
  border: '1px solid var(--border-color, #26372b)',
  borderRadius: 14,
  padding: 20
};

const field = {
  background: '#0b120e',
  color: 'white',
  border: '1px solid #34483a',
  borderRadius: 8,
  padding: 10,
  width: '100%'
};

const button = {
  border: 0,
  borderRadius: 8,
  padding: '10px 13px',
  cursor: 'pointer',
  fontWeight: 700
};

export default function AdminPortal() {
  const [menu, setMenu] = useState(loadMenu);
  const [dayIndex, setDayIndex] = useState(new Date().getDay());
  const [newNames, setNewNames] = useState({});

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(menu));
    window.dispatchEvent(new Event('messmate-admin-menu-updated'));
  }, [menu]);

  const updateMeal = (mealIndex, changes) => {
    setMenu(old => old.map((day, index) =>
      index === dayIndex
        ? { ...day, meals: day.meals.map((meal, i) =>
            i === mealIndex ? { ...meal, ...changes } : meal
          )}
        : day
    ));
  };

  const addItem = mealIndex => {
    const name = (newNames[mealIndex] || '').trim();
    if (!name) return;
    const items = [
      ...menu[dayIndex].meals[mealIndex].items,
      { id: String(Date.now()), name, available: true }
    ];
    updateMeal(mealIndex, { items });
    setNewNames(old => ({ ...old, [mealIndex]: '' }));
  };

  const today = menu[dayIndex];
  const items = today.meals.flatMap(meal => meal.items);
  const available = items.filter(item => item.available).length;
  const finished = items.length - available;

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #080d0a)',
      color: 'var(--text-primary, #f5f7f5)',
      padding: '35px 20px 60px'
    }}>
      <div style={{ maxWidth: 1100, margin: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#54c878', fontWeight: 800, letterSpacing: 1 }}>
            MESSMATE / ADMIN PORTAL
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', margin: '8px 0' }}>
            Mess Management
          </h1>
          <p style={{ color: '#9aa99e' }}>
            Manage daily menus, meal timings and food availability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 14,
          marginBottom: 24
        }}>
          {[
            ['Total food items', items.length, <Utensils />],
            ['Available', available, <CheckCircle2 color="#54c878" />],
            ['Finished', finished, <XCircle color="#f07878" />]
          ].map(([label, value, icon]) => (
            <section key={label} style={card}>
              <div style={{ color: '#54c878' }}>{icon}</div>
              <h2 style={{ fontSize: 29, margin: '10px 0 3px' }}>{value}</h2>
              <span style={{ color: '#9aa99e', fontSize: 13 }}>{label}</span>
            </section>
          ))}
        </div>

        <section style={{ ...card, marginBottom: 22 }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 10 }}>
            Select day
          </label>
          <select
            value={dayIndex}
            onChange={e => setDayIndex(Number(e.target.value))}
            style={{ ...field, maxWidth: 300 }}
          >
            {DAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}
          </select>
        </section>

        <div style={{ display: 'grid', gap: 18 }}>
          {today.meals.map((meal, mealIndex) => {
            const mealStatus = status(meal);
            return (
              <section key={meal.id} style={card}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: 12
                }}>
                  <h2 style={{ margin: 0 }}>{meal.name}</h2>
                  <strong style={{
                    color: mealStatus === 'SERVING NOW' ? '#54c878' :
                      mealStatus === 'UPCOMING' ? '#e5b65b' : '#f07878',
                    fontSize: 12
                  }}>
                    {mealStatus}
                  </strong>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                  margin: '18px 0'
                }}>
                  <label style={{ color: '#9aa99e', fontSize: 13 }}>
                    <Clock size={14} /> Start time
                    <input
                      type="time"
                      value={meal.start}
                      onChange={e => updateMeal(mealIndex, { start: e.target.value })}
                      style={{ ...field, marginTop: 6 }}
                    />
                  </label>
                  <label style={{ color: '#9aa99e', fontSize: 13 }}>
                    <Clock size={14} /> End time
                    <input
                      type="time"
                      value={meal.end}
                      onChange={e => updateMeal(mealIndex, { end: e.target.value })}
                      style={{ ...field, marginTop: 6 }}
                    />
                  </label>
                </div>

                <button
                  onClick={() => updateMeal(mealIndex, {
                    closedManually: !meal.closedManually
                  })}
                  style={{
                    ...button,
                    background: meal.closedManually ? '#1d6339' : '#542c2c',
                    color: 'white',
                    marginBottom: 18
                  }}
                >
                  {meal.closedManually ? 'Reopen meal' : 'Close meal service'}
                </button>

                <h3 style={{ fontSize: 15 }}>Individual food items</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {meal.items.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', gap: 12, flexWrap: 'wrap',
                      background: '#0b120e', border: '1px solid #26372b',
                      borderRadius: 9, padding: 12
                    }}>
                      <div>
                        <strong>{item.name}</strong>
                        <div style={{
                          color: item.available ? '#54c878' : '#f07878',
                          fontSize: 11, fontWeight: 800, marginTop: 4
                        }}>
                          {item.available ? 'AVAILABLE' : 'FINISHED'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => updateMeal(mealIndex, {
                            items: meal.items.map(x =>
                              x.id === item.id ? { ...x, available: !x.available } : x
                            )
                          })}
                          style={{
                            ...button,
                            background: item.available ? '#542c2c' : '#1d6339',
                            color: 'white'
                          }}
                        >
                          Mark {item.available ? 'finished' : 'available'}
                        </button>
                        <button
                          onClick={() => updateMeal(mealIndex, {
                            items: meal.items.filter(x => x.id !== item.id)
                          })}
                          aria-label={`Remove ${item.name}`}
                          style={{ ...button, background: '#26372b', color: '#ff8585' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap'
                }}>
                  <input
                    placeholder="Enter new food item"
                    value={newNames[mealIndex] || ''}
                    onChange={e => setNewNames(old => ({
                      ...old, [mealIndex]: e.target.value
                    }))}
                    style={{ ...field, flex: '1 1 200px' }}
                  />
                  <button
                    onClick={() => addItem(mealIndex)}
                    style={{
                      ...button, background: '#238a4b', color: 'white',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <Plus size={16} /> Add food
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

