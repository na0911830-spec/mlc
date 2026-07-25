import { connect } from '@tidbcloud/serverless';
import htmlContent from './frontend.html.js';

export default {
  async fetch(request, env, ctx) {
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

    // Initialize TiDB Serverless connection
    const dbUrl = env.DB_URL || 'mysql://2YL56v9y4gRssmf.root:T2K2TPS9zRjTStjw@gateway01.ap-southeast-1.prod.aws.tidbcloud.com/test';
    const conn = connect({ url: dbUrl });

    try {
      // 1. Frontend Homepage
      if (path === '/' || path === '/index.html') {
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders
          }
        });
      }

      // 2. GET /api/search -> Search database
      if (path === '/api/search') {
        const query = url.searchParams.get('q') || '';
        const limit = parseInt(url.searchParams.get('limit') || '12', 10);
        
        let rows;
        if (query) {
          rows = await conn.execute(
            'SELECT id, name, artists, lyrics_sources, canvas_sources FROM songs WHERE id = ? OR name LIKE ? OR artists LIKE ? LIMIT ?',
            [query, `%${query}%`, `%${query}%`, limit]
          );
        } else {
          // Return default/featured list
          rows = await conn.execute(
            'SELECT id, name, artists, lyrics_sources, canvas_sources FROM songs ORDER BY id DESC LIMIT ?',
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
        const bucketId = env.BUCKET_ID || 'allnewuser/lyrics';
        const hfToken = env.HF_TOKEN;
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
        const bucketId = env.BUCKET_ID || 'allnewuser/lyrics';
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

        const bucketId = env.BUCKET_ID || 'allnewuser/lyrics';
        const redirectUrl = `https://huggingface.co/buckets/${bucketId}/resolve/canvas/${videoId}.mp4`;

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
};
