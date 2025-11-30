import { getEmpresas } from '@/app/actions/empresas';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getEmpresas();
    return NextResponse.json(data);
}
