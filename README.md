# 🕊️ PeacePulse — Mental Wellness & Community Platform

> *"A safe space for your mind, soul, and inner peace."*

PeacePulse is a full-stack mental wellness web application built with **Node.js**, **Express**, and **MongoDB**. It provides users with tools for emotional well-being — including an AI chatbot therapist, mood tracker, motivational content, community sharing, games, books, and more — all behind a secure JWT-based authentication system.

---

## 🌐 Live Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with features overview |
| Login | `/login` | User authentication |
| Register | `/register` | New user sign-up |
| Community | `/community` | Social feed with posts, likes, comments |
| Books | `/books` | Self-help & motivational book library |
| Religious Books | `/religiousbooks` | Bhagavad Gita, Bible, Quran, and more |
| Quotes | `/quotes` | Inspirational quotes collection |
| Doctor | `/doctor` | Mental health professional directory |
| Motivational Videos | `/motivideo` | Curated video content |
| Games Section | `/gamesec` | Games hub for relaxation |
| Snake Game | `/snakegame` | Classic snake game |
| Tetris Game | `/tetrisgame` | Classic tetris game |
| Tic Tac Toe | `/tictactoe` | Classic tic-tac-toe game |
| Features Page | `/ftrpg` | RPG-style text adventure game |
| Mood Tracker | `/moodtracker` | Chart-based mood assessment tool |
| AI Chatbot | `/chatbot` | AI therapist chatbot |
| Mission | `/mission` | About PeacePulse's mission |

---

## 🖼️ Screenshots

### 🏠 Homepage
![Homepage](screenshots/books.png)

### 🔐 Login Page
![Login](screenshots/login.png)

### 📝 Register Page
![Register](screenshots/register.png)

### 👥 Community Page
![Community](screenshots/community.png)

### 📚 Books Library
![Books](screenshots/books.png)

### 🙏 Religious Books
![Religious Books](screenshots/religiousbooks.png)

### 💬 Quotes Page
![Quotes](screenshots/quotes.png)

### 🩺 Doctor Directory
![Doctor](screenshots/doctor.png)

### 🎬 Motivational Videos
![Motivational Videos](screenshots/motivideo.png)

### 🎮 Games Section
![Games Section](screenshots/gamesec.png)

### 🐍 Snake Game
![Snake Game](screenshots/snakegame.png)

### 🧱 Tetris Game
![Tetris](screenshots/tetrisgame.png)

### ❌⭕ Tic Tac Toe
![Tic Tac Toe](screenshots/tictactoe.png)

### ⚔️ Features Page
![Features Page](screenshots/ftrpg.png)

### 📊 Mood Tracker
![Mood Tracker](screenshots/moodtracker.png)

### 🤖 AI Chatbot Therapist
![Chatbot](screenshots/chatbot.png)

### 🎯 Mission Page
![Mission](screenshots/mission.png)

---

## 🗂️ Project Structure

