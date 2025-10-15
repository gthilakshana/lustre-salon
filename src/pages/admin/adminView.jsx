import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaUserShield,
    FaEnvelope,
    FaCalendarAlt,
    FaSyncAlt,
    FaDollarSign,
    FaCalendarWeek,
    FaCalendar
} from "react-icons/fa";
import axios from "axios";
import { ShowToast } from "../../components/lustreToaster";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

export default function AdminView() {
    const navigate = useNavigate();

    const defaultImage =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const [currentAdmin, setCurrentAdmin] = useState({
        fullName: "",
        role: "admin",
        image: defaultImage,
    });

    const [stats, setStats] = useState([
        { icon: FaUsers, title: "Customers", value: 0, color: "blue", description: "Registered users" },
        { icon: FaUserShield, title: "Admins", value: 0, color: "gray", description: "Admin users" },
        { icon: FaEnvelope, title: "Messages", value: 0, color: "red", description: "Unread messages" },
        { icon: FaCalendarAlt, title: "Appointments", value: 0, color: "blue", description: "Total bookings" },
    ]);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const colorClasses = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100", text: "text-blue-800", icon: "text-blue-600", title: "text-blue-900" },
        red: { bg: "bg-gradient-to-br from-red-50 to-red-100", text: "text-red-800", icon: "text-red-600", title: "text-red-900" },
        gray: { bg: "bg-gradient-to-br from-gray-100 to-gray-200", text: "text-gray-800", icon: "text-gray-600", title: "text-gray-900" },
        green: { bg: "bg-gradient-to-br from-green-50 to-green-100", text: "text-green-800", icon: "text-green-600", title: "text-green-900" },
        yellow: { bg: "bg-gradient-to-br from-yellow-50 to-yellow-100", text: "text-yellow-800", icon: "text-yellow-600", title: "text-yellow-900" },
        purple: { bg: "bg-gradient-to-br from-purple-50 to-purple-100", text: "text-purple-800", icon: "text-purple-600", title: "text-purple-900" },
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            const decoded = jwt_decode(token);
            setCurrentAdmin({
                fullName: decoded.fullName || "Admin",
                role: decoded.role || "admin",
                image: decoded.image || defaultImage,
            });
        } catch (err) {
            console.error("Invalid token:", err);
            ShowToast("error", "Invalid session", "Please login again.");
            navigate("/login");
        }
    }, [navigate]);

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

            const users = usersRes.data || [];
            const customers = users.filter(u => u.role === "user").length;
            const admins = users.filter(u => u.role === "admin").length;
            const messages = messagesRes.data?.length || 0;
            const appointmentsData = appointmentsRes.data || [];

            setAppointments(appointmentsData.map(a => ({
                ...a,
                price: (a.fullPayment || 0) + (a.duePayment || 0),
            })));

            setStats([
                { icon: FaUsers, title: "Customers", value: customers, color: "blue", description: "Registered users" },
                { icon: FaUserShield, title: "Admins", value: admins, color: "gray", description: "Admin users" },
                { icon: FaEnvelope, title: "Messages", value: messages, color: "red", description: "Unread messages" },
                { icon: FaCalendarAlt, title: "Appointments", value: appointmentsData.length, color: "blue", description: "Total bookings" },
            ]);
        } catch (err) {
            console.error(err);
            ShowToast("error", "Failed to load stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const quickLinks = [
        { title: "Manage Customers", icon: FaUsers, path: "/admin/customers", color: "blue" },
        { title: "Manage Admins", icon: FaUserShield, path: "/admin/admins", color: "gray" },
        { title: "View Messages", icon: FaEnvelope, path: "/admin/messages", color: "red" },
        { title: "Manage Appointments", icon: FaCalendarAlt, path: "/admin/orders", color: "blue" },
    ];

    const calculateRevenue = () => {
        const now = dayjs();
        let total = 0, weekly = 0, monthly = 0;
        appointments.forEach(a => {
            const price = a.price || 0;
            total += price;
            const apptDate = dayjs(a.date);
            if (now.diff(apptDate, "week") < 1) weekly += price;
            if (now.diff(apptDate, "month") < 1) monthly += price;
        });
        return { total, weekly, monthly };
    };

    const revenue = calculateRevenue();

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 uppercase">Admin Dashboard</h1>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
                    disabled={loading}
                >
                    <FaSyncAlt className={`${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-4 mb-8 p-5 bg-white shadow-lg rounded-xl hover:shadow-2xl transition duration-300">
                <img
                    src={currentAdmin.image}
                    alt={currentAdmin.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 uppercase">{currentAdmin.fullName}</h2>
                    <p className="text-gray-600 text-sm">{currentAdmin.role === "admin" ? "Administrator" : currentAdmin.role}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const classes = colorClasses[stat.color];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 flex flex-col items-start`}
                        >
                            <Icon className={`${classes.icon} text-4xl mb-3`} />
                            <h3 className={`${classes.title} font-semibold text-lg`}>{stat.title}</h3>
                            <p className={`${classes.text} mt-1 text-sm`}>{stat.description}</p>
                            <p className={`${classes.text} mt-2 text-2xl font-bold`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Revenue Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className={`${colorClasses.green.bg} p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1`}>
                        <div className="flex items-center gap-3">
                            <FaDollarSign className="text-green-600 text-3xl" />
                            <h3 className="text-green-900 font-semibold text-lg">Total Revenue</h3>
                        </div>
                        <p className="text-green-800 mt-2 text-xl font-bold">${revenue.total.toLocaleString()}</p>
                    </div>
                    <div className={`${colorClasses.yellow.bg} p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1`}>
                        <div className="flex items-center gap-3">
                            <FaCalendarWeek className="text-yellow-600 text-3xl" />
                            <h3 className="text-yellow-900 font-semibold text-lg">Weekly Revenue</h3>
                        </div>
                        <p className="text-yellow-800 mt-2 text-xl font-bold">${revenue.weekly.toLocaleString()}</p>
                    </div>
                    <div className={`${colorClasses.purple.bg} p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1`}>
                        <div className="flex items-center gap-3">
                            <FaCalendar className="text-purple-600 text-3xl" />
                            <h3 className="text-purple-900 font-semibold text-lg">Monthly Revenue</h3>
                        </div>
                        <p className="text-purple-800 mt-2 text-xl font-bold">${revenue.monthly.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const classes = colorClasses[link.color];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex items-center gap-4 cursor-pointer`}
                            onClick={() => navigate(link.path)}
                        >
                            <Icon className={`${classes.icon} text-3xl`} />
                            <span className={`${classes.title} font-semibold text-lg`}>{link.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
