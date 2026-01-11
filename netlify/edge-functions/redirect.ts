import redirectConfig from "../../redirects.config.json" with { type: "json" };

interface DomainConfig {
  targetUrl: string;
  delaySeconds: number;
  message: string;
  subMessage: string;
  contactEmail: string;
  showCountdown: boolean;
}

interface RedirectConfig {
  defaults: DomainConfig;
  domains: Record<string, Partial<DomainConfig>>;
}

const config = redirectConfig as RedirectConfig;

function getConfigForDomain(hostname: string): DomainConfig {
  const defaults = config.defaults;
  const domainOverrides = config.domains?.[hostname] || {};

  return {
    targetUrl: domainOverrides.targetUrl || defaults.targetUrl,
    delaySeconds: domainOverrides.delaySeconds ?? defaults.delaySeconds,
    message: domainOverrides.message || defaults.message,
    subMessage: domainOverrides.subMessage || defaults.subMessage,
    contactEmail: domainOverrides.contactEmail || defaults.contactEmail,
    showCountdown: domainOverrides.showCountdown ?? defaults.showCountdown,
  };
}

function generateInterstitialHTML(domain: string, domainConfig: DomainConfig): string {
  const {
    targetUrl,
    delaySeconds,
    message,
    subMessage,
    contactEmail,
    showCountdown,
  } = domainConfig;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="${delaySeconds};url=${targetUrl}">
  <title>${domain} - Domain For Sale</title>

  <!-- SEO Tags -->
  <link rel="canonical" href="${targetUrl}">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="${domain} is for sale. Contact us for inquiries.">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #0f172a;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      width: 100%;
    }

    .domain-badge {
      display: inline-block;
      background: rgba(59, 130, 246, 0.2);
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 8px 20px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 24px;
      letter-spacing: 0.5px;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .sub-message {
      font-size: 1.1rem;
      opacity: 0.8;
      margin-bottom: 32px;
    }

    .contact {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }

    .contact-label {
      font-size: 0.875rem;
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .contact-email {
      font-size: 1.25rem;
      font-weight: 600;
      color: #3b82f6;
      text-decoration: none;
    }

    .contact-email:hover {
      text-decoration: underline;
    }

    .countdown {
      font-size: 0.9rem;
      opacity: 0.6;
    }

    .countdown-number {
      font-weight: 700;
      font-size: 1.1rem;
      color: #3b82f6;
    }

    .skip-link {
      display: inline-block;
      margin-top: 16px;
      color: #ffffff;
      opacity: 0.5;
      font-size: 0.85rem;
      text-decoration: none;
    }

    .skip-link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 1.75rem;
      }
      .domain-badge {
        font-size: 0.95rem;
        padding: 6px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="domain-badge">${domain}</div>
    <h1>${message}</h1>
    <p class="sub-message">${subMessage}</p>

    <div class="contact">
      <p class="contact-label">Interested? Contact us:</p>
      <a href="mailto:${contactEmail}" class="contact-email">${contactEmail}</a>
    </div>

    ${showCountdown ? `
    <p class="countdown">
      Redirecting in <span class="countdown-number" id="countdown">${delaySeconds}</span> seconds...
    </p>
    ` : ""}

    <a href="${targetUrl}" class="skip-link">Skip to destination →</a>
  </div>

  <script>
    (function() {
      const targetUrl = "${targetUrl}";
      let countdown = ${delaySeconds};
      const countdownEl = document.getElementById('countdown');

      const timer = setInterval(function() {
        countdown--;
        if (countdownEl) {
          countdownEl.textContent = countdown;
        }
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = targetUrl;
        }
      }, 1000);
    })();
  </script>
</body>
</html>`;
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const host = url.hostname.replace(/^www\./, ""); // normalize www

  const domainConfig = getConfigForDomain(host);
  const html = generateInterstitialHTML(host, domainConfig);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};

export const config = {
  path: "/*",
};
