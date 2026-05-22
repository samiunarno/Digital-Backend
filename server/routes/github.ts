/**
 * GitHub REST API for the Vibe Coder panel.
 * Frontend calls these to browse the repo, view commits, etc.
 */
import express from 'express';
import * as GitHub from '../lib/github.js';

const router = express.Router();

function requireToken(res: express.Response): boolean {
  if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === 'PASTE_YOUR_PAT_HERE') {
    res.status(503).json({ error: 'GITHUB_TOKEN not configured. Add it to .env and restart the server.' });
    return false;
  }
  return true;
}

// GET /api/github/status
router.get('/status', async (_req, res) => {
  if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === 'PASTE_YOUR_PAT_HERE') {
    return res.json({ connected: false, message: 'GITHUB_TOKEN not set in .env' });
  }
  try {
    const info = await GitHub.getRepoInfo();
    res.json({ connected: true, ...info });
  } catch (e: any) {
    res.json({ connected: false, message: e.message });
  }
});

// GET /api/github/files?path=src
router.get('/files', async (req, res) => {
  if (!requireToken(res)) return;
  try {
    const path = (req.query.path as string) || '';
    const branch = (req.query.branch as string) || 'main';
    const files = await GitHub.listFiles(path, branch);
    res.json({ files });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/github/file?path=src/App.tsx
router.get('/file', async (req, res) => {
  if (!requireToken(res)) return;
  try {
    const path = req.query.path as string;
    if (!path) return res.status(400).json({ error: 'path query param required' });
    const branch = (req.query.branch as string) || 'main';
    const file = await GitHub.getFile(path, branch);
    res.json(file);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/github/commits?branch=main&limit=10
router.get('/commits', async (req, res) => {
  if (!requireToken(res)) return;
  try {
    const branch = (req.query.branch as string) || 'main';
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const commits = await GitHub.getCommits(branch, limit);
    res.json({ commits });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
