import { useState, useEffect, useMemo } from "react";
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
} from "react-icons/fa";
import axios from "axios";
import { ShowToast } from "../../components/lustreToaster";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import RevenueChart from "../admin/revenueChart";



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
        'white': { bg: "bg-white", text: "text-gray-800", icon: "text-gray-700", title: "text-gray-900", border: "border-gray-300" },

        'blue': { bg: "bg-blue-600", text: "text-white", icon: "text-blue-100", title: "text-white", border: "border-blue-700" },

        'red': { bg: "bg-red-600", text: "text-white", icon: "text-red-100", title: "text-white", border: "border-red-700" },

        'gray': { bg: "bg-gray-700", text: "text-white", icon: "text-gray-200", title: "text-white", border: "border-gray-800" },

        'green': { bg: "bg-green-600", text: "text-white", icon: "text-green-100", title: "text-white", border: "border-green-700" },

        'revenue-bg': { bg: "bg-gradient-to-br from-blue-700 to-indigo-800", text: "text-white", icon: "text-blue-200", border: "border-blue-900" },
    };

    // ----------------------------


    const [stats, setStats] = useState([
        { icon: FaUsers, title: "Customers", value: 0, color: "blue", description: "Registered users" },
        { icon: FaUserShield, title: "Admins", value: 0, color: "gray", description: "Admin users" },
        { icon: FaEnvelope, title: "Unread Messages", value: 0, color: "red", description: "Pending replies" },
        { icon: FaCalendarAlt, title: "Total Appointments", value: 0, color: "white", description: "All-time bookings" },
    ]);
    // -------------------------------------

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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

            const messages = messagesRes.data.length || 0;

            const appointmentsData = appointmentsRes.data || [];

            setAppointments(appointmentsData.map(a => ({
                ...a,
                price: (a.fullPayment || 0) + (a.duePayment || 0),
            })));


            setStats([
                { icon: FaUsers, title: "Customers", value: customers, color: "blue", description: "Registered users" },
                { icon: FaUserShield, title: "Admins", value: admins, color: "gray", description: "Admin users" },
                { icon: FaEnvelope, title: "Messages", value: messages, color: "red", description: "Customer Messages" },
                { icon: FaCalendarAlt, title: "Total Appointments", value: appointmentsData.length, color: "white", description: "All-time bookings" },
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
        { title: "Customers", icon: FaUsers, path: "/admin/customers", color: "white", subtitle: "Manage all user accounts" },
        { title: "Admins", icon: FaUserShield, path: "/admin/admins", color: "white", subtitle: "Manage administrator access" },
        { title: "Messages", icon: FaEnvelope, path: "/admin/messages", color: "white", subtitle: "View contact inquiries" },
        { title: "Appointments", icon: FaCalendarAlt, path: "/admin/orders", color: "white", subtitle: "View and edit bookings" },
    ];
    // -------------------------------------------

    const calculateRevenue = () => {
        const now = dayjs();
        let total = 0, weekly = 0, monthly = 0;
        appointments.forEach(a => {
            const price = a.price || 0;
            total += price;
            const apptDate = dayjs(a.date);
            if (apptDate.isAfter(now.subtract(7, 'day'))) weekly += price;
            if (apptDate.isAfter(now.subtract(30, 'day'))) monthly += price;
        });
        return { total, weekly, monthly };
    };

    const revenue = useMemo(() => calculateRevenue(), [appointments]);

    const revenueClasses = themeClasses['revenue-bg'];

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">

            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8 pb-4 border-b border-gray-200">


                <h1 className="text-center sm:text-left w-full sm:w-auto text-2xl sm:text-3xl font-light tracking-wide text-gray-900">
                    <span className="font-arial font-bold text-xl md:text-2xl uppercase">Lustre Salon Dashboard</span>
                </h1>


                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className={`flex items-center justify-center gap-1
        w-auto px-3 py-1.5 text-xs font-medium rounded-full shadow
        transition-all duration-300
        ${loading
                            ? "bg-gray-800 cursor-not-allowed opacity-80"
                            : "bg-black hover:bg-gray-900 active:scale-95"} text-white`}
                >
                    <FaSyncAlt className={`${loading ? "animate-spin" : ""} text-white text-sm`} />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>

            </header>


            {/* Admin Profile */}
            <section
                className="flex items-center mb-8 p-4  border border-gray-100 rounded-xl shadow-md bg-cover bg-center bg-no-repeat relative overflow-hidden"
                style={{
                    backgroundImage: "url('/Team.jpg')",
                }}
            >

                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative flex items-center gap-4 z-10">
                    <img
                        src={currentAdmin.image}
                        alt={currentAdmin.fullName}
                        className="w-10 h-10 sm:w-15 sm:h-15 rounded-full object-cover border-4 border-white"
                    />
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight uppercase">
                            {currentAdmin.fullName}
                        </h2>
                        <p className="text-white text-xs ">
                            {currentAdmin.role === "admin"
                                ? "System Administrator"
                                : currentAdmin.role}
                        </p>
                    </div>
                </div>
            </section>


            <h2 className="text-xl sm:text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Key Metrics</h2>


            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const classes = themeClasses[stat.color] || themeClasses['white'];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${classes.icon} bg-opacity-20`}>
                                        <Icon className="text-2xl sm:text-3xl" />
                                    </div>
                                    <span className={`${classes.text} text-xl md:text-3xl font-bold tracking-tight`}>
                                        {stat.value.toLocaleString()}
                                    </span>
                                </div>
                                {stat.badge && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        {stat.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className={`${classes.title} font-medium text-md md:text-xl`}>{stat.title}</h3>
                            <p className={`${classes.text} text-xs md:text-md text-gray-500 mt-1`}>{stat.description}</p>
                        </div>
                    );
                })}
            </div>


            <hr className="my-6 sm:my-8 border-gray-200" />

            {/* Revenue Section*/}
            <h2 className="text-xl sm:text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Revenue Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">


                <div className="lg:col-span-2 order-1">
                    <RevenueChart appointments={appointments} />
                </div>


                <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6 order-2">
                    {/* Total Revenue */}
                    <div className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-600/20 rounded-full">
                                <FaDollarSign className="text-green-400 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide text-gray-200">
                                Total Revenue
                            </h3>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                            ${revenue.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Weekly Revenue */}
                    <div className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-600/20 rounded-full">
                                <FaCalendarWeek className="text-blue-400 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide text-gray-200">
                                Weekly Revenue
                            </h3>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                            ${revenue.weekly.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-800 text-white hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-600/20 rounded-full">
                                <FaCalendar className="text-purple-400 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide text-gray-200">
                                Monthly Revenue
                            </h3>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                            ${revenue.monthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

            </div>

            <hr className="my-6 sm:my-8 border-gray-200" />

            {/* Quick Links */}
            <h2 className="text-xl sm:text-xl font-arial uppercase text-gray-800 mb-6 border-b pb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {quickLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const classes = themeClasses[link.color] || themeClasses['white'];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-4 sm:p-5 rounded-xl border ${classes.border} shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex items-center justify-between cursor-pointer`}
                            onClick={() => navigate(link.path)}
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Icon className={`${classes.icon} text-xl sm:text-2xl`} />
                                <div>
                                    <span className={`${classes.title} font-semibold text-sm sm:text-base`}>{link.title}</span>
                                    <p className={`${classes.text} opacity-75 text-xs mt-0.5`}>{link.subtitle}</p>
                                </div>
                            </div>
                            <FaChevronRight className={`${classes.text} opacity-75 text-sm`} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}