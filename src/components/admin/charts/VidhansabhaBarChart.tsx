'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VidhansabhaChartProps {
    data: { name: string; count: number }[];
    locale: string;
}

export default function VidhansabhaBarChart({ data, locale }: VidhansabhaChartProps) {
    const isHindi = locale === 'hi';

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value) => [value, isHindi ? 'आवेदन' : 'Applications']}
                    />
                    <Bar
                        dataKey="count"
                        fill="#f97316"
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
