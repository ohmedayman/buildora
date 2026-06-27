import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'buildora.vexonet.online';

  const hostname = host.split(':')[0];

  // Check if it's a subdomain of buildora.vexonet.online
  if (hostname.endsWith(`.${baseDomain}`)) {
    const subdomain = hostname.replace(`.${baseDomain}`, '');
    if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'api') {
      const url = req.nextUrl.clone();
      url.pathname = `/u/${subdomain}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Check for custom domains - redirect to a catch-all route
  // Custom domains will be handled by the /u/[username] page
  // via a lookup in the users table
  if (hostname !== baseDomain && !hostname.includes('vercel.app') && !hostname.includes('localhost')) {
    const url = req.nextUrl.clone();
    url.pathname = `/custom-domain/${hostname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
