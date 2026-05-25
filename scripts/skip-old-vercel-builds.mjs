const commit = process.env.VERCEL_GIT_COMMIT_SHA;
const ref = process.env.VERCEL_GIT_COMMIT_REF;
const owner = process.env.VERCEL_GIT_REPO_OWNER;
const repo = process.env.VERCEL_GIT_REPO_SLUG;

if (!commit || !ref || !owner || !repo) process.exit(1);

try {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`);
  if (!response.ok) process.exit(1);
  const latest = await response.json();
  process.exit(latest?.sha && latest.sha !== commit ? 0 : 1);
} catch {
  process.exit(1);
}
