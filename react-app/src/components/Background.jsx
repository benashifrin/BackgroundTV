// src/components/Background.jsx
import React from 'react';

export const THEMES = [
  {
    name: 'mint-teal',
    baseFrom: '#a8edea',
    baseTo:   '#14b8a6',
    stops: ['#006d77', '#14b8a6', '#83eaf1', '#d1f9f4', '#a8edea', '#14b8a6'],
  },
  {
    name: 'deep-teal-lav',
    baseFrom: '#b5c7f2',
    baseTo:   '#14b8a6',
    stops: ['#0e7490', '#06b6d4', '#99f6e4', '#a7f3d0', '#b5c7f2', '#14b8a6'],
  },
];

const FADE_MS = 400;

/**
 * Animated flowing conic-gradient background (matches DemoPage look).
 * Props:
 * - theme: { baseFrom, baseTo, stops[6] }  // same shape as used in DemoPage
 * - fade: boolean                           // when true, fades layers to 0 (sync with QR transition)
 * - zIndex: number                          // optional, defaults to 0
 */
export default function Background({ theme = THEMES[0], fade = false, zIndex = 0 }) {
  const staticCSS = `
    .flowing-background {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: ${zIndex};
      overflow: hidden;
      pointer-events: none;
      background: linear-gradient(135deg, var(--base-from) 0%, var(--base-to) 100%);
      transition: background 500ms ease;
      backface-visibility: hidden;
      perspective: 1000px;
      will-change: transform;
    }

    .gradient-layer {
      position: absolute;
      top: 0; left: 0;
      width: 200%; height: 200%;
      opacity: 0.8;
      mix-blend-mode: screen;
      filter: blur(40px);
      transition: background 500ms ease, opacity ${FADE_MS}ms ease;
      backface-visibility: hidden;
      perspective: 1000px;
      will-change: transform, filter;
    }

    .gradient-layer-1 {
      background: conic-gradient(
        from 0deg at 50% 50%,
        var(--c1), var(--c2), var(--c3), var(--c4), var(--c5), var(--c1)
      );
      /* static: no animation */
      transform-origin: center center;
    }

    .gradient-layer-2 {
      background: conic-gradient(
        from 180deg at 30% 70%,
        var(--c2), var(--c4), var(--c3), var(--c5), var(--c1), var(--c2)
      );
      /* static: no animation */
      transform-origin: 30% 70%;
      opacity: 0.6;
    }

    .gradient-layer-3 {
      background: conic-gradient(
        from 90deg at 70% 30%,
        var(--c3), var(--c5), var(--c2), var(--c4), var(--c1), var(--c3)
      );
      /* static: no animation */
      transform-origin: 70% 30%;
      opacity: 0.4;
    }

    /* animations removed for static background */
  `;

  const vars = `
    :root {
      --base-from: ${theme.baseFrom};
      --base-to:   ${theme.baseTo};
      --c1: ${theme.stops[0]};
      --c2: ${theme.stops[1]};
      --c3: ${theme.stops[2]};
      --c4: ${theme.stops[3]};
      --c5: ${theme.stops[4]};
      --c6: ${theme.stops[5]};
    }
  `;

  const fadeStyle = { opacity: fade ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: staticCSS }} />
      <style dangerouslySetInnerHTML={{ __html: vars }} />
      <div className="flowing-background">
        <div className="gradient-layer gradient-layer-1" style={fadeStyle} />
        <div className="gradient-layer gradient-layer-2" style={fadeStyle} />
        <div className="gradient-layer gradient-layer-3" style={fadeStyle} />
      </div>
    </>
  );
}
