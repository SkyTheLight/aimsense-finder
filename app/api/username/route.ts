import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const cleanedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

  if (cleanedUsername.length < 3 || cleanedUsername.length > 20) {
    return NextResponse.json({ valid: false, error: 'Username must be 3-20 characters' });
  }

  if (/^[0-9_]+$/.test(cleanedUsername)) {
    return NextResponse.json({ valid: false, error: 'Username cannot be all numbers' });
  }

  const exists = await prisma.user.findFirst({
    where: { username: cleanedUsername },
  });

  return NextResponse.json({ 
    valid: !exists,
    username: cleanedUsername,
    error: exists ? 'Username already taken' : null 
  });
}