require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();

// basic config 
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.GAMESPOT_API_KEY;
const UA = process.env.UPSTREAM_USER_AGENT || 'Pou-GamesHub/1.0';
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 300); // 5 minutes

if (!API_KEY) {
  console.error('Missing GAMESPOT_API_KEY in .env');
  process.exit(1);
}

// ---- middleware ----
const cors = require('cors');
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] })); // add your dev port(s)
app.use(express.json());

// basic rate limiting for IpP
app.use('/api/', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 req/min
  standardHeaders: true,
  legacyHeaders: false,
}));

// ---- simple inside memory cache ----
const cache = new Map(); // key -> { data, expiresAt }
const getCache = (key) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) { cache.delete(key); return null; }
  return hit.data;
};
const setCache = (key, data) => {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL * 1000 });
};

// ---- Helpers ----
const API_BASE = 'https://www.gamespot.com/api';

/**
 * build a GameSpot API URL with shared params.
 * @param {string} resource e.g. 'games', 'reviews', 'articles', 'videos', 'platforms'
 * @param {object} params   key/value map (limit, offset, filter, sort, field_list)
 */
function buildUrl(resource, params = {}) {
  const url = new URL(`${API_BASE}/${resource}/`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) {
      url.searchParams.set(k, String(v));
    }
  });

  return url.toString();
}

/**
 * proxy GameSpot API request -> caching & proper user-agent.
 */
async function proxy(resource, params, res) {
  const url = buildUrl(resource, params);
  const cached = getCache(url);
  if (cached) return res.json(cached);

  const upstreamRes = await fetch(url, {
    headers: {
      'User-Agent': UA,           // this api needs a descriptive UA
      'Accept': 'application/json'
    }
  });

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => '');
    return res.status(upstreamRes.status).json({
      error: 'Upstream error',
      status: upstreamRes.status,
      details: text.substring(0, 500)
    });
  }

  const data = await upstreamRes.json();
  setCache(url, data);
  return res.json(data);
}

// ---- Routes ----

// GET /api/games?search=zelda&platforms=18,130&limit=10
// the current params supported by GameSpot: limit, offset, sort, filter, field_list
app.get('/api/games', async (req, res) => {
  const {
    search,
    platforms,       
    sort,             
    limit = '20',
    offset = '0',
    field_list,       
    filter            
  } = req.query;

  let builtFilter = filter ? String(filter) : '';

  // add a name search if nneeded later
  if (search) {
    const nameFilter = `name:${String(search)}`;
    builtFilter = builtFilter ? `${builtFilter},${nameFilter}` : nameFilter;
  }

  // filter by platform IDs if needed later
  if (platforms) {
    const platformFilter = `platforms:${String(platforms)}`;
    builtFilter = builtFilter ? `${builtFilter},${platformFilter}` : platformFilter;
  }

  return proxy('games', {
    limit, offset, sort, field_list,
    ...(builtFilter ? { filter: builtFilter } : {})
  }, res);
});

// GET /api/reviews?limit=10&sort=publish_date:desc
app.get('/api/reviews', async (req, res) => {
  const { limit = '10', offset = '0', sort = 'publish_date:desc', field_list, filter } = req.query;
  return proxy('reviews', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

// GET /api/articles?limit=10&sort=publish_date:desc
app.get('/api/articles', async (req, res) => {
  const { limit = '10', offset = '0', sort = 'publish_date:desc', field_list, filter } = req.query;
  return proxy('articles', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

// GET /api/videos?limit=10
app.get('/api/videos', async (req, res) => {
  const { limit = '10', offset = '0', sort, field_list, filter } = req.query;
  return proxy('videos', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

// GET /api/platforms (to build dropdowns)
app.get('/api/platforms', async (req, res) => {
  const { limit = '100', offset = '0', sort = 'name:asc', field_list = 'id,name,abbreviation' } = req.query;
  return proxy('platforms', { limit, offset, sort, field_list }, res);
});

// simple browser check
app.get('/health', (_, res) => res.json({ ok: true }));

// ---- start for the server ----
app.listen(PORT, () => {
  console.log(`GameSpot proxy running on http://localhost:${PORT}`);
});