```
peace_pulse/
├── .env                        # Environment variables (MongoDB URI, JWT secret, port)
├── package.json                # Node.js dependencies and scripts
├── server.js                   # Main Express server — routes, auth, API endpoints
│
├── models/
│   └── Image.js                # Mongoose schema for community posts (images, likes, comments)
│
└── public/                     # All static front-end assets served by Express
    │
    ├── homepage.html           # Main landing page
    ├── loginpg.html            # Login page
    ├── registerpg.html         # Registration page
    ├── communitypage.html      # Community social feed
    ├── books.html              # Book library page
    ├── religiousbooks.html     # Religious texts page
    ├── quotes.html             # Inspirational quotes
    ├── doctor.html             # Doctor/therapist directory
    ├── motivideo.html          # Motivational videos
    ├── gamesec.html            # Games hub
    ├── snakegame.html          # Snake game
    ├── tetrisgame.html         # Tetris game
    ├── tictactoe.html          # Tic Tac Toe game
    ├── ftrpg.html              # Features Page
    ├── moodtracker.html        # Mood tracking with Chart.js
    ├── chatbot.html            # AI therapist chatbot
    ├── MISSIONPAGE.HTML        # Mission/about page
    ├── navbar.html             # Shared navbar component
    ├── navbar.css              # Navbar styles
    ├── common-header.html      # Shared header component
    │
    ├── css/
    │   └── authComponent.css   # Shared auth-related styles
    │
    ├── js/
    │   └── authComponent.js    # Client-side JWT auth logic (login, logout, user state)
    │
    ├── uploads/                # User-uploaded community images (auto-created)
    │
    └── [assets]                # Images, GIFs, PDFs for books and content
        ├── *.pdf               # Book PDFs (Atomic Habits, Bhagavad Gita, Bible, Quran, etc.)
        ├── *.jpg / *.png       # Book covers and UI images
        └── *.gif               # Animated feature previews
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js v4 |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) + bcrypt |
| **File Uploads** | Multer (images, max 5MB) |
| **Front-End** | Vanilla HTML, CSS, JavaScript |
| **Charts** | Chart.js + chartjs-adapter-moment |
| **Icons & Fonts** | Font Awesome 5, Google Fonts (Poppins) |
| **Environment** | dotenv |

---

## 🔄 Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                        │
│                                                                 │
│   authComponent.js — manages JWT in localStorage               │
│   Sends Authorization: Bearer <token> on every API request     │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express Server (server.js)                 │
│                                                                 │
│  ┌─────────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │   checkAuth     │   │ isAuthenticated│  │  injectAuthState│  │
│  │ (page middleware)│   │(API middleware)│  │ (HTML injection)│  │
│  └────────┬────────┘   └──────┬───────┘   └────────┬────────┘  │
│           │                   │                    │           │
│  ┌────────▼───────────────────▼────────────────────▼────────┐  │
│  │                       Routes                              │  │
│  │  GET /           → homepage.html (+ auth state injected) │  │
│  │  POST /register  → create user, return JWT               │  │
│  │  POST /login     → verify user, return JWT               │  │
│  │  POST /upload    → save images to DB (auth required)     │  │
│  │  POST /posts     → fetch all community posts             │  │
│  │  POST /like/:id  → toggle like on post (auth required)   │  │
│  │  POST /comment/:id → add comment (auth required)         │  │
│  │  GET /api/user-profile → get current user info           │  │
│  └───────────────────────────┬──────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │       MongoDB (Mongoose)      │
                │                              │
                │   ┌──────────────────────┐   │
                │   │  User Collection     │   │
                │   │  - firstName         │   │
                │   │  - lastName          │   │
                │   │  - email (unique)    │   │
                │   │  - password (hashed) │   │
                │   └──────────────────────┘   │
                │   ┌──────────────────────┐   │
                │   │  Image Collection    │   │
                │   │  - images[]          │   │
                │   │  - caption           │   │
                │   │  - userId            │   │
                │   │  - userName          │   │
                │   │  - likes[]           │   │
                │   │  - comments[]        │   │
                │   │  - uploadedAt        │   │
                │   └──────────────────────┘   │
                └──────────────────────────────┘
```

### 🔐 Authentication Flow

```
1. User registers → password hashed with bcrypt (salt rounds: 10)
2. Server issues JWT signed with JWT_SECRET (expires 24h)
3. Client stores JWT in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Server middleware (isAuthenticated) verifies token on protected routes
6. Server injects window.authState into HTML for client-side UI updates
```

### 📸 Community Post Flow

