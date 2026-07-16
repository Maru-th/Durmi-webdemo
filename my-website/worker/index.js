/**
 * Static-site entry point for the Dermi preview.
 * The hosting platform provides the ASSETS binding at deployment time.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url.toString(), request));
  },
};
