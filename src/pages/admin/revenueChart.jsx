import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- Chart Data Processing ---
const getMonthlyRevenueData = (appointments) => {
    const now = dayjs();
    const dataMap = {};

    for (let i = 5; i >= 0; i--) {
        const month = now.subtract(i, 'month');
        const key = month.format('YYYY-MM');
        dataMap[key] = { name: month.format('MMM'), revenue: 0 };
    }

    appointments.forEach(a => {
        const apptDate = dayjs(a.date);
        const key = apptDate.format('YYYY-MM');

        if (dataMap[key]) {
            dataMap[key].revenue += a.price || 0;
        }
    });

    return Object.values(dataMap);
};
// --- End Chart Data Processing ---

const RevenueChart = ({ appointments }) => {
    const chartData = useMemo(() => getMonthlyRevenueData(appointments), [appointments]);

    const primaryBlue = '#1D4ED8';
    const softBlue = '#93C5FD';

    return (
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-transform duration-300 hover:shadow-xl">
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200 mb-5 tracking-tight">
                6-Month Revenue Trend
            </h3>

            <div className="h-64 sm:h-100">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 15, right: 10, left: 0, bottom: 0 }}
                    >
                        {/* Gradient Fill */}
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryBlue} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={softBlue} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                            vertical={false}
                            opacity={0.6}
                        />

                        {/* X Axis */}
                        <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                        />

                        {/* Y Axis */}
                        <YAxis
                            stroke="#6B7280"
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            cursor={{ fill: '#F3F4F6', opacity: 0.5 }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                padding: '10px',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                            }}
                            labelStyle={{ color: '#374151', fontWeight: 600 }}
                            formatter={(value) => [
                                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                                'Revenue'
                            ]}
                        />

                        {/* Revenue Area */}
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={primaryBlue}
                            fill="url(#colorRevenue)"
                            strokeWidth={3}
                            dot={{ stroke: primaryBlue, strokeWidth: 2, r: 4, fill: '#ffffff' }}
                            activeDot={{ r: 6, fill: primaryBlue, stroke: '#ffffff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
