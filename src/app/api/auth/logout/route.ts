import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('sb-access-token', '', { httpOnly: true, secure: true, maxAge: 0, path: '/' });
  response.cookies.set('sb-refresh-token', '', { httpOnly: true, secure: true, maxAge: 0, path: '/' });
  return response;
}
