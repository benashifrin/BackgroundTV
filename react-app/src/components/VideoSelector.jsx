import React from 'react';
import { VIDEOS } from '../data/videos';

export default function VideoSelector() {
  const open = (url) => {
    if (window?.api?.openExternal) window.api.openExternal(url);
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>{`
        .videos-wrap {
          position: fixed; left: 50%; top: 55%;
          transform: translate(-50%, -50%);
          z-index: 10;
          width: min(1200px, 92vw);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .card {
          padding: 16px 14px;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          color: white;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(5px);
          transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
          user-select: none;
        }
        .card:hover { transform: translateY(-2px); background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.35); }
        .title {
          font-weight: 700; letter-spacing: 0.02em;
        }
        @media (max-width: 980px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <div className="videos-wrap">
        <div className="grid">
          {VIDEOS.map((v) => (
            <div key={v.country} className="card" onClick={() => open(v.url)}>
              <div className="title">{v.country}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
