import { useEffect, useMemo, useState } from 'react';

const initialChecks = [
  { id: 'layout', label: 'Responsive layout', done: true },
  { id: 'forms', label: 'Form controls', done: false },
  { id: 'async', label: 'Async states', done: false },
  { id: 'theme', label: 'Theme switching', done: true },
];

const activitySeeds = [
  'Smoke test initialized',
  'Local state hydrated',
  'Ready for interaction checks',
];

function App() {
  const [mode, setMode] = useState('signal');
  const [count, setCount] = useState(3);
  const [note, setNote] = useState('Run keyboard, resize, and click checks.');
  const [environment, setEnvironment] = useState('staging');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [checks, setChecks] = useState(initialChecks);
  const [requestState, setRequestState] = useState('idle');
  const [latency, setLatency] = useState(null);
  const [activity, setActivity] = useState(activitySeeds);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const completion = useMemo(() => {
    const finished = checks.filter((item) => item.done).length;
    return Math.round((finished / checks.length) * 100);
  }, [checks]);

  const statusTone =
    requestState === 'success'
      ? 'ok'
      : requestState === 'error'
        ? 'warn'
        : requestState === 'loading'
          ? 'live'
          : 'idle';

  function toggleCheck(id) {
    setChecks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function pushActivity(message) {
    setActivity((current) => [message, ...current].slice(0, 5));
  }

  function runSimulation() {
    const wait = 500 + Math.floor(Math.random() * 1600);
    const passed = Math.random() > 0.2;

    setRequestState('loading');
    setLatency(null);
    pushActivity(`Queued ${environment} request`);

    window.setTimeout(() => {
      setRequestState(passed ? 'success' : 'error');
      setLatency(wait);
      pushActivity(
        passed
          ? `Request passed in ${wait}ms`
          : `Request failed in ${wait}ms`,
      );
    }, wait);
  }

  return (
    <main className="app-shell">
      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">Single Page React + Vite Test Bench</p>
          <h1>One screen to exercise layout, input, and async behavior.</h1>
          <p className="lede">
            Use this page to validate interactions quickly without wiring up a
            full product flow.
          </p>
          <div className="pill-row">
            <span className="pill">Mode: {mode}</span>
            <span className="pill">Completion: {completion}%</span>
            <span className={`pill pill-${statusTone}`}>
              Request: {requestState}
            </span>
          </div>
        </div>

        <div className="hero-actions">
          <button className="button button-blue">saba-123</button>
          <button
            className="button button-primary"
            onClick={() =>
              setMode((current) => (current === 'signal' ? 'paper' : 'signal'))
            }
          >
            Toggle Theme
          </button>
          <button className="button" onClick={() => setCount((value) => value + 1)}>
            Raise Counter
          </button>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <div className="section-head">
            <h2>Interaction Controls</h2>
            <span className="badge">{count} taps</span>
          </div>
          <p className="muted">
            Buttons, toggles, and counters for quick click and focus testing.
          </p>
          <div className="button-row">
            <button className="button button-primary" onClick={() => setCount(0)}>
              Reset
            </button>
            <button className="button" onClick={() => setCount((value) => value - 1)}>
              Decrease
            </button>
            <button className="button" onClick={() => setCount((value) => value + 1)}>
              Increase
            </button>
          </div>
          <div className="meter">
            <span
              style={{
                width: `${Math.max(0, Math.min(count * 10, 100))}%`,
              }}
            />
          </div>
        </article>

        <article className="card">
          <div className="section-head">
            <h2>Form Surface</h2>
            <span className="badge">{environment}</span>
          </div>
          <label className="field">
            <span>Testing note</span>
            <textarea
              rows="4"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Environment</span>
            <select
              value={environment}
              onChange={(event) => setEnvironment(event.target.value)}
            >
              <option value="local">Local</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            <span>Auto-refresh preview state</span>
          </label>
        </article>

        <article className="card">
          <div className="section-head">
            <h2>Checklist</h2>
            <span className="badge">{checks.filter((item) => item.done).length}/4</span>
          </div>
          <div className="checklist">
            {checks.map((item) => (
              <label className="check-row" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheck(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="card card-accent">
          <div className="section-head">
            <h2>Async Probe</h2>
            <span className={`badge badge-${statusTone}`}>{requestState}</span>
          </div>
          <p className="muted">
            Simulates a request so you can verify loading, success, and error
            states on demand.
          </p>
          <button className="button button-primary" onClick={runSimulation}>
            Run Simulation
          </button>
          <div className="result-panel">
            <strong>
              {latency ? `${latency}ms` : 'No request completed yet'}
            </strong>
            <span>
              {requestState === 'loading'
                ? 'Processing...'
                : requestState === 'error'
                  ? 'Retry to verify failure recovery.'
                  : 'State updates will appear here.'}
            </span>
          </div>
        </article>
      </section>

      <section className="card log-card">
        <div className="section-head">
          <h2>Recent Activity</h2>
          <span className="badge">{activity.length} events</span>
        </div>
        <div className="log-list">
          {activity.map((item) => (
            <div className="log-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
