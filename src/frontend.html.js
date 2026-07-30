export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MLC Playground</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Space+Mono:wght@400;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      /* ── Jukebox Console Palette ─────────────────── */
      --bg: #14100c;
      --bg-raised: #1c1610;
      --metal: #2b241d;
      --metal-light: #3c3227;
      --glass: #1c1712;
      --glass-deep: #110d0a;

      --cream: #f4e9d2;
      --cream-dim: #c9b78f;
      --ink: #241c14;

      --amber: #ffb733;
      --amber-soft: rgba(255, 183, 51, 0.14);
      --amber-glow: rgba(255, 183, 51, 0.55);

      --cyan: #63e6ea;
      --cyan-soft: rgba(99, 230, 234, 0.14);
      --cyan-glow: rgba(99, 230, 234, 0.55);

      --red: #c1483c;
      --red-soft: rgba(193, 72, 60, 0.16);

      --rule: rgba(244, 233, 210, 0.10);
      --rule-strong: rgba(244, 233, 210, 0.20);

      --font-display: "Bungee", system-ui, sans-serif;
      --font-body: "Manrope", -apple-system, sans-serif;
      --font-mono: "Space Mono", monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scrollbar-color: var(--metal-light) var(--bg-raised); }

    body {
      background-color: var(--bg);
      background-image:
        radial-gradient(ellipse 900px 500px at 15% -10%, rgba(255,183,51,0.06), transparent 60%),
        radial-gradient(ellipse 900px 500px at 90% 0%, rgba(99,230,234,0.05), transparent 60%);
      color: var(--cream);
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    ::selection { background: var(--amber-soft); color: var(--amber); }

    /* Brushed metal texture overlay */
    .metal-bg {
      position: fixed;
      inset: 0;
      z-index: -1;
      opacity: 0.5;
      background-image: repeating-linear-gradient(180deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px);
      pointer-events: none;
    }

    header {
      border-bottom: 2px solid var(--rule-strong);
      background:
        repeating-linear-gradient(100deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 5px),
        var(--metal);
      padding: 1.35rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .marquee {
      background: var(--glass-deep);
      border: 3px solid var(--metal-light);
      border-radius: 10px;
      padding: 0.6rem 1.4rem;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,183,51,0.05);
      animation: flicker-in 1.4s ease-out;
    }

    @keyframes flicker-in {
      0% { opacity: 0; }
      8% { opacity: 1; }
      12% { opacity: 0.2; }
      20% { opacity: 1; }
      26% { opacity: 0.4; }
      34% { opacity: 1; }
      100% { opacity: 1; }
    }

    .marquee h1 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      letter-spacing: 0.02em;
      color: var(--amber);
      text-shadow: 0 0 4px var(--amber-glow), 0 0 16px rgba(255,183,51,0.35);
      display: inline;
    }

    .marquee h1 .sep {
      color: var(--cream-dim);
      font-size: 1rem;
      margin: 0 0.35rem;
      text-shadow: none;
    }

    .marquee h1 em {
      font-style: normal;
      color: var(--cyan);
      text-shadow: 0 0 4px var(--cyan-glow), 0 0 16px rgba(99,230,234,0.35);
    }

    .marquee p {
      color: var(--cream-dim);
      font-family: var(--font-mono);
      font-size: 0.68rem;
      letter-spacing: 0.04em;
      margin-top: 0.3rem;
      text-transform: uppercase;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .vu-pill {
      border: 1px solid var(--rule-strong);
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      background: var(--glass);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--cream-dim);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      box-shadow: inset 0 1px 4px rgba(0,0,0,0.5);
    }

    .vu-pill .led {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--amber);
      box-shadow: 0 0 6px var(--amber-glow), 0 0 2px var(--amber);
      flex-shrink: 0;
    }

    .vu-pill.cyan-led .led {
      background: var(--cyan);
      box-shadow: 0 0 6px var(--cyan-glow), 0 0 2px var(--cyan);
    }

    .vu-pill strong {
      color: var(--cream);
      font-weight: 700;
      font-size: 0.85rem;
    }

    .chrome-badge {
      font-family: var(--font-mono);
      background: linear-gradient(180deg, var(--metal-light), var(--metal));
      border: 1px solid var(--rule-strong);
      color: var(--cream-dim);
      padding: 0.45rem 0.9rem;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 500;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.4);
    }

    .app-layout {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }

    @media (min-width: 1024px) {
      .app-layout { grid-template-columns: 350px 1fr; }
    }

    /* Sidebar — Selector Panel */
    .sidebar {
      border-right: 2px solid var(--rule);
      background: var(--bg-raised);
      padding: 2rem 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow-y: auto;
    }

    .panel-label {
      font-family: var(--font-display);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      color: var(--amber);
      margin-bottom: 1rem;
      padding-bottom: 0.6rem;
      border-bottom: 2px solid var(--red);
      display: inline-block;
    }

    .endpoint-card {
      background: var(--metal);
      border: 1px solid var(--rule);
      border-radius: 8px;
      padding: 0.9rem;
      margin-bottom: 0.9rem;
      display: flex;
      gap: 0.75rem;
      transition: border-color 0.2s ease, transform 0.15s ease;
    }

    .endpoint-card:hover {
      border-color: var(--amber);
      transform: translateX(2px);
    }

    .endpoint-code {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--glass-deep);
      border: 2px solid var(--red);
      color: var(--cream);
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 0.72rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .endpoint-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      text-transform: uppercase;
      background: var(--amber-soft);
      color: var(--amber);
      border: 1px solid rgba(255,183,51,0.3);
      margin-bottom: 0.4rem;
    }

    .endpoint-path {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--cream);
      word-break: break-all;
    }

    .endpoint-desc {
      font-size: 0.73rem;
      color: var(--cream-dim);
      margin-top: 0.4rem;
      line-height: 1.45;
    }

    .code-snippet {
      background: var(--glass-deep);
      border-top: 1px dashed var(--rule-strong);
      border-radius: 0 0 4px 4px;
      padding: 0.5rem 0;
      margin-top: 0.6rem;
      font-family: var(--font-mono);
      font-size: 0.66rem;
      color: var(--cyan);
      overflow-x: auto;
      white-space: pre;
    }

    /* Main workspace */
    .main-content {
      padding: 2.25rem 2.5rem 3rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      overflow-y: auto;
    }

    /* Search — coin slot */
    .search-wrapper { position: relative; width: 100%; }

    .search-input {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.85rem;
      background: var(--glass-deep);
      border: 2px solid var(--metal-light);
      border-radius: 8px;
      color: var(--cream);
      font-family: var(--font-mono);
      font-size: 0.9rem;
      outline: none;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.55);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-input::placeholder { color: var(--cream-dim); opacity: 0.6; }

    .search-input:focus {
      border-color: var(--amber);
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 3px var(--amber-soft);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--cyan);
      width: 16px;
      height: 16px;
    }

    /* Section titles with LED marker */
    .section-title {
      font-family: var(--font-display);
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      color: var(--cream);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .section-title::before {
      content: "";
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 6px var(--cyan-glow);
      animation: pulse-led 2.2s ease-in-out infinite;
    }

    @keyframes pulse-led {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    /* Song grid — title strip cards */
    .songs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.1rem;
    }

    .song-card {
      position: relative;
      background: var(--cream);
      border-bottom: 5px solid var(--red);
      border-radius: 3px;
      padding: 1.1rem 1.2rem;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 108px;
      box-shadow: 0 3px 0 rgba(0,0,0,0.3), 0 6px 14px rgba(0,0,0,0.35);
      overflow: hidden;
    }

    .song-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 48%, transparent 56%);
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    .song-card:hover {
      transform: translateY(-3px) rotate(-0.6deg);
      box-shadow: 0 5px 0 rgba(0,0,0,0.3), 0 12px 22px rgba(0,0,0,0.4);
    }

    .song-card:hover::after { opacity: 1; }

    .song-title-text {
      font-family: var(--font-display);
      font-size: 0.92rem;
      letter-spacing: 0.01em;
      color: var(--ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .song-artist {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--ink);
      opacity: 0.62;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-top: 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-meta-tags { display: flex; gap: 0.4rem; margin-top: 0.85rem; }

    .meta-tag {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      font-weight: 700;
      padding: 0.18rem 0.45rem;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .tag-lyrics { background: var(--ink); color: var(--cream); }
    .tag-canvas { background: var(--red); color: var(--cream); }
    .tag-stream { background: var(--cyan); color: var(--glass-deep); }

    /* Sandbox / service panel */
    .detail-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.75rem;
      background: var(--bg-raised);
      border: 2px solid var(--metal-light);
      border-radius: 14px;
      padding: 1.75rem;
      position: relative;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
    }

    @media (min-width: 1200px) {
      .detail-container { grid-template-columns: 1fr 260px; }
    }

    .lyrics-panel { display: flex; flex-direction: column; min-height: 380px; }

    .lyrics-header {
      border-bottom: 1px solid var(--rule-strong);
      padding-bottom: 0.9rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }

    .lyrics-header .led {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--amber);
      box-shadow: 0 0 6px var(--amber-glow);
      flex-shrink: 0;
    }

    .lyrics-header h2 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--cream);
    }

    .lyrics-header p {
      color: var(--cyan);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      margin-top: 0.15rem;
    }

    .lyrics-body {
      flex: 1;
      background: var(--glass-deep);
      border: 1px solid var(--rule);
      border-radius: 8px;
      padding: 1.1rem 1.2rem;
      font-family: var(--font-mono);
      font-size: 0.88rem;
      line-height: 1.85;
      color: var(--cream);
      overflow-y: auto;
      max-height: 400px;
      white-space: pre-wrap;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }

    /* Canvas viewport bezel */
    .canvas-panel { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }

    .canvas-wrapper {
      width: 100%;
      aspect-ratio: 9 / 16;
      border-radius: 10px;
      overflow: hidden;
      background: #000;
      border: 4px solid var(--metal-light);
      position: relative;
      max-width: 210px;
      box-shadow: inset 0 0 0 2px var(--glass-deep), 0 4px 14px rgba(0,0,0,0.5);
    }

    .canvas-video { width: 100%; height: 100%; object-fit: cover; }

    .canvas-fallback {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--cyan);
      text-align: center;
      padding: 1.5rem;
      background:
        repeating-linear-gradient(180deg, rgba(99,230,234,0.03) 0px, rgba(99,230,234,0.03) 1px, transparent 1px, transparent 3px),
        var(--glass-deep);
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .canvas-fallback svg { width: 22px; height: 22px; margin-bottom: 0.6rem; opacity: 0.6; }

    /* Console / diagnostic CRT */
    .sandbox-console {
      grid-column: 1 / -1;
      border-top: 1px solid var(--rule-strong);
      padding-top: 1.5rem;
      margin-top: 0.25rem;
    }

    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .console-title {
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      color: var(--cream-dim);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .console-output {
      background:
        repeating-linear-gradient(180deg, rgba(255,183,51,0.025) 0px, rgba(255,183,51,0.025) 1px, transparent 1px, transparent 3px),
        var(--glass-deep);
      border: 1px solid var(--rule);
      border-radius: 8px;
      padding: 1rem 1.1rem;
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: var(--amber);
      text-shadow: 0 0 3px rgba(255,183,51,0.25);
      max-height: 180px;
      overflow-y: auto;
      white-space: pre-wrap;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }

    .no-selection {
      text-align: center;
      padding: 4.5rem 2rem;
      color: var(--cream-dim);
      border: 2px dashed var(--metal-light);
      border-radius: 12px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      background: var(--bg-raised);
    }

    .no-selection strong { display: block; font-family: var(--font-display); color: var(--amber); font-size: 1rem; margin-bottom: 0.6rem; letter-spacing: 0.02em; }

    .hidden { display: none !important; }

    /* Shimmer loader */
    .shimmer {
      background: linear-gradient(90deg, var(--cream) 25%, #e8dcc0 50%, var(--cream) 75%);
      background-size: 200% 100%;
      animation: loading 1.4s infinite linear;
    }

    @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* Ticket toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--cream);
      border-left: 4px solid var(--red);
      color: var(--ink);
      padding: 0.85rem 1.25rem;
      border-radius: 4px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      z-index: 10000;
      transform: translateY(150%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toast.show { transform: translateY(0); }

    /* Scrollbars */
    .sidebar::-webkit-scrollbar, .lyrics-body::-webkit-scrollbar, .console-output::-webkit-scrollbar { width: 8px; }
    .sidebar::-webkit-scrollbar-track, .lyrics-body::-webkit-scrollbar-track, .console-output::-webkit-scrollbar-track { background: transparent; }
    .sidebar::-webkit-scrollbar-thumb, .lyrics-body::-webkit-scrollbar-thumb, .console-output::-webkit-scrollbar-thumb { background: var(--metal-light); border-radius: 4px; }
  </style>
</head>
<body>
  <div class="metal-bg"></div>

  <header>
    <div class="marquee">
      <h1>MLC<span class="sep">/</span><em>PLAYGROUND</em></h1>
      <p>Fallback cache · synced lyrics &amp; canvas loops</p>
    </div>
    <div class="header-right">
      <div class="vu-pill">
        <span class="led"></span> Lyrics <strong id="stats-lyrics">···</strong>
      </div>
      <div class="vu-pill cyan-led">
        <span class="led"></span> Canvas <strong id="stats-canvas">···</strong>
      </div>
      <div class="vu-pill" style="border-color: var(--cyan); color: var(--cyan); margin-left: 0.5rem;">
        <span class="led" style="background: var(--cyan); box-shadow: 0 0 6px var(--cyan);"></span> Stream <strong id="stats-stream">···</strong>
      </div>
      <div class="chrome-badge">BASE: https://mlc.kouzu.in</div>
    </div>
  </header>

  <div class="app-layout">
    <!-- Sidebar / API Docs -->
    <aside class="sidebar">
      <div>
        <span class="panel-label">Selector Panel</span>

        <!-- Endpoint A1 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">A1</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge">GET</span>
            <div class="endpoint-path">/api/lyrics/:id</div>
            <div class="endpoint-desc">Retrieves synced and plain-text lyrics for a given YouTube video ID. Requires song metadata query parameters to fetch live if not cached.</div>
            <div class="code-snippet">curl https://mlc.kouzu.in/api/lyrics/dQw4w9WgXcQ</div>
          </div>
        </div>

        <!-- Endpoint A2 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">A2</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge">GET</span>
            <div class="endpoint-path">/api/canvas</div>
            <div class="endpoint-desc">Retrieves loop video configuration and CDN file stream URL for a given YouTube ID.</div>
            <div class="code-snippet">curl "https://mlc.kouzu.in/api/canvas?id=dQw4w9WgXcQ"</div>
          </div>
        </div>

        <!-- Endpoint A3 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">A3</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge">GET</span>
            <div class="endpoint-path">/api/canvas/stream/:id</div>
            <div class="endpoint-desc">Redirects to the direct Hugging Face hosted CDN video file for low-overhead client streaming.</div>
          </div>
        </div>

        <!-- Endpoint A4 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">A4</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge" style="background: var(--cyan); color: var(--glass-deep);">GET</span>
            <div class="endpoint-path">/api/stream</div>
            <div class="endpoint-desc">Retrieves audio stream configuration and CDN stream file URL for a given YouTube ID.</div>
            <div class="code-snippet">curl "https://mlc.kouzu.in/api/stream?id=dQw4w9WgXcQ"</div>
          </div>
        </div>

        <!-- Endpoint A5 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">A5</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge" style="background: var(--cyan); color: var(--glass-deep);">GET</span>
            <div class="endpoint-path">/api/stream/listen/:id</div>
            <div class="endpoint-desc">Redirects to the direct Hugging Face hosted LFS audio file.</div>
          </div>
        </div>

        <!-- Endpoint B1 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">B1</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge">GET</span>
            <div class="endpoint-path">/api/search</div>
            <div class="endpoint-desc">Queries cached database entries by song title, artists, or video ID.</div>
            <div class="code-snippet">curl "https://mlc.kouzu.in/api/search?q=Never+Gonna+Give"</div>
          </div>
        </div>

        <!-- Endpoint B2 -->
        <div class="api-endpoint-card endpoint-card">
          <div class="endpoint-code">B2</div>
          <div style="flex:1; min-width:0;">
            <span class="endpoint-badge">GET</span>
            <div class="endpoint-path">/api/stats</div>
            <div class="endpoint-desc">Retrieves total cached counts of lyrics and canvas video loops.</div>
            <div class="code-snippet">curl "https://mlc.kouzu.in/api/stats"</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <!-- Search -->
      <div class="search-wrapper">
        <input type="text" class="search-input" id="searchBar" placeholder="SEARCH BY NAME, ARTIST, OR VIDEO ID...">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Featured Grid -->
      <div>
        <h3 class="section-title">Now Stocked</h3>
        <div class="songs-grid" id="songsGrid">
          <!-- Rendered song cards -->
        </div>
      </div>

      <!-- Playback Sandbox Details -->
      <div>
        <h3 class="section-title">Test Deck</h3>
        <div id="noSelection" class="no-selection">
          <strong>No title loaded</strong>
          Press a title strip above to run a live cache lookup and view the response payload.
        </div>

        <div id="detailContainer" class="detail-container hidden">
          <!-- Lyrics Explorer -->
          <div class="lyrics-panel">
            <div class="lyrics-header">
              <span class="led"></span>
              <div>
                <h2 id="detailTitle">Song Title</h2>
                <p id="detailArtist">Artist Name</p>
              </div>
            </div>
            <div class="lyrics-body" id="lyricsBody">
              <!-- Synced lyrics content -->
            </div>
          </div>

          <!-- Canvas Player Loop -->
          <div class="canvas-panel">
            <div class="canvas-wrapper">
              <video class="canvas-video hidden" id="canvasVideo" autoplay loop muted playsinline></video>
              <div class="canvas-fallback" id="canvasFallback">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p>No Signal — Canvas Not Cached</p>
              </div>
            </div>
          </div>

          <!-- Stream Player -->
          <div class="stream-panel" style="margin-top: 1rem;">
            <div class="stream-wrapper" style="background: var(--glass); border: 1px solid var(--rule); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <span class="panel-label" style="font-size: 0.7rem; text-transform: uppercase; color: var(--cyan); letter-spacing: 0.05em; font-weight: 600; display: block; margin-bottom: 0.25rem;">Audio Stream</span>
              <audio id="streamAudio" controls style="width: 100%; height: 32px; outline: none; display: none;"></audio>
              <div id="streamFallback" style="text-align: center; color: var(--cream-dim); font-size: 0.75rem; padding: 0.5rem 0;">
                No Audio Cache
              </div>
              <div id="streamLinkContainer" style="display: none; margin-top: 0.25rem;">
                <a id="streamLink" href="#" target="_blank" style="color: var(--cyan); text-decoration: none; font-size: 0.75rem; word-break: break-all; font-family: var(--font-mono);">[HF Resolve Link]</a>
              </div>
            </div>
          </div>

          <!-- API Sandbox Console -->
          <div class="sandbox-console">
            <div class="console-header">
              <div class="console-title">
                <svg style="width:14px; height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Diagnostic Readout
              </div>
            </div>
            <div class="console-output" id="consoleOutput">
              Standing by for request...
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="toast" id="toast">
    <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span id="toastMsg">Success</span>
  </div>

  <script>
    const searchBar = document.getElementById('searchBar');
    const songsGrid = document.getElementById('songsGrid');
    const noSelection = document.getElementById('noSelection');
    const detailContainer = document.getElementById('detailContainer');
    const detailTitle = document.getElementById('detailTitle');
    const detailArtist = document.getElementById('detailArtist');
    const lyricsBody = document.getElementById('lyricsBody');
    const canvasVideo = document.getElementById('canvasVideo');
    const canvasFallback = document.getElementById('canvasFallback');
    const consoleOutput = document.getElementById('consoleOutput');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    let allSongs = [];

    function logConsole(url, method, status, responseData) {
      consoleOutput.innerHTML = \`[HTTP] \\\${method} \\\${url}\\n[STATUS] \\\${status}\\n[RESPONSE]\\n\\\${JSON.stringify(responseData, null, 2)}\`;
      consoleOutput.scrollTop = 0;
    }

    async function loadFeaturedSongs() {
      songsGrid.innerHTML = Array(4).fill(0).map(() => \`
        <div class="song-card shimmer">
          <div style="height: 0.95rem; width: 60%; background: rgba(0,0,0,0.08); margin-bottom: 0.5rem; border-radius: 4px;"></div>
          <div style="height: 0.8rem; width: 40%; background: rgba(0,0,0,0.08); border-radius: 4px;"></div>
        </div>
      \`).join('');

      try {
        const res = await fetch('/api/search?limit=12');
        if (res.ok) {
          allSongs = await res.json();
          renderSongs(allSongs);
        } else {
          songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--cream-dim); font-family: var(--font-mono);">Failed to load cached songs.</p>';
        }
      } catch (err) {
        songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--cream-dim); font-family: var(--font-mono);">Error connecting to fallback worker.</p>';
      }
    }

    function renderSongs(songs) {
      if (songs.length === 0) {
        songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--cream-dim); font-family: var(--font-mono);">No songs found in database.</p>';
        return;
      }

      songsGrid.innerHTML = songs.map(song => {
        const hasLyrics = !!song.lyrics_sources;
        const hasCanvas = !!song.canvas_sources;
        const hasStream = song.stream_sources && song.stream_sources.startsWith('3');
        return \`
          <div class="song-card" onclick="selectSong('\${song.id}', '\${encodeURIComponent(song.name)}', '\${encodeURIComponent(song.artists)}')">
            <div>
              <div class="song-title-text" title="\${song.name}">\${song.name}</div>
              <div class="song-artist" title="\${song.artists}">\${song.artists || 'Unknown Artist'}</div>
            </div>
            <div class="song-meta-tags">
              \${hasLyrics ? '<span class="meta-tag tag-lyrics">Lyrics</span>' : ''}
              \${hasCanvas ? '<span class="meta-tag tag-canvas">Canvas</span>' : ''}
              \${hasStream ? '<span class="meta-tag tag-stream">Stream</span>' : ''}
            </div>
          </div>
        \`;
      }).join('');
    }

    async function selectSong(id, name, artist) {
      name = decodeURIComponent(name);
      artist = decodeURIComponent(artist);

      noSelection.classList.add('hidden');
      detailContainer.classList.remove('hidden');
      detailTitle.textContent = name;
      detailArtist.textContent = artist;
      lyricsBody.innerHTML = \`<span style="color: var(--cream-dim)">Fetching lyrics...</span>\`;
      canvasVideo.classList.add('hidden');
      canvasFallback.classList.remove('hidden');
      consoleOutput.textContent = "Initializing request...";

      // Fetch lyrics
      try {
        const targetUrl = \`/api/lyrics/\${id}?name=\${encodeURIComponent(name)}&artist=\${encodeURIComponent(artist)}\`;
        const lyricsRes = await fetch(targetUrl);
        if (lyricsRes.ok) {
          const data = await lyricsRes.json();
          let text = data.syncedLyrics || data.plainLyrics || "No lyric content available.";
          lyricsBody.innerHTML = text;
          showToast("Lyrics fetched!");
          logConsole(\`https://mlc.kouzu.in\${targetUrl}\`, 'GET', lyricsRes.status, data);
        } else {
          lyricsBody.innerHTML = \`<span style="color: var(--red)">Failed to read file. Status \${lyricsRes.status}</span>\`;
          const errorData = await lyricsRes.json().catch(() => ({}));
          logConsole(\`https://mlc.kouzu.in\${targetUrl}\`, 'GET', lyricsRes.status, errorData);
        }
      } catch (e) {
        lyricsBody.innerHTML = \`<span style="color: var(--red)">Error loading lyrics.</span>\`;
      }

      // Fetch canvas
      try {
        const targetCanvasUrl = \`/api/canvas?id=\${id}&name=\${encodeURIComponent(name)}&artist=\${encodeURIComponent(artist)}\`;
        const canvasRes = await fetch(targetCanvasUrl);
        if (canvasRes.ok) {
          const data = await canvasRes.json();
          if (data.url) {
            canvasVideo.src = data.url;
            canvasVideo.classList.remove('hidden');
            canvasFallback.classList.add('hidden');
          }
        }
      } catch (e) {
        // Fallback remains visible
      }

      // Fetch stream
      try {
        const streamAudio = document.getElementById('streamAudio');
        const streamFallback = document.getElementById('streamFallback');
        const streamLinkContainer = document.getElementById('streamLinkContainer');
        const streamLink = document.getElementById('streamLink');
        
        streamAudio.style.display = 'none';
        streamLinkContainer.style.display = 'none';
        streamFallback.style.display = 'block';
        streamFallback.textContent = "Checking audio cache...";
        
        const targetStreamUrl = \`/api/stream?id=\${id}\`;
        const streamRes = await fetch(targetStreamUrl);
        if (streamRes.ok) {
          const data = await streamRes.json();
          if (data.url) {
            streamAudio.src = data.url;
            streamAudio.style.display = 'block';
            streamFallback.style.display = 'none';
            streamLink.href = data.url;
            streamLink.textContent = data.url;
            streamLinkContainer.style.display = 'block';
          }
        } else {
          streamFallback.textContent = "No Audio Cache";
        }
      } catch (e) {
        document.getElementById('streamFallback').textContent = "Error loading stream";
      }
    }

    // Search bar event listener
    let searchTimeout;
    searchBar.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      searchTimeout = setTimeout(async () => {
        if (!query) {
          renderSongs(allSongs);
          return;
        }
        songsGrid.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; color: var(--cream-dim); font-family: var(--font-mono);">Searching fallback db...</div>\`;
        try {
          const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
          if (res.ok) {
            const results = await res.json();
            renderSongs(results);
          }
        } catch (err) {
          // Ignore
        }
      }, 300);
    });

    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const stats = await res.json();
          document.getElementById('stats-lyrics').textContent = stats.lyrics;
          document.getElementById('stats-canvas').textContent = stats.canvas;
          if (stats.stream !== undefined) {
            document.getElementById('stats-stream').textContent = stats.stream;
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    function showToast(msg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Load initial songs & stats
    loadFeaturedSongs();
    loadStats();
  </script>
</body>
</html>
`;