import React, { useEffect, useMemo, useRef, useState } from 'react';
import Background from './components/Background.jsx';
import WelcomeText from './components/WelcomeText.jsx';
import QRDisplay from './components/QRDisplay.jsx';
import VideoStrip from './components/VideoStrip.jsx';

const IDLE_HIDE_MS = 4000;

export default function App() {
  const [visibleUI, setVisibleUI] = useState(true);
  const [name, setName] = useState(() => localStorage.getItem('welcomeName') || '');
  const idleTimer = useRef(null);

  // Idle hide/show controller (note: won’t be interactive when attached behind icons)
  const poke = () => {
    setVisibleUI(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setVisibleUI(false), IDLE_HIDE_MS);
  };

  useEffect(() => {
    const onMove = () => poke();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMove);
    window.addEventListener('touchstart', onMove);
    poke();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMove);
      window.removeEventListener('touchstart', onMove);
      clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    const val = (name || '').slice(0, 64).trim();
    localStorage.setItem('welcomeName', val);
  }, [name]);

  const toolbarStyle = useMemo(() => ({
    position: 'fixed',
    top: 16,
    left: 16,
    padding: '10px 12px',
    borderRadius: 12,
    background: 'rgba(0,0,0,0.45)',
    color: 'white',
    display: visibleUI ? 'flex' : 'none',
    alignItems: 'center',
    gap: 8,
    zIndex: 50,
    backdropFilter: 'blur(6px)'
  }), [visibleUI]);

  return (
    <>
      <Background />

      {/* Toolbar (only useful when NOT attached behind icons) */}
      <div style={toolbarStyle}>
        <input
          aria-label="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            outline: 'none',
            width: 180
          }}
        />
      </div>

      <WelcomeText name={name} />

      {/* Show QR code with videos below */}
      <QRDisplay />
      <VideoStrip />
    </>
  );
}
