import { getProjects } from '@/app/actions/projects';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getProjects();
    return NextResponse.json(data);
}
