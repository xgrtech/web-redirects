import redirectConfig from "../../redirects.config.json" with { type: "json" };

export default async (request: Request) => {
  const url = new URL(request.url);
  const host = url.hostname.replace(/^www\./, ""); // normalize www

  // Find matching redirect
  const targetUrl = redirectConfig.redirects[host] || redirectConfig.defaultRedirect;

  // Preserve the path if needed (optional)
  const fullTarget = targetUrl + url.pathname + url.search;

  return Response.redirect(fullTarget, 301);
};

export const config = {
  path: "/*",
};
