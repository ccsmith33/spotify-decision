import express from 'express';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { buildExplanationPrompt } from './prompt.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 80;
const CLAUDE_TIMEOUT_MS = 30_000;

app.use(express.json());

app.post('/api/explain', async (req, res) => {
  try {
    const { trackName, artistName, audioFeatures, userTopGenres, matchReasons } = req.body;

    if (!trackName || !artistName) {
      res.status(400).json({ error: 'trackName and artistName are required' });
      return;
    }

    const prompt = buildExplanationPrompt({
      trackName,
      artistName,
      audioFeatures,
      userTopGenres,
      matchReasons,
    });

    const { stdout, stderr } = await execFileAsync('claude', ['-p', prompt], {
      timeout: CLAUDE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    });

    if (stderr) {
      console.warn('Claude CLI stderr:', stderr);
    }

    const explanation = stdout.trim();
    if (!explanation) {
      res.status(502).json({ error: 'Claude returned empty response' });
      return;
    }

    res.json({ explanation });
  } catch (err: unknown) {
    const error = err as Error & { killed?: boolean; code?: string | number; signal?: string };

    if (error.killed || error.signal === 'SIGTERM') {
      console.error('Claude CLI timed out after', CLAUDE_TIMEOUT_MS, 'ms');
      res.status(504).json({ error: 'Explanation generation timed out' });
      return;
    }

    if (error.code === 'ENOENT') {
      console.error('Claude CLI not found on PATH — is it installed?');
      res.status(503).json({ error: 'Claude CLI not available' });
      return;
    }

    console.error('Claude explanation error:', error.message);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// Serve Vite production build
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
