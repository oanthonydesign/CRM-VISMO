import { getKPIs } from '@/app/actions/dashboard';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getKPIs();
    return NextResponse.json(data);
}
