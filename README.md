# Domain For Sale Redirect Service

Shows a "Domain For Sale" interstitial page before redirecting visitors to your target site. Designed for Netlify Edge Functions.

## Features

- Configurable delay per domain
- Separate target URL per domain
- Contact email display
- Countdown timer
- Clean, dark-themed design
- Mobile responsive
- SEO-friendly (noindex, canonical tags)

## Setup

### 1. Configure Domains

Edit `redirects.config.json`:

```json
{
  "defaults": {
    "targetUrl": "https://wealthfold.com",
    "delaySeconds": 2,
    "message": "This Domain is For Sale!",
    "subMessage": "You will be redirected shortly...",
    "contactEmail": "domains@wealthfold.com",
    "showCountdown": true
  },
  "domains": {
    "example-domain.com": {
      "targetUrl": "https://your-target-site.com",
      "delaySeconds": 3,
      "message": "example-domain.com is For Sale!"
    },
    "another-domain.com": {
      "targetUrl": "https://different-target.com",
      "delaySeconds": 5
    }
  }
}
```

### Configuration Options

| Field | Type | Description |
|-------|------|-------------|
| `targetUrl` | string | Redirect destination URL |
| `delaySeconds` | number | Seconds to show interstitial before redirect |
| `message` | string | Main heading text |
| `subMessage` | string | Secondary message |
| `contactEmail` | string | Contact email for inquiries |
| `showCountdown` | boolean | Show countdown timer |

- `defaults`: Applied to all domains
- `domains`: Per-domain overrides (inherits from defaults, only specify what's different)

### 2. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Or use Git deployment:
1. Push to GitHub/GitLab
2. Connect repo to Netlify
3. Deploys automatically on each push

### 3. Add Custom Domains

In Netlify Dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Add each domain you want to show the "for sale" page

### 4. Configure DNS

For each domain, set DNS to point to Netlify:

**Option A: CNAME Record**
```
Type: CNAME
Name: @
Value: your-site-name.netlify.app
```

**Option B: Netlify DNS (Recommended)**
1. In Netlify, go to **Domains** → select domain → **Set up Netlify DNS**
2. Update nameservers at your registrar

## How It Works

1. Visitor opens your domain (e.g., `example-domain.com`)
2. Edge function serves an interstitial page showing:
   - Domain name
   - "For Sale" message
   - Contact email
   - Countdown timer
3. After the configured delay, visitor is redirected to the target URL

## Local Development

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

Visit `http://localhost:8888` to test.

## File Structure

```
├── netlify.toml                  # Netlify config
├── redirects.config.json         # Domain configuration
├── public/
│   └── index.html               # Fallback page
└── netlify/
    └── edge-functions/
        └── redirect.ts          # Edge function
```
