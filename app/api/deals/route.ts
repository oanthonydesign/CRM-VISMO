import { getDeals } from '@/app/actions/deals';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getDeals();
    return NextResponse.json(data);
}
