import { getContracts, getCashFlow } from '@/app/actions/finance';
import { NextResponse } from 'next/server';

export async function GET() {
    const [contracts, cashFlow] = await Promise.all([
        getContracts(),
        getCashFlow()
    ]);

    return NextResponse.json({
        contracts,
        cashFlow
    });
}
