import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
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

/** ----- Helpers ----- **/
const safeDate = (a) => {
    const d = a?.date ?? a?.rawDate ?? a?.raw_date ?? a?.createdAt ?? a?.created_at;
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
        if (dataMap[key]) {
            dataMap[key].revenue += safePrice(a);
        }
    });

    return Object.values(dataMap);
};


const getWeeklyRevenueData = (appointments, weeks = 8) => {
    const now = dayjs().startOf("week");
    const dataMap = {};

    for (let i = weeks - 1; i >= 0; i--) {
        const wk = now.subtract(i, "week");
        const key = wk.format("YYYY-[W]WW");
        dataMap[key] = { name: wk.format("DD MMM"), revenue: 0, weekStart: wk };
    }

    appointments.forEach((a) => {
        const appt = safeDate(a);
        if (!appt.isValid()) return;
        const wkStart = appt.startOf("week");
        const key = wkStart.format("YYYY-[W]WW");
        if (dataMap[key]) {
            dataMap[key].revenue += safePrice(a);
        }
    });


    return Object.values(dataMap)
        .sort((a, b) => a.weekStart.valueOf() - b.weekStart.valueOf())
        .map((x) => ({ name: x.name, revenue: x.revenue }));
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
        if (dataMap[key]) {
            dataMap[key].revenue += safePrice(a);
        }
    });

    return Object.values(dataMap);
};

/** ----- Tooltip formatter ----- **/
const currencyFormatter = (value) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** ----- Main Component ----- **/
const RevenueChart = ({ appointments = [] }) => {
    const [view, setView] = useState("daily");

    const dailyData = useMemo(() => getDailyRevenueData(appointments, 7), [appointments]);
    const weeklyData = useMemo(() => getWeeklyRevenueData(appointments, 8), [appointments]);
    const monthlyData = useMemo(() => getMonthlyRevenueData(appointments, 6), [appointments]);

    const chartData = view === "daily" ? dailyData : view === "weekly" ? weeklyData : monthlyData;

    return (
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-transform duration-300 hover:shadow-xl">
            <div className="flex items-start justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200 tracking-tight">
                    Revenue
                    <span className="text-sm font-normal text-gray-500 ml-2">({view === "daily" ? "Last 7 days" : view === "weekly" ? "Last 8 weeks" : "Last 6 months"})</span>
                </h3>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView("daily")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === "daily"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setView("weekly")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === "weekly"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setView("monthly")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === "monthly"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="h-64 sm:h-100">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }}>

                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryBlue} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={softBlue} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>


                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.6} />


                        <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "12px", fontWeight: 500 }}
                        />


                        <YAxis
                            stroke="#6B7280"
                            tickFormatter={(value) => {

                                if (Math.abs(value) >= 1_000_000) {
                                    return `$${(value / 1_000_000).toFixed(1)}M`;
                                } else if (Math.abs(value) >= 1000) {
                                    return `$${(value / 1000).toFixed(0)}k`;
                                }
                                return `$${value}`;
                            }}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                        />


                        <Tooltip
                            cursor={{ fill: "#F3F4F6", opacity: 0.5 }}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #D1D5DB",
                                borderRadius: "8px",
                                padding: "10px",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                            }}
                            labelStyle={{ color: "#374151", fontWeight: 600 }}
                            formatter={(value) => [currencyFormatter(value), "Revenue"]}
                        />


                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={primaryBlue}
                            fill="url(#colorRevenue)"
                            strokeWidth={3}
                            dot={{ stroke: primaryBlue, strokeWidth: 2, r: 4, fill: "#ffffff" }}
                            activeDot={{ r: 6, fill: primaryBlue, stroke: "#ffffff" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
