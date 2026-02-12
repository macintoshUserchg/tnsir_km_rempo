'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTrendProps {
    data: { month: string; count: number }[];
    locale: string;
}

export default function MonthlyTrendChart({ data, locale }: MonthlyTrendProps) {
    const isHindi = locale === 'hi';

    return (
        <div className="h-64 sm:h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                        }}
                        formatter={(value) => [value, isHindi ? 'आवेदन' : 'Applications']}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
