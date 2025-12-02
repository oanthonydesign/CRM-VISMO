import { getCashFlow } from '@/app/actions/finance';
import { NextResponse } from 'next/server';

export async function GET() {
    const cashFlow = await getCashFlow();

    return NextResponse.json({
        cashFlow
    });
}
