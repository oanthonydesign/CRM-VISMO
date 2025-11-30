import { getGoals } from '@/app/actions/dashboard';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getGoals();
    return NextResponse.json(data);
}
