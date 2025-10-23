import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const primaryBlue = "#1D4ED8";
const softBlue = "#93C5FD";

const safeDate = (a) => {
    const d = a?.date ?? a?.rawDate ?? a?.createdAt ?? a?.created_at;
    return dayjs(d);
};

const safePrice = (a) => {
    const v = a?.price ?? a?.amount ?? a?.total ?? 0;
    const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const getDailyRevenueData = (appointments, days = 7) => {
    const now = dayjs().startOf("day");
    const dataMap = {};

    for (let i = days - 1; i >= 0; i--) {
        const d = now.subtract(i, "day");
        const key = d.format("YYYY-MM-DD");
        dataMap[key] = { name: d.format("DD MMM"), revenue: 0 };
    }

    appointments.forEach((a) => {
        const appt = safeDate(a);
        if (!appt.isValid()) return;
        const key = appt.format("YYYY-MM-DD");
        if (dataMap[key]) dataMap[key].revenue += safePrice(a);
    });

    return Object.values(dataMap);
};

const getWeeklyRevenueData = (appointments, weeks = 8) => {
    const now = dayjs().startOf("isoWeek");
    const dataMap = {};

    for (let i = weeks - 1; i >= 0; i--) {
        const wkStart = now.subtract(i, "week");
        const wkEnd = wkStart.endOf("isoWeek");
        const key = wkStart.format("YYYY-[W]WW");

        dataMap[key] = {
            weekStart: wkStart,
            weekEnd: wkEnd,
            name: `${wkStart.format("DD MMM")} - ${wkEnd.format("DD MMM")}`,
            revenue: 0, // ensure zero revenue weeks exist
        };
    }

    appointments.forEach((a) => {
        const appt = safeDate(a);
        if (!appt.isValid()) return;
        const wkStart = appt.startOf("isoWeek");
        const key = wkStart.format("YYYY-[W]WW");
        if (dataMap[key]) dataMap[key].revenue += safePrice(a);
    });

    return Object.values(dataMap)
        .sort((a, b) => a.weekStart.valueOf() - b.weekStart.valueOf())
        .map(x => ({ name: x.name, revenue: x.revenue }));
};


const getMonthlyRevenueData = (appointments, months = 6) => {
    const now = dayjs().startOf("month");
    const dataMap = {};

    for (let i = months - 1; i >= 0; i--) {
        const m = now.subtract(i, "month");
        const key = m.format("YYYY-MM");
        dataMap[key] = { name: m.format("MMM"), revenue: 0 };
    }

    appointments.forEach((a) => {
        const appt = safeDate(a);
        if (!appt.isValid()) return;
        const key = appt.format("YYYY-MM");
        if (dataMap[key]) dataMap[key].revenue += safePrice(a);
    });

    return Object.values(dataMap);
};

const currencyFormatter = (value) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const RevenueChart = ({ appointments = [] }) => {
    const [view, setView] = useState("daily");

    const dailyData = useMemo(() => getDailyRevenueData(appointments, 7), [appointments]);
    const weeklyData = useMemo(() => getWeeklyRevenueData(appointments, 8), [appointments]);
    const monthlyData = useMemo(() => getMonthlyRevenueData(appointments, 6), [appointments]);

    const chartData = view === "daily" ? dailyData : view === "weekly" ? weeklyData : monthlyData;

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Revenue ({view})
            </h3>

            <div className="flex gap-2 mb-4 justify-center">
                {["daily", "weekly", "monthly"].map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-3 py-1 rounded-full font-medium ${view === v
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryBlue} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={softBlue} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value) => [currencyFormatter(value), "Revenue"]} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={primaryBlue}
                            fill="url(#colorRevenue)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={false}
                            connectNulls={true}  // ensures line connects even over zero values
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
