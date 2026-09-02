import astroHandler from '@astrojs/cloudflare/entrypoints/server';
import { resolveRequestRedirect } from './lib/request-redirects';

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const redirect = resolveRequestRedirect(request);
    if (redirect) return redirect;
    return astroHandler.fetch(request, env, ctx);
  },
};
