const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware
server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simple login route
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
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

// Simple register route
server.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user already exists
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

// Use JSON Server router for other routes
server.use('/api', router);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
