# Portfolio (Static)

Plain HTML/CSS/JS portfolio

## Structure

```
index.html       Single-page site (Home, Projects, Experience, Interests, Contact)
css/style.css     Design tokens + styles (light theme, edit :root in style.css to re-theme)
js/main.js        Mobile nav toggle, scroll-spy, reveal-on-scroll
assets/           Favicon and any images
```

## Editing content

All content lives directly in `index.html` — replace the placeholder text in the
Projects, Experience, and Interests sections, and update the contact links
(email, GitHub, LinkedIn) in the Contact section and footer.

## Local preview

Any static file server works, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploying to Cloudflare Pages

1. Push this folder to a GitHub/GitLab repo (or connect it directly via Direct Upload).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - **Build command:** (leave blank)
   - **Build output directory:** `/`
4. Deploy. Cloudflare will serve `index.html` and the `css/`, `js/`, `assets/` folders as-is.

No environment variables or build tooling are required.