```
1. Authenticated user selects images (up to 10, max 5MB each)
2. POST /upload → Multer saves files to public/uploads/
3. Image metadata saved to MongoDB (Image model)
4. Community feed fetches all posts via POST /posts
5. Users can like (unique per user) and comment on posts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm
- MongoDB Community Server (local) **or** MongoDB Atlas (cloud)

---

## 🍃 MongoDB Setup — Step by Step

PeacePulse uses MongoDB to store **user accounts** and **community posts** (images, likes, comments). Follow one of the two options below depending on whether you want to run MongoDB locally on your machine or use the free cloud service.

---

### Option A — Local MongoDB (Recommended for Development)

#### Step 1 — Download & Install MongoDB Community Server

1. Go to the official MongoDB download page:
   👉 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. Select your OS:
   - **Windows** → Choose `msi` package → click **Download**
   - **macOS** → Choose `tgz` package or use Homebrew (see below)
   - **Linux (Ubuntu)** → Follow the APT instructions below

3. **Windows installer:**
   - Run the downloaded `.msi` file
   - Choose **Complete** installation
   - ✅ Check "Install MongoDB as a Service" — this auto-starts MongoDB on boot
   - ✅ Check "Install MongoDB Compass" (optional GUI tool — very useful)
   - Click **Install** and wait for completion

4. **macOS (Homebrew):**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

5. **Linux (Ubuntu/Debian):**
   ```bash
   # Import MongoDB public GPG key
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
     sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

   # Add MongoDB repo
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
     https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
     sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

   # Install
   sudo apt-get update
   sudo apt-get install -y mongodb-org

   # Start MongoDB service
   sudo systemctl start mongod
   sudo systemctl enable mongod   # auto-start on boot
   ```

---

#### Step 2 — Verify MongoDB is Running

Open a terminal and run:

```bash
mongosh
```

You should see something like:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
...
test>
```

Type `exit` to leave the shell. If it connects — MongoDB is running perfectly. ✅

> **Windows tip:** If `mongosh` is not found, add `C:\Program Files\MongoDB\Server\7.0\bin` to your system PATH, or search for **MongoDB Shell** in the Start menu.

---

#### Step 3 — Create the Database

MongoDB creates databases automatically when first used — you don't need to manually create it. But you can verify it gets created by running the server once (step 6 below). The database name used by PeacePulse is **`registered_data`**.

To manually inspect or create it:
```bash
mongosh
use registered_data
# MongoDB will create it automatically when data is first inserted
show dbs   # won't show registered_data until at least one document is inserted
```

---

#### Step 4 — Set the Local MONGO_URI in `.env`

Open the `.env` file in the project root and make sure it looks like this:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/registered_data
JWT_SECRET=your_strong_secret_key_here
```

> Use `127.0.0.1` instead of `localhost` to avoid IPv6 resolution issues on some systems.

---

### Option B — MongoDB Atlas (Free Cloud Database)

Use this if you don't want to install MongoDB locally, or want to deploy the app online.

#### Step 1 — Create a Free Atlas Account

1. Go to 👉 [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or email — it's free
3. Choose the **Free (M0 Shared)** tier when prompted
4. Select a region close to you (e.g., AWS Mumbai for India)
5. Click **Create Cluster** and wait ~2 minutes

#### Step 2 — Create a Database User

1. In the left sidebar, go to **Security → Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter a username (e.g., `peacepulse_user`) and a strong password
5. Set role to **Atlas Admin** (or **Read and write to any database**)
6. Click **Add User**

#### Step 3 — Whitelist Your IP Address

1. Go to **Security → Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development) → `0.0.0.0/0`
   > For production, add only your server's specific IP
4. Click **Confirm**

#### Step 4 — Get Your Connection String

1. Go to **Database → Connect** on your cluster
2. Click **Connect your application**
3. Select **Node.js** as the driver, version **4.1 or later**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with the credentials you created

#### Step 5 — Set the Atlas MONGO_URI in `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://peacepulse_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/registered_data?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_key_here
```

> Replace `registered_data` in the URI — this sets the database name Atlas will use.

---

### Understanding the MongoDB Collections

Once the app runs, MongoDB will automatically create two collections inside `registered_data`:

#### `users` Collection
Stores all registered accounts. Each document looks like:
```json
{
  "_id": "ObjectId(...)",
  "firstName": "Raj",
  "middleName": "",
  "lastName": "Patel",
  "email": "raj@example.com",
  "password": "$2b$10$hashedpassword...",
  "createdAt": "2025-03-08T10:00:00Z"
}
```

#### `images` Collection
Stores community posts. Each document looks like:
```json
{
  "_id": "ObjectId(...)",
  "images": [
    { "filename": "1741802567442.jpg", "path": "/uploads/1741802567442.jpg" }
  ],
  "caption": "Feeling peaceful today 🌿",
  "userId": "ObjectId(...)",
  "userName": "Raj Patel",
  "likes": ["ObjectId(user1)", "ObjectId(user2)"],
  "comments": [
    {
      "text": "Beautiful!",
      "commentedAt": "2025-03-12T18:05:00Z",
      "userId": "ObjectId(...)",
      "userName": "Priya Shah"
    }
  ],
  "uploadedAt": "2025-03-12T18:02:00Z"
}
```

---

### Viewing Your Data with MongoDB Compass (GUI)

MongoDB Compass is a free visual tool to browse your database — great for debugging.

1. Download from 👉 [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Open Compass
3. For **local**: paste `mongodb://127.0.0.1:27017` and click **Connect**
4. For **Atlas**: paste your full `mongodb+srv://...` URI and click **Connect**
5. You'll see the `registered_data` database with `users` and `images` collections

