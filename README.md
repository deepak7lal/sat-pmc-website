# SAT PMC website

Static website for SAT Project Management Consultants, based in Kochi and serving projects across Kerala.

## Hosting

Cloudflare Pages serves the files from the repository root. No dependency installation or build command is required. The production branch is `main`.

## Content

The site includes an interactive architectural model, services, selected projects, the full project register, clients, team profiles, six service guides and the updated company profile PDF. Existing service URLs are preserved. `/project-register` redirects to the register below the project photos.

## Enquiries

The enquiry form uses the existing Formspree endpoint `https://formspree.io/f/xoeabkaa`. It includes submission feedback, a honeypot and native submission without JavaScript. Local tests mocked provider responses; actual inbox delivery still requires a real test enquiry and confirmation of receipt.

## Search

The site includes page titles, descriptions, canonical URLs, structured data, robots.txt and sitemap.xml. Submit `https://satpmc.com/sitemap.xml` in Google Search Console after publication. Search visibility and rankings are not guaranteed.

The previous website remains available in Git history for rollback.
