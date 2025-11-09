import express from "express";
import { registerRoutes } from '../dist/routes.js';
import { serveStatic } from '../dist/vite.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes and serve static files
let initialized = false;

async function initializeApp() {
  if (!initialized) {
    await registerRoutes(app);
    serveStatic(app);
    initialized = true;
  }
  return app;
}

export default async function handler(req, res) {
  const app = await initializeApp();
  return app(req, res);
}
