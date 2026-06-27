import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'buildora.vexonet.online';

  const hostname = host.split(':')[0];

  if (!hostname.endsWith(`.${baseDomain}`)) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${baseDomain}`, '');

  if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'api') {
    const url = req.nextUrl.clone();
    url.pathname = `/u/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
