"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
    data: any[];
    xKey: string;
    bars: Array<{
        key: string;
        color?: string;
        name?: string;
    }>;
    height?: number;
    layout?: "horizontal" | "vertical";
}

export function BarChart({ data, xKey, bars, height = 300, layout = "horizontal" }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={data} layout={layout} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                {layout === "horizontal" ? (
                    <>
                        <XAxis
                            dataKey={xKey}
                            stroke="#606060"
                            style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                        />
                        <YAxis
                            stroke="#606060"
                            style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                        />
                    </>
                ) : (
                    <>
                        <XAxis
                            type="number"
                            stroke="#606060"
                            style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                        />
                        <YAxis
                            type="category"
                            dataKey={xKey}
                            stroke="#606060"
                            style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter-mono)' }}
                        />
                    </>
                )}
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
                {bars.map((bar, index) => (
                    <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        fill={bar.color || '#FE3C00'}
                        name={bar.name || bar.key}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
