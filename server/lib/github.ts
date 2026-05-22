/**
 * GitHub REST API helper
 * Handles all read/write operations against samiunarno/Digital-Backend
 */

const BASE = 'https://api.github.com';

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set in .env');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

const OWNER = () => process.env.GITHUB_OWNER || 'samiunarno';
const REPO  = () => process.env.GITHUB_REPO  || 'Digital-Backend';

/* ── Read a file ── */
export async function getFile(path: string, branch = 'main') {
  const url = `${BASE}/repos/${OWNER()}/${REPO()}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub getFile failed: ${e.message || res.status}`);
  }
  const data = await res.json() as any;
  // Decode base64 content
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha, path: data.path };
}

/* ── List files in a directory ── */
export async function listFiles(path: string = '', branch = 'main') {
  const url = `${BASE}/repos/${OWNER()}/${REPO()}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub listFiles failed: ${e.message || res.status}`);
  }
  const data = await res.json() as any;
  if (Array.isArray(data)) {
    return data.map((f: any) => ({ name: f.name, path: f.path, type: f.type, size: f.size }));
  }
  return [{ name: data.name, path: data.path, type: data.type }];
}

/* ── Create or update a file ── */
export async function updateFile(
  path: string,
  content: string,
  message: string,
  branch = 'main'
) {
  // Get current SHA if file exists
  let sha: string | undefined;
  try {
    const existing = await getFile(path, branch);
    sha = existing.sha;
  } catch {
    // File doesn't exist yet — that's fine
  }

  const body: any = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch,
  };
  if (sha) body.sha = sha;

  const url = `${BASE}/repos/${OWNER()}/${REPO()}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub updateFile failed: ${e.message || res.status}`);
  }
  const data = await res.json() as any;
  return {
    committed: true,
    sha: data.content?.sha,
    url: data.content?.html_url,
    commit: data.commit?.html_url,
  };
}

/* ── Create a new branch ── */
export async function createBranch(branchName: string, fromBranch = 'main') {
  // Get SHA of head commit on source branch
  const refRes = await fetch(
    `${BASE}/repos/${OWNER()}/${REPO()}/git/ref/heads/${fromBranch}`,
    { headers: headers() }
  );
  if (!refRes.ok) {
    const e = await refRes.json() as any;
    throw new Error(`GitHub createBranch (get ref) failed: ${e.message || refRes.status}`);
  }
  const refData = await refRes.json() as any;
  const sha = refData.object.sha;

  const res = await fetch(`${BASE}/repos/${OWNER()}/${REPO()}/git/refs`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
  });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub createBranch failed: ${e.message || res.status}`);
  }
  return { created: true, branch: branchName, from: fromBranch };
}

/* ── Create a Pull Request ── */
export async function createPullRequest(
  title: string,
  body: string,
  head: string,
  base = 'main'
) {
  const res = await fetch(`${BASE}/repos/${OWNER()}/${REPO()}/pulls`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title, body, head, base }),
  });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub createPR failed: ${e.message || res.status}`);
  }
  const data = await res.json() as any;
  return { created: true, url: data.html_url, number: data.number, title: data.title };
}

/* ── Get recent commits ── */
export async function getCommits(branch = 'main', limit = 5) {
  const url = `${BASE}/repos/${OWNER()}/${REPO()}/commits?sha=${branch}&per_page=${limit}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub getCommits failed: ${e.message || res.status}`);
  }
  const data = await res.json() as any;
  return data.map((c: any) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
    url: c.html_url,
  }));
}

/* ── Get repo info ── */
export async function getRepoInfo() {
  const res = await fetch(`${BASE}/repos/${OWNER()}/${REPO()}`, { headers: headers() });
  if (!res.ok) {
    const e = await res.json() as any;
    throw new Error(`GitHub getRepoInfo failed: ${e.message || res.status}`);
  }
  const d = await res.json() as any;
  return {
    name: d.name,
    fullName: d.full_name,
    description: d.description,
    stars: d.stargazers_count,
    forks: d.forks_count,
    defaultBranch: d.default_branch,
    url: d.html_url,
    private: d.private,
  };
}
