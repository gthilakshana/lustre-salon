import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaUserShield,
    FaEnvelope,
    FaCalendarAlt,
    FaSyncAlt,
    FaDollarSign,
    FaCalendarWeek,
    FaCalendar,
    FaChevronRight,
    FaBell,
} from "react-icons/fa";
import axios from "axios";
import RevenueChart from "../admin/revenueChart";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import ActiveUsersChart from "../admin/activeUsersChart";
import RevenueCard from "../admin/revenueCard";

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

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminView() {
    const navigate = useNavigate();
    const defaultImage =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const [currentAdmin, setCurrentAdmin] = useState({
        fullName: "",
        role: "admin",
        image: defaultImage,
    });

    const themeClasses = {
        white: { bg: "bg-white", text: "text-gray-800", icon: "text-gray-600", title: "text-gray-900", border: "border-gray-300" },
        blue: { bg: "bg-blue-200", text: "text-blue-900", icon: "text-blue-700", title: "text-blue-900", border: "border-blue-300" },
        red: { bg: "bg-red-200", text: "text-red-900", icon: "text-red-700", title: "text-red-900", border: "border-red-300" },
        gray: { bg: "bg-gray-200", text: "text-gray-900", icon: "text-gray-600", title: "text-gray-900", border: "border-gray-300" },
        green: { bg: "bg-green-200", text: "text-green-900", icon: "text-green-700", title: "text-green-900", border: "border-green-300" },
    };

    const [stats, setStats] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("daily");
    // State to manage the unread booking count
    const [todayBookingCount, setTodayBookingCount] = useState(0);

    const prevBookingCount = useRef(todayBookingCount);

    // Auth / admin load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        try {
            const decoded = jwt_decode(token);
            setCurrentAdmin({
                fullName: decoded.fullName || "Admin",
                role: decoded.role || "admin",
                image: decoded.image || defaultImage,
                email: decoded.email || "admin@gmail.com",
            });
        } catch (err) {
            console.error("Invalid token:", err);
            navigate("/login");
        }
    }, [navigate]);

    // Revenue calculation
    const calculateRevenueFromList = (appointmentsList = []) => {
        const now = dayjs();
        const todayStart = now.startOf("day");
        const weekStart = now.subtract(6, "day").startOf("day");
        const monthStart = now.subtract(29, "day").startOf("day");

        let daily = 0, weekly = 0, monthly = 0, total = 0;

        appointmentsList.forEach(a => {
            const price = Number(a.price) || 0;
            total += price;

            if (!a.date) return;
            const apptDate = dayjs(a.date).startOf("day");

            if (apptDate.isSame(todayStart)) daily += price;
            if (apptDate.isBetween(weekStart, now.endOf("day"), null, "[]")) weekly += price;
            if (apptDate.isBetween(monthStart, now.endOf("day"), null, "[]")) monthly += price;
        });

        return {
            daily: Number(daily.toFixed(2)),
            weekly: Number(weekly.toFixed(2)),
            monthly: Number(monthly.toFixed(2)),
            total: Number(total.toFixed(2)),
        };
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const headers = { Authorization: `Bearer ${token}` };
            const [usersRes, messagesRes, appointmentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/users`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/appointments`, { headers }),
            ]);

            const usersData = usersRes.data || [];
            setUsers(
                usersData.map(u => ({ date: u.lastActive || u.createdAt, activeCount: u.isActive ? 1 : 0 }))
            );

            const customers = usersData.filter(u => u.role === "user").length;
            const admins = usersData.filter(u => u.role === "admin").length;
            const messages = (messagesRes.data && messagesRes.data.length) || 0;

            const appointmentsData = appointmentsRes.data || [];
            const appointmentsWithPrice = appointmentsData.map(a => ({
                ...a,
                price: (Number(a.fullPayment) || 0) + (Number(a.duePayment) || 0),
            }));

            setAppointments(appointmentsWithPrice);

            setStats([
                { icon: FaUsers, title: "Customers", value: customers, color: "blue", description: "Registered users" },
                { icon: FaUserShield, title: "Admins", value: admins, color: "gray", description: "Admin users" },
                { icon: FaEnvelope, title: "Messages", value: messages, color: "red", description: "Customer Messages" },
                { icon: FaCalendarAlt, title: "Total Appointments", value: appointmentsData.length, color: "white", description: "All-time bookings" },
            ]);

            const todayStart = dayjs().startOf("day");

            const todayCount = appointmentsWithPrice.filter(a => a.date && dayjs(a.date).isSame(todayStart, "day")).length;

            setTodayBookingCount(todayCount);

        } catch (err) {
            console.error("fetchStats error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchStats();


    }, []);


    const handleNotificationClick = () => {

        setTodayBookingCount(0);


        navigate("/admin/orders");
    };
    // ----------------------------------------

    const quickLinks = [
        { title: "Customers", icon: FaUsers, path: "/admin/customers", color: "white", subtitle: "Manage all user accounts" },
        { title: "Admins", icon: FaUserShield, path: "/admin/admins", color: "white", subtitle: "Manage administrator access" },
        { title: "Messages", icon: FaEnvelope, path: "/admin/messages", color: "white", subtitle: "View contact inquiries" },
        { title: "Appointments", icon: FaCalendarAlt, path: "/admin/orders", color: "white", subtitle: "View and edit bookings" },
    ];

    const revenue = React.useMemo(() => calculateRevenueFromList(appointments), [appointments]);


    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-center sm:text-left w-full sm:w-auto text-2xl sm:text-3xl font-light tracking-wide text-gray-900">
                    <span className="font-arial font-bold text-xl md:text-2xl uppercase">
                        Lustre Salon Dashboard
                    </span>
                </h1>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-900 cursor-pointer transition-all duration-300
                    ${loading ? "bg-gray-200 cursor-not-allowed opacity-70" : "bg-gray-100 hover:bg-gray-200 active:scale-95"}`}
                >
                    <FaSyncAlt className={`${loading ? "animate-spin" : ""} text-gray-700 text-sm`} />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {/* Admin Info + Notifications */}
            <section className="flex items-center justify-between mb-8 p-4 border border-blue-200 rounded-xl shadow-sm bg-white">
                <div className="flex items-center gap-4">
                    <img
                        src={currentAdmin.image}
                        alt={currentAdmin.fullName}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-blue-300 shadow-sm"
                    />
                    <div className="flex flex-col">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight uppercase">
                            {currentAdmin.fullName}
                        </h2>
                        <p className="text-gray-500 text-xs">
                            {currentAdmin.role === "admin" ? "System Administrator" : currentAdmin.role}
                        </p>
                        <p className="text-blue-600 text-xs font-medium mt-1 flex items-center gap-1">
                            <i className="fa-regular fa-envelope text-[10px]"></i>
                            {currentAdmin.email || "admin@gmail.com"}
                        </p>
                    </div>
                </div>

                {/* Bell Icon (FIXED onClick handler) */}
                <div
                    className="relative cursor-pointer hover:scale-110 transition"
                    onClick={handleNotificationClick}
                >
                    <FaBell className="text-blue-600 text-[20px]" />
                    {todayBookingCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-[1px] rounded-full">
                            {todayBookingCount}
                        </span>
                    )}
                </div>
            </section>

            <h2 className="text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const classes = themeClasses[stat.color] || themeClasses["white"];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-5 rounded-xl shadow-md border ${classes.border} hover:shadow-lg transition-transform hover:-translate-y-1`}
                        >
                            <div className="flex items-center gap-3 mb-2 ">
                                <div className="p-2 bg-white/60 rounded-lg">
                                    <Icon className="text-lg" />
                                </div>
                                <span className={`${classes.text} text-2xl font-bold`}>
                                    {stat.value.toLocaleString()}
                                </span>
                            </div>
                            <h3 className={`${classes.title} font-semibold text-sm uppercase`}>{stat.title}</h3>
                            <p className={`${classes.text} opacity-70 text-xs mt-1`}>{stat.description}</p>
                        </div>
                    );
                })}
            </div>

            <h2 className="text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Revenue Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <RevenueCard label="Day Revenue" value={revenue.daily} icon={FaCalendarAlt} bgColor="bg-green-200" />
                <RevenueCard label="Weekly Revenue" value={revenue.weekly} icon={FaCalendarWeek} bgColor="bg-blue-200" />
                <RevenueCard label="Monthly Revenue" value={revenue.monthly} icon={FaCalendar} bgColor="bg-purple-200" />
                <RevenueCard label="Total Revenue" value={revenue.total} icon={FaDollarSign} bgColor="bg-gray-200" />
            </div>

            <h2 className="text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart appointments={appointments} />
                <ActiveUsersChart activeView={activeView} setActiveView={setActiveView} />
            </div>

            <h2 className="text-xl font-arial uppercase text-gray-800 mt-10 mb-6 border-b pb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const classes = themeClasses[link.color] || themeClasses["white"];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-between cursor-pointer`}
                            onClick={() => navigate(link.path)}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`${classes.icon} text-2xl`} />
                                <div>
                                    <span className={`${classes.title} font-semibold text-sm sm:text-base`}>{link.title}</span>
                                    <p className={`${classes.text} opacity-70 text-xs mt-1`}>{link.subtitle}</p>
                                </div>
                            </div>
                            <FaChevronRight className={`${classes.text} opacity-70`} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}