Here’s a clean, well-formatted version you can drop directly into your **README.md**:

````markdown
# Node.js + Express Setup Guide

## 1. Install Node.js
Download from [nodejs.org](https://nodejs.org/) (LTS version recommended).

Verify installation:
```bash
node -v
npm -v
````

---

## 2. Create Project Folder

```bash
mkdir my-express-app
cd my-express-app
```

---

## 3. Initialize Project

```bash
npm init -y
```

This creates a `package.json` file (stores project details & dependencies).

---

## 4. Install Express

```bash
npm install express
```

---

## 5. Create Entry File

Create a file called `server.js` (or `app.js`):

```js
// server.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

---

## 6. Run the Server

```bash
node server.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 7. (Optional) Install Nodemon for Auto-Restart

```bash
npm install --save-dev nodemon
```

Add this script to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run in dev mode:

```bash
npm run dev
```

