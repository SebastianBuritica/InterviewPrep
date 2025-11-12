import { useState } from 'react';
import './App.css';

// Import challenges
import Challenge1 from './challenges/Challenge1-UserList';
import Challenge2 from './challenges/Challenge2-SearchFilter';
import Challenge3 from './challenges/Challenge3-TodoList';
import Challenge4 from './challenges/Challenge4-FormValidation';
import Challenge5 from './challenges/Challenge5-CustomHook';

const challenges = [
  { id: 1, name: 'User List with Fetch', component: Challenge1, time: '10-15 min' },
  { id: 2, name: 'Search & Filter', component: Challenge2, time: '15-20 min' },
  { id: 3, name: 'Todo List (CRUD)', component: Challenge3, time: '20-25 min' },
  { id: 4, name: 'Form Validation', component: Challenge4, time: '20-25 min' },
  { id: 5, name: 'Custom Hook', component: Challenge5, time: '15-20 min' },
];

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(1);

  const CurrentChallenge = challenges.find(c => c.id === selectedChallenge)?.component;

  return (
    <div className="app">
      <header style={{
        background: '#282c34',
        color: 'white',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1>React Interview Practice</h1>
        <p>Select a challenge and practice for your 30-minute interview!</p>
      </header>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          padding: '20px',
          borderRight: '1px solid #ddd'
        }}>
          <h3>Challenges</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {challenges.map(challenge => (
              <li key={challenge.id} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => setSelectedChallenge(challenge.id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    textAlign: 'left',
                    background: selectedChallenge === challenge.id ? '#007bff' : '#f0f0f0',
                    color: selectedChallenge === challenge.id ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <div><strong>Challenge {challenge.id}</strong></div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    {challenge.name}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
                    ⏱️ {challenge.time}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1 }}>
          {CurrentChallenge && <CurrentChallenge />}
        </main>
      </div>
    </div>
  );
}

export default App;
