/**
 * GitHub REST API for the Vibe Coder panel.
 * Frontend calls these to browse the repo, view commits, etc.
 */
import express from 'express';
import * as GitHub from '../lib/github.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

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

// POST /api/github/push
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

router.post('/push', async (req, res) => {
  const { message = 'feat: update code autonomously via Joyi' } = req.body || {};
  try {
    // 1. Stage all changes
    await execPromise('git add .');
    
    // 2. Check if there are changes to commit
    try {
      const status = await execPromise('git status --porcelain');
      if (!status.stdout.trim()) {
        return res.json({ success: true, message: 'No local changes found to push.' });
      }
    } catch {
      // If porcelain fails, just try committing
    }

    // 3. Commit
    await execPromise(`git commit -m ${JSON.stringify(message)}`);
    
    // 4. Push
    const branchRes = await execPromise('git branch --show-current');
    const branch = branchRes.stdout.trim() || 'main';
    
    await execPromise(`git push origin ${branch}`);
    
    res.json({
      success: true,
      message: `Successfully pushed all local changes to branch '${branch}' on GitHub!`,
      branch,
    });
  } catch (err: any) {
    console.error('Git push failed:', err.message);
    res.status(500).json({ error: `Git push failed: ${err.message}` });
  }
});

export default router;
