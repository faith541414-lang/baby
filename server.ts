import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ALT_TOKEN = process.env.ALT_TOKEN;
const DISCORD_API = 'https://discord.com/api/v10';

// Profile state (in-memory for now)
let profile = {
  bio: "This is my boyfriend's account bio. I love my girlfriend!",
  pfp: "https://picsum.photos/seed/bf/200/200"
};

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  
  // Send Discord message
  app.post("/api/send-message", async (req, res) => {
    const { channelId, message } = req.body;
    if (!ALT_TOKEN) {
      return res.status(500).json({ error: "ALT_TOKEN not configured on server." });
    }
    try {
      await axios.post(
        `${DISCORD_API}/channels/${channelId}/messages`,
        { content: message },
        { headers: { 'Authorization': ALT_TOKEN, 'Content-Type': 'application/json' } }
      );
      res.json({ success: true });
    } catch (error: any) {
      console.error("Discord API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to send message to Discord." });
    }
  });

  // Get Profile
  app.get("/api/profile", (req, res) => {
    res.json(profile);
  });

  // Update Bio
  app.post("/api/profile/bio", (req, res) => {
    const { bio } = req.body;
    profile.bio = bio;
    res.json({ success: true, bio: profile.bio });
  });

  // Update PFP
  app.post("/api/profile/pfp", upload.single('pfp'), (req, res) => {
    if (req.file) {
      profile.pfp = `/uploads/${req.file.filename}`;
      res.json({ success: true, pfp: profile.pfp });
    } else {
      res.status(400).json({ error: "No file uploaded." });
    }
  });

  // Update Display Name
  app.post("/api/profile/display-name", async (req, res) => {
    const { displayName } = req.body;
    if (!ALT_TOKEN) return res.status(500).json({ error: "ALT_TOKEN missing." });
    try {
      await axios.patch(
        `${DISCORD_API}/users/@me`,
        { global_name: displayName },
        { headers: { 'Authorization': ALT_TOKEN, 'Content-Type': 'application/json' } }
      );
      res.json({ success: true });
    } catch (error: any) {
      console.error("Display Name Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to update display name." });
    }
  });

  // Update Status (Online, Idle, DND, Invisible)
  app.post("/api/profile/status", async (req, res) => {
    const { status } = req.body;
    if (!ALT_TOKEN) return res.status(500).json({ error: "ALT_TOKEN missing." });
    try {
      await axios.patch(
        `${DISCORD_API}/users/@me/settings`,
        { status },
        { headers: { 'Authorization': ALT_TOKEN, 'Content-Type': 'application/json' } }
      );
      res.json({ success: true });
    } catch (error: any) {
      console.error("Status Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to update status." });
    }
  });

  // Update Custom Status
  app.post("/api/profile/custom-status", async (req, res) => {
    const { text, emoji } = req.body;
    if (!ALT_TOKEN) return res.status(500).json({ error: "ALT_TOKEN missing." });
    try {
      await axios.patch(
        `${DISCORD_API}/users/@me/settings`,
        { 
          custom_status: { 
            text: text || null, 
            emoji_name: emoji || null 
          } 
        },
        { headers: { 'Authorization': ALT_TOKEN, 'Content-Type': 'application/json' } }
      );
      res.json({ success: true });
    } catch (error: any) {
      console.error("Custom Status Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to update custom status." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
