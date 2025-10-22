import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ActiveUsersChart() {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("daily");

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, { headers });

                const users = res.data.filter((u) => u.role === "user");
                const userCountByPeriod = {};

                users.forEach((u) => {
                    const dateField = u.createdAt || u.rawDate || u.registeredAt;
                    if (!dateField) return;

                    let key;
                    if (view === "daily") key = dayjs(dateField).format("YYYY-MM-DD");
                    else if (view === "weekly") key = dayjs(dateField).format("YYYY-[W]WW");
                    else if (view === "monthly") key = dayjs(dateField).format("YYYY-MM");

                    userCountByPeriod[key] = (userCountByPeriod[key] || 0) + 1;
                });

                const labels = Object.keys(userCountByPeriod).sort((a, b) => new Date(a) - new Date(b));
                const dataPoints = labels.map((label) => userCountByPeriod[label]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `Active Users`,
                            data: dataPoints,
                            fill: true,
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            borderColor: "rgba(59, 130, 246, 1)",
                            tension: 0.3,
                        }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActiveUsers();
    }, [view]);

    return (
        <div className="bg-white p-4  border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Active Users ({view})
            </h3>

            <div className="flex gap-2 mb-4 justify-center">
                {["daily", "weekly", "monthly"].map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-3 py-1  ${view === v
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <span className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : (
                <div className="h-48">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { color: "#e5e7eb" }, ticks: { color: "#4b5563" } },
                                y: { grid: { color: "#e5e7eb" }, ticks: { color: "#4b5563" }, beginAtZero: true }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
