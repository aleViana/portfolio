const GITHUB_USER = 'aleViana';

function corsJson(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

export default {
  async fetch(request, env) {
    const headers = {
      'User-Agent': 'portfolio-currently-worker',
      Accept: 'application/vnd.github+json',
    };
    if (env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const apiUrl = `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=1`;
    const upstream = await fetch(apiUrl, {
      headers,
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (!upstream.ok) {
      return corsJson({ error: 'Failed to fetch repos from GitHub' }, 502);
    }

    const repos = await upstream.json();
    const repo = repos[0];
    if (!repo) {
      return corsJson({ error: 'No repos found' }, 502);
    }

    return corsJson({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      pushed_at: repo.pushed_at,
    });
  },
};
