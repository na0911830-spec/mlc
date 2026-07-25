export default `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muzo Fallback API Playground</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #06070a;
      --bg-terminal: #0b0c10;
      --bg-card: #12131a;
      --accent-green: #00ff66;
      --accent-green-dim: rgba(0, 255, 102, 0.15);
      --accent-green-glow: rgba(0, 255, 102, 0.05);
      --accent-cyan: #00e5ff;
      --accent-cyan-dim: rgba(0, 229, 255, 0.15);
      --text-primary: #e2e8f0;
      --text-secondary: #94a3b8;
      --text-dim: #475569;
      --border: 1px solid #1e293b;
      --border-glow: 1px solid rgba(0, 255, 102, 0.25);
      --font-mono: 'Fira Code', 'Courier New', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Scanlines and Cyberpunk Grid overlay */
    body::before {
      content: " ";
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 9999;
      background-size: 100% 4px, 6px 100%;
      pointer-events: none;
      opacity: 0.4;
    }

    .neon-grid {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: linear-gradient(rgba(0, 255, 102, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 102, 0.02) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: -2;
    }

    header {
      border-bottom: var(--border);
      background-color: var(--bg-terminal);
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .brand-section h1 {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-green);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .brand-section h1 span {
      animation: blink 1s infinite step-end;
    }

    .brand-section p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-top: 0.2rem;
      font-family: var(--font-mono);
    }

    .base-url-badge {
      font-family: var(--font-mono);
      background: var(--accent-green-dim);
      border: 1px solid var(--accent-green);
      color: var(--accent-green);
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 0 10px var(--accent-green-glow);
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
      .app-layout {
        grid-template-columns: 360px 1fr;
      }
    }

    /* Sidebar - API Documentation */
    .sidebar {
      border-right: var(--border);
      background: var(--bg-terminal);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      overflow-y: auto;
    }

    .sidebar h2 {
      font-family: var(--font-mono);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-cyan);
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--accent-cyan-dim);
      padding-bottom: 0.5rem;
    }

    .api-endpoint-card {
      background: rgba(255,255,255,0.02);
      border: var(--border);
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s;
    }

    .api-endpoint-card:hover {
      border-color: var(--accent-cyan);
    }

    .endpoint-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .badge-get {
      background: rgba(0, 229, 255, 0.1);
      color: var(--accent-cyan);
      border: 1px solid var(--accent-cyan-dim);
    }

    .endpoint-path {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-primary);
      word-break: break-all;
    }

    .endpoint-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      line-height: 1.4;
    }

    .code-snippet {
      background: #040508;
      border: var(--border);
      border-radius: 4px;
      padding: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 0.75rem;
      position: relative;
      overflow-x: auto;
    }

    /* Main Content Area */
    .main-content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      overflow-y: auto;
    }

    /* Search Section */
    .search-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: var(--bg-terminal);
      border: var(--border);
      border-radius: 6px;
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--accent-green);
      box-shadow: 0 0 10px var(--accent-green-dim);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      width: 18px;
      height: 18px;
    }

    /* Song Grid */
    .section-title {
      font-family: var(--font-mono);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-green);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .songs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .song-card {
      background: var(--bg-terminal);
      border: var(--border);
      border-radius: 6px;
      padding: 1.2rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 120px;
    }

    .song-card:hover {
      border-color: var(--accent-green);
      box-shadow: 0 0 10px var(--accent-green-glow);
      transform: translateY(-2px);
    }

    .song-title-text {
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-artist {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-meta-tags {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .meta-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 2px;
      text-transform: uppercase;
    }

    .tag-lyrics {
      background: rgba(0, 255, 102, 0.1);
      color: var(--accent-green);
      border: 1px solid var(--accent-green-dim);
    }

    .tag-canvas {
      background: rgba(0, 229, 255, 0.1);
      color: var(--accent-cyan);
      border: 1px solid var(--accent-cyan-dim);
    }

    /* Explorer Panel Grid */
    .detail-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      background: var(--bg-terminal);
      border: var(--border);
      border-radius: 8px;
      padding: 2rem;
      position: relative;
    }

    @media (min-width: 1200px) {
      .detail-container {
        grid-template-columns: 1fr 300px;
      }
    }

    .lyrics-panel {
      display: flex;
      flex-direction: column;
      min-height: 400px;
    }

    .lyrics-header {
      border-bottom: var(--border);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .lyrics-header h2 {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      color: var(--accent-green);
    }

    .lyrics-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .lyrics-body {
      flex: 1;
      font-family: var(--font-mono);
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-primary);
      overflow-y: auto;
      max-height: 450px;
      white-space: pre-wrap;
    }

    /* Canvas Panel */
    .canvas-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .canvas-wrapper {
      width: 100%;
      aspect-ratio: 9 / 16;
      border-radius: 8px;
      overflow: hidden;
      background: #000;
      border: var(--border);
      position: relative;
      max-width: 250px;
    }

    .canvas-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .canvas-fallback {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--text-dim);
      text-align: center;
      padding: 1.5rem;
      background: #020305;
      font-family: var(--font-mono);
    }

    .canvas-fallback svg {
      width: 32px;
      height: 32px;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    /* Sandbox Console/Log */
    .sandbox-console {
      grid-column: 1 / -1;
      border-top: var(--border);
      padding-top: 1.5rem;
      margin-top: 1rem;
    }

    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .console-title {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .console-output {
      background: #040508;
      border: var(--border);
      border-radius: 4px;
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent-green);
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    .no-selection {
      text-align: center;
      padding: 5rem 2rem;
      color: var(--text-secondary);
      border: 1px dashed var(--text-dim);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.9rem;
    }

    .hidden {
      display: none !important;
    }

    /* Shimmer Loader */
    .shimmer {
      background: linear-gradient(90deg, var(--bg-terminal) 25%, #181922 50%, var(--bg-terminal) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite linear;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    /* Toast system */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--bg-terminal);
      border: 1px solid var(--accent-green);
      color: var(--accent-green);
      padding: 1rem;
      border-radius: 4px;
      box-shadow: 0 0 15px rgba(0,255,102,0.1);
      z-index: 10000;
      transform: translateY(150%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--font-mono);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toast.show {
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="neon-grid"></div>

  <header>
    <div class="brand-section">
      <h1>Muzo Fallback API Playground<span>_</span></h1>
      <p>Local fallback caching layer for synced lyrics and canvas loops.</p>
    </div>
    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
      <div style="display: flex; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.85rem;">
        <div style="border: 1px solid var(--accent-green-dim); padding: 0.4rem 0.8rem; border-radius: 4px; background: rgba(0, 255, 102, 0.02); display: flex; align-items: center; gap: 0.4rem;">
          Lyrics: <span id="stats-lyrics" style="color: var(--accent-green); font-weight: 700;">...</span>
        </div>
        <div style="border: 1px solid var(--accent-cyan-dim); padding: 0.4rem 0.8rem; border-radius: 4px; background: rgba(0, 229, 255, 0.02); display: flex; align-items: center; gap: 0.4rem;">
          Canvas: <span id="stats-canvas" style="color: var(--accent-cyan); font-weight: 700;">...</span>
        </div>
      </div>
      <div class="base-url-badge">BASE: https://mlc.kouzu.in</div>
    </div>
  </header>

  <div class="app-layout">
    <!-- Sidebar / API Docs -->
    <aside class="sidebar">
      <div>
        <h2>API Documentation</h2>

        <!-- Endpoint 1 -->
        <div class="api-endpoint-card">
          <span class="endpoint-badge badge-get">GET</span>
          <div class="endpoint-path">/api/lyrics/:id</div>
          <div class="endpoint-desc">Retrieves synced and plain-text lyrics for a given YouTube video ID. Requires song metadata query parameters to fetch live if not cached.</div>
          <div class="code-snippet">curl https://mlc.kouzu.in/api/lyrics/dQw4w9WgXcQ</div>
        </div>

        <!-- Endpoint 2 -->
        <div class="api-endpoint-card">
          <span class="endpoint-badge badge-get">GET</span>
          <div class="endpoint-path">/api/canvas</div>
          <div class="endpoint-desc">Retrieves loop video configuration and CDN file stream URL for a given YouTube ID.</div>
          <div class="code-snippet">curl "https://mlc.kouzu.in/api/canvas?id=dQw4w9WgXcQ"</div>
        </div>

        <!-- Endpoint 3 -->
        <div class="api-endpoint-card">
          <span class="endpoint-badge badge-get">GET</span>
          <div class="endpoint-path">/api/canvas/stream/:id</div>
          <div class="endpoint-desc">Redirects to the direct Hugging Face hosted CDN video file for low-overhead client streaming.</div>
        </div>

        <!-- Endpoint 4 -->
        <div class="api-endpoint-card">
          <span class="endpoint-badge badge-get">GET</span>
          <div class="endpoint-path">/api/search</div>
          <div class="endpoint-desc">Queries cached database entries by song title, artists, or video ID.</div>
          <div class="code-snippet">curl "https://mlc.kouzu.in/api/search?q=Never+Gonna+Give"</div>
        </div>

        <!-- Endpoint 5 -->
        <div class="api-endpoint-card">
          <span class="endpoint-badge badge-get">GET</span>
          <div class="endpoint-path">/api/stats</div>
          <div class="endpoint-desc">Retrieves total cached counts of lyrics and canvas video loops.</div>
          <div class="code-snippet">curl "https://mlc.kouzu.in/api/stats"</div>
        </div>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <!-- Search -->
      <div class="search-wrapper">
        <input type="text" class="search-input" id="searchBar" placeholder="Search fallback cache by name, artist, or video ID...">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Featured Grid -->
      <div>
        <h3 class="section-title">> CACHED_ENTRIES</h3>
        <div class="songs-grid" id="songsGrid">
          <!-- Rendered song cards -->
        </div>
      </div>

      <!-- Playback Sandbox Details -->
      <div>
        <h3 class="section-title">> SANDBOX_PLAYGROUND</h3>
        <div id="noSelection" class="no-selection">
          SELECT * FROM fallback_db WHERE status = 'cached' LIMIT 1; // Click a song card above to test
        </div>

        <div id="detailContainer" class="detail-container hidden">
          <!-- Lyrics Explorer -->
          <div class="lyrics-panel">
            <div class="lyrics-header">
              <h2 id="detailTitle">Song Title</h2>
              <p id="detailArtist">Artist Name</p>
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
                <p style="font-size: 0.8rem; font-weight: 700;">NO_CANVAS_MP4</p>
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
                API Console Output
              </div>
            </div>
            <div class="console-output" id="consoleOutput">
              $ Ready to run request...
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
      consoleOutput.innerHTML = \`[HTTP] \${method} \${url}\\n[STATUS] \${status}\\n[RESPONSE]\\n\${JSON.stringify(responseData, null, 2)}\`;
      consoleOutput.scrollTop = 0;
    }

    async function loadFeaturedSongs() {
      songsGrid.innerHTML = Array(4).fill(0).map(() => \`
        <div class="song-card shimmer">
          <div style="height: 1rem; width: 60%; background: #222; margin-bottom: 0.5rem; border-radius: 2px;"></div>
          <div style="height: 0.8rem; width: 40%; background: #222; border-radius: 2px;"></div>
        </div>
      \`).join('');

      try {
        const res = await fetch('/api/search?limit=12');
        if (res.ok) {
          allSongs = await res.json();
          renderSongs(allSongs);
        } else {
          songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); font-family: var(--font-mono);">Failed to load cached songs.</p>';
        }
      } catch (err) {
        songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); font-family: var(--font-mono);">Error connecting to fallback worker.</p>';
      }
    }

    function renderSongs(songs) {
      if (songs.length === 0) {
        songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); font-family: var(--font-mono);">No songs found in database.</p>';
        return;
      }

      songsGrid.innerHTML = songs.map(song => {
        const hasLyrics = !!song.lyrics_sources;
        const hasCanvas = !!song.canvas_sources;
        return \`
          <div class="song-card" onclick="selectSong('\${song.id}', '\${encodeURIComponent(song.name)}', '\${encodeURIComponent(song.artists)}')">
            <div>
              <div class="song-title-text" title="\${song.name}">\${song.name}</div>
              <div class="song-artist" title="\${song.artists}">\${song.artists || 'Unknown Artist'}</div>
            </div>
            <div class="song-meta-tags">
              \${hasLyrics ? '<span class="meta-tag tag-lyrics">Lyrics</span>' : ''}
              \${hasCanvas ? '<span class="meta-tag tag-canvas">Canvas</span>' : ''}
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
      lyricsBody.innerHTML = \`<span style="color: var(--text-secondary)">$ cat /api/lyrics/\${id}...</span>\`;
      canvasVideo.classList.add('hidden');
      canvasFallback.classList.remove('hidden');
      consoleOutput.textContent = "$ Initializing request...";

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
          lyricsBody.innerHTML = \`<span style="color: #ef4444">$ cat: failed to read file. Status \${lyricsRes.status}</span>\`;
          const errorData = await lyricsRes.json().catch(() => ({}));
          logConsole(\`https://mlc.kouzu.in\${targetUrl}\`, 'GET', lyricsRes.status, errorData);
        }
      } catch (e) {
        lyricsBody.innerHTML = \`<span style="color: #ef4444">Error loading lyrics.</span>\`;
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
        songsGrid.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); font-family: var(--font-mono);">$ grep "\${query}" fallback_db...</div>\`;
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
