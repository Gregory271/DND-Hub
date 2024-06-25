/*
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const port = 3000;

const secretKey = 'darude271@'; // Change this to an actual secret key

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const users = [];
const notes = {};
let groupNotes = [];

// Function to create a new user
const createUser = (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
};

// Function to find a user by username
const findUser = (username) => users.find(user => user.username === username);

// Middleware for authenticating tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const user = createUser(username, password);
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// User-specific notes routes
app.post('/notes', authenticateToken, (req, res) => {
  const { note } = req.body;
  if (!notes[req.user.username]) {
    notes[req.user.username] = [];
  }
  notes[req.user.username].push(note);
  res.json({ message: 'Note added' });
});

app.get('/notes', authenticateToken, (req, res) => {
  res.json(notes[req.user.username] || []);
});

// Group notes routes
app.post('/group-notes', authenticateToken, (req, res) => {
  const { note } = req.body;
  groupNotes.push(note);
  res.json({ message: 'Group note added' });
});

app.get('/group-notes', (req, res) => {
  res.json(groupNotes);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
*/

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const port = 3000;

const secretKey = 'darude271@'; // Change this to an actual secret key

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const users = [];
const notes = {};
let groupNotes = [];

// Function to create a new user
const createUser = (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
};

// Function to find a user by username
const findUser = (username) => users.find(user => user.username === username);

// Middleware for authenticating tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const user = createUser(username, password);
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// User-specific notes routes
app.post('/notes', authenticateToken, (req, res) => {
  const { note } = req.body;
  if (!notes[req.user.username]) {
    notes[req.user.username] = [];
  }
  notes[req.user.username].push(note);
  res.json({ message: 'Note added' });
});

app.get('/notes', authenticateToken, (req, res) => {
  res.json(notes[req.user.username] || []);
});

// Group notes routes
app.post('/group-notes', authenticateToken, (req, res) => {
  const { note } = req.body;
  groupNotes.push(note);
  res.json({ message: 'Group note added' });
});

app.get('/group-notes', (req, res) => {
  res.json(groupNotes);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