---

## 🔧 Project Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/peace-pulse.git
cd peace-pulse

# 2. Install dependencies
npm install

# 3. Configure your .env file (see MongoDB setup above)
# Make sure MONGO_URI points to your running MongoDB instance

# 4. Start the server
npm start
```

You should see in the terminal:
```
MongoDB Connection successful
Server running at http://localhost:5000
```

Visit **http://localhost:5000** in your browser. 🎉

---

## 🌍 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/registered_data` |
| `JWT_SECRET` | Secret key for JWT signing | Use a long random string in production |

> ⚠️ **Security Note:** Never commit your `.env` file to GitHub. Add it to `.gitignore`.

### Generating a Strong JWT_SECRET

```bash
# Run this in your terminal to generate a secure random secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

---

## 🛠️ Common MongoDB Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB service not running | Run `sudo systemctl start mongod` (Linux) or start the service from Windows Services |
| `Authentication failed` | Wrong username/password in Atlas URI | Double-check credentials in `.env` |
| `IP not whitelisted` | Atlas Network Access not configured | Add your IP in Atlas → Network Access |
| `MongoParseError: Invalid connection string` | Malformed URI | Check for special characters in your password — URL-encode them (e.g., `@` → `%40`) |
| Server starts but DB not created | No data inserted yet | Register a user — the DB and collections appear automatically |

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register new user |
| `POST` | `/login` | No | Login and receive JWT |
| `GET` | `/api/auth/status` | Optional | Check login status |
| `GET` | `/api/user-profile` | ✅ Yes | Get current user info |

### Community Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/upload` | ✅ Yes | Upload images to community |
| `POST` | `/posts` | No | Fetch all community posts |
| `POST` | `/like/:postId` | ✅ Yes | Like a post (unique per user) |
| `POST` | `/comment/:postId` | ✅ Yes | Add a comment to a post |

---

## ✨ Features

- **🔐 Secure Auth** — JWT + bcrypt password hashing, 24h token expiry
- **👥 Community Feed** — Share images with captions, likes, and comments
- **📚 Book Library** — Self-help and spiritual books with embedded PDFs
- **🤖 AI Chatbot** — In-browser AI therapist for mental wellness support
- **📊 Mood Tracker** — Visual mood assessment with Chart.js graphs
- **🎮 Games** — Snake, Tetris, Tic Tac Toe, and a Features Page for relaxation
- **🩺 Doctor Directory** — Find mental health professionals
- **🎬 Motivational Videos** — Curated YouTube content
- **💬 Quotes** — Daily inspirational quotes
- **🙏 Religious Books** — Bhagavad Gita, Bible, Quran PDFs
- **📱 Responsive Design** — Mobile-first with glassmorphism UI

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with 💙 as a mental wellness platform to help people find peace, community, and growth.

---

> *"Take care of your mind, and your mind will take care of you."*
