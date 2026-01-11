import redirectConfig from "../../redirects.config.json" with { type: "json" };

interface DomainSettings {
  targetUrl: string;
}

interface RedirectConfig {
  defaults: {
    targetUrl: string;
  };
  domains: Record<string, { targetUrl?: string }>;
}

const settings = redirectConfig as RedirectConfig;

export default async (request: Request) => {
  const url = new URL(request.url);
  const host = url.hostname.replace(/^www\./, ""); // normalize www

  // Get target URL for this domain
  const domainConfig = settings.domains?.[host];
  const targetUrl = domainConfig?.targetUrl || settings.defaults.targetUrl;

  // Preserve the path and query string
  const fullTarget = targetUrl + url.pathname + url.search;

  return Response.redirect(fullTarget, 301);
};

export const config = {
  path: "/*",
};
