import { connect } from '@tidbcloud/serverless';
import htmlContent from '../src/frontend.html.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Load environment variables from process.env
  const dbUrl = process.env.DB_URL || 'mysql://2YL56v9y4gRssmf.root:T2K2TPS9zRjTStjw@gateway01.ap-southeast-1.prod.aws.tidbcloud.com/test';
  const bucketId = process.env.BUCKET_ID || 'allnewuser/lyrics';
  const hfToken = process.env.HF_TOKEN;

  const conn = connect({ url: dbUrl });

  try {
    // 1. Frontend Homepage
    if (path === '/' || path === '/index.html' || path === '/api') {
      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders
        }
      });
    }

    // 2. GET /api/stats -> Get stats from database
    if (path === '/api/stats') {
      const totalRows = await conn.execute('SELECT COUNT(*) as count FROM songs');
      const lyricsRows = await conn.execute('SELECT COUNT(*) as count FROM songs WHERE lyrics_sources IS NOT NULL');
      const canvasRows = await conn.execute('SELECT COUNT(*) as count FROM songs WHERE canvas_sources IS NOT NULL');
      const streamRows = await conn.execute("SELECT COUNT(*) as count FROM songs WHERE stream_sources LIKE '3%'");
      
      return new Response(JSON.stringify({
        total: totalRows[0]?.count || 0,
        lyrics: lyricsRows[0]?.count || 0,
        canvas: canvasRows[0]?.count || 0,
        stream: streamRows[0]?.count || 0,
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 3. GET /api/search -> Search database
    if (path === '/api/search') {
      const query = url.searchParams.get('q') || '';
      const limit = parseInt(url.searchParams.get('limit') || '12', 10);
      
      let rows;
      if (query) {
        rows = await conn.execute(
          'SELECT id, name, artists, lyrics_sources, canvas_sources, stream_sources FROM songs WHERE id = ? OR name LIKE ? OR artists LIKE ? LIMIT ?',
          [query, `%${query}%`, `%${query}%`, limit]
        );
      } else {
        // Return default/featured list
        rows = await conn.execute(
          'SELECT id, name, artists, lyrics_sources, canvas_sources, stream_sources FROM songs ORDER BY id DESC LIMIT ?',
          [limit]
        );
      }

      return new Response(JSON.stringify(rows), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 3. GET /api/lyrics/:id
    if (path.startsWith('/api/lyrics/')) {
      const videoId = path.substring('/api/lyrics/'.length);
      if (!videoId) {
        return new Response(JSON.stringify({ error: 'videoId required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Check if song exists in DB and has lyrics sources
      const rows = await conn.execute(
        'SELECT lyrics_sources FROM songs WHERE id = ? LIMIT 1',
        [videoId]
      );

      if (!rows || rows.length === 0 || !rows[0].lyrics_sources) {
        return new Response(JSON.stringify({ error: 'No cached lyrics for this videoId in fallback DB' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Fetch from Hugging Face Bucket
      const hfUrl = `https://huggingface.co/buckets/${bucketId}/resolve/${videoId}.json`;
      
      const hfHeaders = {};
      if (hfToken) {
        hfHeaders['Authorization'] = `Bearer ${hfToken}`;
      }

      const hfResponse = await fetch(hfUrl, { headers: hfHeaders });
      if (!hfResponse.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch lyrics from Hugging Face bucket' }), {
          status: hfResponse.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const lyricsData = await hfResponse.text();
      return new Response(lyricsData, {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 4. GET /api/canvas
    if (path === '/api/canvas') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'id parameter is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Check if song exists in DB and has canvas sources
      const rows = await conn.execute(
        'SELECT name, artists, canvas_sources FROM songs WHERE id = ? LIMIT 1',
        [id]
      );

      if (!rows || rows.length === 0 || !rows[0].canvas_sources) {
        return new Response(JSON.stringify({ error: 'No cached canvas for this id in fallback DB' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const song = rows[0];
      const streamUrl = `https://huggingface.co/buckets/${bucketId}/resolve/canvas/${id}.mp4`;

      return new Response(JSON.stringify({
        id: id,
        name: song.name,
        artist: song.artists,
        url: streamUrl
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 5. GET /api/canvas/stream/:id
    if (path.startsWith('/api/canvas/stream/')) {
      const videoId = path.substring('/api/canvas/stream/'.length);
      if (!videoId) {
        return new Response(JSON.stringify({ error: 'videoId required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const redirectUrl = `https://huggingface.co/buckets/${bucketId}/resolve/canvas/${videoId}.mp4`;
      return Response.redirect(redirectUrl, 307);
    }

    // 6. GET /api/stream
    if (path === '/api/stream') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'id parameter is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const rows = await conn.execute(
        'SELECT name, artists, stream_sources FROM songs WHERE id = ? LIMIT 1',
        [id]
      );

      if (!rows || rows.length === 0 || !rows[0].stream_sources) {
        return new Response(JSON.stringify({ error: 'No cached stream for this id in fallback DB' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const song = rows[0];
      const streamSrc = song.stream_sources || "";
      let ext = "m4a";
      if (streamSrc.includes(":")) {
        ext = streamSrc.split(":")[1];
      }
      const streamUrl = `https://huggingface.co/buckets/shashwatIDR/stream/resolve/${id}.${ext}`;

      return new Response(JSON.stringify({
        id: id,
        name: song.name,
        artist: song.artists,
        url: streamUrl
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 7. GET /api/stream/listen/:id
    if (path.startsWith('/api/stream/listen/')) {
      const videoId = path.substring('/api/stream/listen/'.length);
      if (!videoId) {
        return new Response(JSON.stringify({ error: 'videoId required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const rows = await conn.execute(
        'SELECT stream_sources FROM songs WHERE id = ? LIMIT 1',
        [videoId]
      );

      let ext = "m4a";
      if (rows && rows.length > 0 && rows[0].stream_sources) {
        const streamSrc = rows[0].stream_sources;
        if (streamSrc.includes(":")) {
          ext = streamSrc.split(":")[1];
        }
      }

      const redirectUrl = `https://huggingface.co/buckets/shashwatIDR/stream/resolve/${videoId}.${ext}`;
      return Response.redirect(redirectUrl, 307);
    }

    // Route Not Found
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || err.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
