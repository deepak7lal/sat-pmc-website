# SAT PMC — Website

Marketing site for SAT PMC, a project management consultancy in Kochi, Kerala.

## Sections

- **Lifecycle** — how the practice works through a project, stage by stage
- **Capability** — "Four things we are asked for most"
- **Team** — "You get the directors, not a junior"
- **Projects** — completed work
- **FAQ**
- **Contact** — "Tell us about the project"

## How it is built

Static HTML and CSS in a single `index.html`, with images alongside it. No
framework, no build step, no JavaScript dependencies. A brochure site loads
faster and breaks less when it is served as files, and there is nothing here
that needs more.

## Running it

```bash
git clone https://github.com/deepak7lal/website.git
cd website
python -m http.server 8000
```

Then visit http://localhost:8000. Opening `index.html` directly works too.

## Deploying

Any static host serves it as-is: GitHub Pages, Netlify, Cloudflare Pages, or a
plain web server. No configuration beyond pointing the host at the repository
root.

## Related

The consultancy's internal project tracker lives in
[SAT-PMC](https://github.com/deepak7lal/SAT-PMC).
