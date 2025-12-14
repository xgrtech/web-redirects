# Domain Redirect Service

301 permanent redirects from multiple domains to your target site.

## Setup

1. Edit `redirects.config.json` with your domains:

```json
{
  "redirects": {
    "old-domain1.com": "https://yoursite.com",
    "old-domain2.com": "https://yoursite.com/landing"
  },
  "defaultRedirect": "https://yoursite.com"
}
```

2. Deploy to Netlify:
   - Push to GitHub/GitLab
   - Connect repo to Netlify
   - Deploy

3. Add custom domains in Netlify:
   - Go to Site settings → Domain management
   - Add each domain you want to redirect
   - Update DNS for each domain to point to Netlify

## DNS Setup

For each domain, set DNS to:
- **Option A**: CNAME record pointing to `your-netlify-site.netlify.app`
- **Option B**: Use Netlify DNS (recommended)

## How it works

- All requests hit the edge function
- Edge function checks the incoming hostname
- Returns 301 redirect to configured target
- Preserves URL path (e.g., `/blog/post` stays intact)
