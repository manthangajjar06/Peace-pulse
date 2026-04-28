require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import models
const Image = require('./models/Image');

// Define the User model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication middleware for checking user status (for pages)
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      req.isAuthenticated = false;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

// Authentication middleware for API endpoints (defined BEFORE use)
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ isLoggedIn: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ isLoggedIn: false });
  }
};

// Function to read and inject auth state into HTML
const injectAuthState = (htmlPath) => {
  return async (req, res) => {
    try {
      let html = await fs.promises.readFile(path.join(__dirname, 'public', htmlPath), 'utf8');
      // Inject auth state script
      const authScript = `
        <script>
          window.authState = ${JSON.stringify({
            isAuthenticated: req.isAuthenticated,
            user: req.user || null
          })};
        </script>
      `;
      // Insert the script before the closing </head> tag
      html = html.replace('</head>', `${authScript}</head>`);
      res.send(html);
    } catch (error) {
      console.error('Error reading HTML file:', error);
      res.status(500).send('Error loading page');
    }
  };
};

// Routes for serving HTML pages with auth state
app.get('/', checkAuth, injectAuthState('homepage.html'));
app.get('/login', checkAuth, injectAuthState('loginpg.html'));
app.get('/register', checkAuth, injectAuthState('registerpg.html'));
app.get('/community', checkAuth, injectAuthState('communitypage.html'));
app.get('/books', checkAuth, injectAuthState('books.html'));
app.get('/quotes', checkAuth, injectAuthState('quotes.html'));
app.get('/doctor', checkAuth, injectAuthState('doctor.html'));
app.get('/motivideo', checkAuth, injectAuthState('motivideo.html'));
app.get('/ftrpg', checkAuth, injectAuthState('ftrpg.html'));
app.get('/chatbot', checkAuth, injectAuthState('chatbot.html'));
app.get('/religiousbooks', checkAuth, injectAuthState('religiousbooks.html'));
app.get('/gamesec', checkAuth, injectAuthState('gamesec.html'));    
app.get('/mission', checkAuth, injectAuthState('MISSIONPAGE.HTML'));
app.get('/moodtracker', checkAuth, injectAuthState('moodtracker.html'));
app.get('/tictactoe', checkAuth, injectAuthState('tictactoe.html'));
app.get('/snakegame', checkAuth, injectAuthState('snakegame.html'));
app.get('/tetrisgame', checkAuth, injectAuthState('tetrisgame.html'));

// API route using isAuthenticated middleware
app.get('/api/user-profile', isAuthenticated, async (req, res) => {
  try {
    // Find the user by email from the token
    const user = await User.findOne({ email: req.user.email }).select('firstName lastName email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("'uploads' directory created.");
}

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connection successful"))
  .catch(error => {
    console.error("MongoDB Connection failed:", error);
    process.exit(1);
  });

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    if (allowedTypes.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get authentication status
app.get('/api/auth/status', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ isLoggedIn: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      isLoggedIn: true,
      user: {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        name: `${decoded.firstName} ${decoded.lastName}`,
        email: decoded.email
      }
    });
  } catch (error) {
    console.error('Auth status error:', error);
    res.json({ isLoggedIn: false });
  }
});

// Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword
    });
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ 
      success: true, 
      message: "Registration successful",
      token,
      user: {
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ 
      success: true, 
      message: "Login successful",
      token,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Image upload API
app.post('/upload', isAuthenticated, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }
    const imageData = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }));
    
    const newUpload = new Image({
      images: imageData,
      caption: req.body.caption || "No caption provided",
      uploadedAt: new Date(),
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`
    });
    
    const savedImage = await newUpload.save();
    
    // Format the response to match what the frontend expects
    const response = {
      id: savedImage._id.toString(),
      caption: savedImage.caption,
      uploadedAt: savedImage.uploadedAt,
      likes: 0,
      comments: [],
      images: savedImage.images.map(img => img.path),
      userName: savedImage.userName
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Get all posts (aligned with community page)
app.post('/posts', async (req, res) => {
  try {
    const uploads = await Image.find()
      .sort({ uploadedAt: -1 })
      .populate('userId', 'firstName lastName');
      
    const posts = uploads.map(upload => ({
      id: upload._id.toString(),
      caption: upload.caption,
      uploadedAt: upload.uploadedAt,
      likes: upload.likes ? upload.likes.length : 0,
      comments: upload.comments || [],
      images: upload.images.map(img => img.path),
      userName: upload.userName
    }));
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
});

// Like a post
app.post('/like/:postId', isAuthenticated, async (req, res) => {
  try {
    const post = await Image.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Prevent duplicate likes from the same user:
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.status(200).json({ message: "Post liked", likes: post.likes.length });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});


// Comment on a post
app.post('/comment/:postId', isAuthenticated, async (req, res) => {
  try {
    const post = await Image.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentText = req.body.text;
    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push({ 
      text: commentText, 
      commentedAt: new Date(),
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`
    });
    await post.save();
    res.status(200).json({ message: "Comment added" });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: 'Error commenting on post', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));