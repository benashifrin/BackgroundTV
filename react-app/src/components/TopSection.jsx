// src/components/TopSection.jsx
import React from 'react';
import QRCode from 'react-qr-code';

export default function TopSection({
  practiceName = 'Welcome to Duluth Dental Center',
  referText = 'Refer a Friend. Get a $50 Gift Card!',
  referUrl = 'https://www.bestdentistduluth.com/login?utm_source=TVS&utm_medium=tv&utm_campaign=referral&utm_id=4',
}) {
  return (
    <>
      <style>{`
        .top-section {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: clamp(16px, 2.8vh, 28px);
          padding: clamp(12px, 4vh, 48px) 16px 0;
          z-index: 10;
        }

        .practice-title {
          margin: 0;
          text-align: center;
          color: #ffffff;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          font-weight: 900;
          letter-spacing: 0.02em;
          text-shadow: 0 3px 10px rgba(0,0,0,0.45);
          font-size: clamp(24px, 4.6vw, 56px);
          line-height: 1.15;
        }

        .qr-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(12px, 2.2vh, 22px);
          width: min(92vw, 760px);
        }

        .qr-card {
          display: grid;
          place-items: center;
          width: clamp(180px, 22vw, 320px);
          aspect-ratio: 1 / 1;
          padding: clamp(14px, 1.8vw, 24px);
          border-radius: 20px;
          background: rgba(0,0,0,0.38);
          backdrop-filter: blur(6px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.35);
        }

        .qr-stack .ref-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(10px, 1.2vw, 16px) clamp(14px, 2vw, 24px);
          border-radius: 9999px;
          background: #ffffff;
          color: #0b1324;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          font-weight: 900;
          letter-spacing: 0.02em;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08);
          font-size: clamp(14px, 2.6vw, 28px);
          line-height: 1.15;
          max-width: 90vw;
        }
      `}</style>

      <section className="top-section" aria-label="Practice & Referral">
        <h1 className="practice-title">{practiceName}</h1>
        <div className="qr-stack">
          <div className="qr-card" role="img" aria-label="Referral QR">
            <QRCode value={referUrl} style={{ width: '100%', height: 'auto' }} fgColor="#ffffff" bgColor="transparent" />
          </div>
          <div className="ref-label">{referText}</div>
        </div>
      </section>
    </>
  );
}

