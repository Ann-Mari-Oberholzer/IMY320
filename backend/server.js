require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jsonServer = require('json-server');

const app = express();

// Basic config 
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.GAMESPOT_API_KEY;
const UA = process.env.UPSTREAM_USER_AGENT || 'Pou-GamesHub/1.0';
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 300); // 5 minutes

if (!API_KEY) {
  console.warn('Missing GAMESPOT_API_KEY in .env - GameSpot API features will be disabled');
  // Don't exit, just disable GameSpot API features
}

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

// Basic rate limiting for IP
app.use('/api/', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 req/min
  standardHeaders: true,
  legacyHeaders: false,
}));

// Simple in-memory cache
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

// Helpers
const API_BASE = 'https://www.gamespot.com/api';

/**
 * Build a GameSpot API URL with shared params.
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
 * Proxy GameSpot API request -> caching & proper user-agent.
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

// Authentication routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email (using json-server db)
  const router = jsonServer.router('db.json');
  const users = router.db.get('users').filter({ email }).value();
  
  if (users.length === 0) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }
  
  const user = users[0];
  
  // Check password (simple comparison for now)
  if (user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

app.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user already exists
  const router = jsonServer.router('db.json');
  const existingUsers = router.db.get('users').filter({ email }).value();
  
  if (existingUsers.length > 0) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    email,
    password,
    name,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  const createdUser = router.db.get('users').push(newUser).write();
  const user = createdUser[createdUser.length - 1];
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(201).json({
    success: true,
    user: userWithoutPassword
  });
});

// GameSpot API routes
app.get('/api/games', async (req, res) => {
  if (!API_KEY) {
    return res.json({
      results: [],
      total_count: 0,
      error: 'GameSpot API key not configured'
    });
  }

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

  // Add a name search if needed
  if (search) {
    const nameFilter = `name:${String(search)}`;
    builtFilter = builtFilter ? `${builtFilter},${nameFilter}` : nameFilter;
  }

  // Filter by platform IDs if needed
  if (platforms) {
    const platformFilter = `platforms:${String(platforms)}`;
    builtFilter = builtFilter ? `${builtFilter},${platformFilter}` : platformFilter;
  }

  return proxy('games', {
    limit, offset, sort, field_list,
    ...(builtFilter ? { filter: builtFilter } : {})
  }, res);
});

// Get individual game by ID
app.get('/api/games/:id', async (req, res) => {
  if (!API_KEY) {
    return res.status(404).json({
      error: 'GameSpot API key not configured'
    });
  }

  const { id } = req.params;
  const { field_list = 'id,name,deck,image,site_detail_url,original_release_date,platforms,genres' } = req.query;

  try {
    const url = buildUrl('games', {
      filter: `id:${id}`,
      field_list
    });
    
    const cached = getCache(url);
    if (cached) {
      // If cached data has results array, return first item
      if (cached.results && Array.isArray(cached.results) && cached.results.length > 0) {
        return res.json(cached.results[0]);
      }
      return res.json(cached);
    }

    const upstreamRes = await fetch(url, {
      headers: {
        'User-Agent': UA,
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
    
    // If data has results array, return first item
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      return res.json(data.results[0]);
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Error fetching individual game:', error);
    return res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.get('/api/reviews', async (req, res) => {
  const { limit = '10', offset = '0', sort = 'publish_date:desc', field_list, filter } = req.query;
  return proxy('reviews', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

app.get('/api/articles', async (req, res) => {
  const { limit = '10', offset = '0', sort = 'publish_date:desc', field_list, filter } = req.query;
  return proxy('articles', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

app.get('/api/videos', async (req, res) => {
  const { limit = '10', offset = '0', sort, field_list, filter } = req.query;
  return proxy('videos', { limit, offset, sort, field_list, ...(filter ? { filter } : {}) }, res);
});

app.get('/api/platforms', async (req, res) => {
  const { limit = '100', offset = '0', sort = 'name:asc', field_list = 'id,name,abbreviation' } = req.query;
  return proxy('platforms', { limit, offset, sort, field_list }, res);
});

// Cart routes
app.get('/api/cart', (req, res) => {
  const { userId } = req.query;
  const router = jsonServer.router('db.json');
  const carts = router.db.get('cart').filter({ userId: parseInt(userId) }).value();
  res.json(carts);
});

app.post('/api/cart', (req, res) => {
  const router = jsonServer.router('db.json');
  const newCart = {
    id: Date.now(),
    userId: req.body.userId,
    products: req.body.products || []
  };
  const createdCart = router.db.get('cart').push(newCart).write();
  res.json(createdCart[createdCart.length - 1]);
});

app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const router = jsonServer.router('db.json');
  const cart = router.db.get('cart').find({ id: parseInt(id) }).assign(req.body).write();
  res.json(cart);
});

// Product routes
app.get('/api/products', (req, res) => {
  const router = jsonServer.router('db.json');
  const products = router.db.get('products').value();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const router = jsonServer.router('db.json');
  const product = router.db.get('products').find({ id: parseInt(id) }).value();
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', (req, res) => {
  const router = jsonServer.router('db.json');
  const newProduct = {
    id: Date.now(),
    ...req.body
  };
  const createdProduct = router.db.get('products').push(newProduct).write();
  res.json(createdProduct[createdProduct.length - 1]);
});

// Order routes
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  const router = jsonServer.router('db.json');

  if (userId) {
    const orders = router.db.get('orders').filter({ userId: parseInt(userId) }).value();
    res.json(orders);
  } else {
    const orders = router.db.get('orders').value();
    res.json(orders);
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const router = jsonServer.router('db.json');
    const newOrder = {
      id: Date.now(),
      userId: req.body.userId,
      products: req.body.products || [],
      total: req.body.total,
      status: req.body.status || 'processing',
      orderDate: req.body.orderDate || new Date().toISOString()
    };

    const createdOrder = router.db.get('orders').push(newOrder).write();
    const order = createdOrder[createdOrder.length - 1];

    console.log('Order created:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const router = jsonServer.router('db.json');
  const order = router.db.get('orders').find({ id: parseInt(id) }).value();

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Favorites routes
app.get('/api/favorites', (req, res) => {
  const { userId } = req.query;
  const router = jsonServer.router('db.json');

  if (userId) {
    const favorites = router.db.get('favorites').filter({ userId: parseInt(userId) }).value();
    res.json(favorites);
  } else {
    const favorites = router.db.get('favorites').value();
    res.json(favorites);
  }
});

app.post('/api/favorites', (req, res) => {
  try {
    const router = jsonServer.router('db.json');
    const { userId, productId } = req.body;

    // Check if already exists
    const existing = router.db.get('favorites')
      .find({ userId: parseInt(userId), productId: parseInt(productId) })
      .value();

    if (existing) {
      return res.json(existing);
    }

    const newFavorite = {
      id: Date.now(),
      userId: parseInt(userId),
      productId: parseInt(productId)
    };

    const createdFavorite = router.db.get('favorites').push(newFavorite).write();
    res.status(201).json(createdFavorite[createdFavorite.length - 1]);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

app.delete('/api/favorites/:userId/:productId', (req, res) => {
  try {
    const { userId, productId } = req.params;
    const router = jsonServer.router('db.json');

    router.db.get('favorites')
      .remove({ userId: parseInt(userId), productId: parseInt(productId) })
      .write();

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
