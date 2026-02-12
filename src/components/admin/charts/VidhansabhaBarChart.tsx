'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VidhansabhaChartProps {
    data: { name: string; count: number }[];
    locale: string;
}

export default function VidhansabhaBarChart({ data, locale }: VidhansabhaChartProps) {
    const isHindi = locale === 'hi';

    return (
        <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                        }}
                        formatter={(value) => [value, isHindi ? 'आवेदन' : 'Applications']}
                    />
                    <Bar
                        dataKey="count"
                        fill="#f97316"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
