"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
    data: any[];
    xKey: string;
    lines: Array<{
        key: string;
        color?: string;
        name?: string;
    }>;
    height?: number;
}

export function LineChart({ data, xKey, lines, height = 300 }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis
                    dataKey={xKey}
                    stroke="#606060"
                    style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                />
                <YAxis
                    stroke="#606060"
                    style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#F5F3EC'
                    }}
                />
                <Legend
                    wrapperStyle={{
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-inter-mono)',
                        color: '#F5F3EC'
                    }}
                />
                {lines.map((line, index) => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color || '#FE3C00'}
                        strokeWidth={2}
                        name={line.name || line.key}
                        dot={{ fill: line.color || '#FE3C00', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
}
