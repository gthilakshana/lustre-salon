import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

// --- CHART DATA PROCESSING (Unchanged) ---
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
// --- END CHART DATA PROCESSING ---


const RevenueChart = ({ appointments }) => {
    const chartData = useMemo(() => getMonthlyRevenueData(appointments), [appointments]);


    const primaryBlue = '#1D4ED8';
    const softBlue = '#93C5FD';

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
            <h3 className="text-lg sm:text-xl font-light text-gray-700 mb-4 tracking-tight">6-Month Revenue Trend</h3>
            <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >

                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryBlue} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={softBlue} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>


                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#e0e0e0"
                            vertical={false}
                            opacity={0.7}
                        />


                        <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: '12px' }}
                        />


                        <YAxis
                            stroke="#6B7280"
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                            style={{ fontSize: '12px' }}
                        />


                        <Tooltip
                            cursor={{ fill: '#E5E7EB', opacity: 0.5 }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                padding: '10px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#4B5563', fontWeight: 'bold' }}
                            formatter={(value, name) => [
                                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                                'Revenue'
                            ]}
                        />


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