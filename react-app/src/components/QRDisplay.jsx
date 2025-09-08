import React from 'react';
import QRCode from 'react-qr-code';

export default function QRDisplay() {
  // Single, non-rotating QR code. Update the URL to your real referral link.
  const current = {
    label: 'Refer a Friend. Get a $50 Gift Card!',
    url: 'https://www.bestdentistduluth.com/login'
  };

  return (
    <>
      <style>{`
        .qr-wrap {
          position: fixed; bottom: 28vh; left: 50%;
          transform: translateX(-50%);
          z-index: 13;
          display: flex; flex-direction: column; align-items: center;
          gap: 16px;
        }
        @media (max-height: 900px) { .qr-wrap { bottom: 30vh; } }
        @media (max-height: 800px) { .qr-wrap { bottom: 32vh; } }
        @media (max-height: 700px) { .qr-wrap { bottom: 36vh; } }
        .qr-card {
          padding: 24px;
          border-radius: 24px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 70px rgba(59,130,246,0.45) inset;
          transition: opacity 350ms ease;
        }
        .qr-label {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 14px 22px;
          border-radius: 9999px; /* pill */
          background: #ffffff;
          color: #0b1324;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          font-weight: 900;
          letter-spacing: 0.02em;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 10px 28px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.08);
          font-size: clamp(18px, 3.2vw, 32px);
          line-height: 1.15;
          text-align: center;
          max-width: 90vw;
        }
      `}</style>
      <div className="qr-wrap">
        <div className="qr-card">
          <QRCode value={current.url} size={220} fgColor="#ffffff" bgColor="transparent" />
        </div>
        <div className="qr-label">{current.label}</div>
      </div>
    </>
  );
}
