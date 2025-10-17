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
        'white': { bg: "bg-white", text: "text-gray-800", icon: "text-gray-600", title: "text-gray-900", border: "border-gray-200" },


        'light-blue': { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500", title: "text-blue-800", border: "border-blue-200" },


        'light-red': { bg: "bg-red-50", text: "text-red-700", icon: "text-red-500", title: "text-red-800", border: "border-red-200" },


        'light-gray': { bg: "bg-gray-100", text: "text-gray-700", icon: "text-gray-500", title: "text-gray-800", border: "border-gray-300" },


        'revenue-bg': { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-500", border: "border-blue-300" },
    };
    // ----------------------------


    const [stats, setStats] = useState([
        { icon: FaUsers, title: "Customers", value: 0, color: "light-blue", description: "Registered users" },
        { icon: FaUserShield, title: "Admins", value: 0, color: "light-gray", description: "Admin users" },
        { icon: FaEnvelope, title: "Unread Messages", value: 0, color: "light-red", description: "Pending replies" },
        { icon: FaCalendarAlt, title: "Total Appointments", value: 0, color: "light-blue", description: "All-time bookings" },
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
            const messages = messagesRes.data.filter(m => m.status === 'unread').length || 0;
            const appointmentsData = appointmentsRes.data || [];

            setAppointments(appointmentsData.map(a => ({
                ...a,
                price: (a.fullPayment || 0) + (a.duePayment || 0),
            })));


            setStats([
                { icon: FaUsers, title: "Customers", value: customers, color: "light-blue", description: "Registered users" },
                { icon: FaUserShield, title: "Admins", value: admins, color: "light-gray", description: "Admin users" },
                { icon: FaEnvelope, title: "Unread Messages", value: messages, color: "light-red", description: "Pending replies" },
                { icon: FaCalendarAlt, title: "Total Appointments", value: appointmentsData.length, color: "light-blue", description: "All-time bookings" },
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
        { title: "Customers", icon: FaUsers, path: "/admin/customers", color: "light-blue", subtitle: "Manage all user accounts" },
        { title: "Admins", icon: FaUserShield, path: "/admin/admins", color: "light-gray", subtitle: "Manage administrator access" },
        { title: "Messages", icon: FaEnvelope, path: "/admin/messages", color: "light-red", subtitle: "View contact inquiries" },
        { title: "Appointments", icon: FaCalendarAlt, path: "/admin/orders", color: "light-blue", subtitle: "View and edit bookings" },
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

            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 mb-3 sm:mb-0">
                    <span className="font-bold text-2xl uppercase">Lustre Salon Dashboard</span>
                </h1>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition duration-200"
                    disabled={loading}
                >
                    <FaSyncAlt className={`${loading ? "animate-spin" : ""}`} />
                    {loading ? "Refreshing..." : "Refresh Data"}
                </button>
            </header>

            {/* Admin Profile */}
            <section className="flex items-center gap-4 mb-8 p-4 bg-white border border-gray-100 rounded-xl shadow-md">
                <img
                    src={currentAdmin.image}
                    alt={currentAdmin.fullName}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 "
                />
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight uppercase">{currentAdmin.fullName}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm ">{currentAdmin.role === "admin" ? "System Administrator" : currentAdmin.role}</p>
                </div>
            </section>

            <h2 className="text-xl sm:text-2xl font-light text-gray-800 mb-6 border-b pb-2">Key Metrics</h2>


            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const classes = themeClasses[stat.color] || themeClasses['white'];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} p-4 sm:p-6 rounded-xl shadow-md border ${classes.border} transition duration-300 transform hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between">
                                <Icon className={`${classes.icon} text-xl sm:text-2xl`} />
                                <span className={`${classes.text} text-xl sm:text-2xl font-extrabold tracking-tight`}>{stat.value.toLocaleString()}</span>
                            </div>
                            <h3 className={`${classes.title} font-medium text-base sm:text-lg mt-2`}>{stat.title}</h3>
                            <p className={`${classes.text} opacity-75 text-xs mt-1`}>{stat.description}</p>
                        </div>
                    );
                })}
            </div>

            <hr className="my-6 sm:my-8 border-gray-200" />

            {/* Revenue Section*/}
            <h2 className="text-xl sm:text-2xl font-light text-gray-800 mb-6 border-b pb-2">Revenue Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">


                <div className="lg:col-span-2 order-1">
                    <RevenueChart appointments={appointments} />
                </div>


                <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6 order-2">
                    {/* Total Revenue */}
                    <div className={`${revenueClasses.bg} p-4 sm:p-6 rounded-xl shadow-md transition transform hover:scale-[1.02] border ${revenueClasses.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <FaDollarSign className={`${revenueClasses.icon} text-xl sm:text-2xl`} />
                            <h3 className={`text-blue-900 font-semibold text-xs sm:text-sm uppercase tracking-wider`}>Total Revenue</h3>
                        </div>
                        <p className={`${revenueClasses.text} text-2xl sm:text-3xl font-bold`}>${revenue.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    {/* Weekly Revenue */}
                    <div className={`${revenueClasses.bg} p-4 sm:p-6 rounded-xl shadow-md transition transform hover:scale-[1.02] border ${revenueClasses.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <FaCalendarWeek className={`${revenueClasses.icon} text-xl sm:text-2xl`} />
                            <h3 className={`text-blue-900 font-semibold text-xs sm:text-sm uppercase tracking-wider`}>Weekly Revenue</h3>
                        </div>
                        <p className={`${revenueClasses.text} text-2xl sm:text-3xl font-bold`}>${revenue.weekly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    {/* Monthly Revenue */}
                    <div className={`${revenueClasses.bg} p-4 sm:p-6 rounded-xl shadow-md transition transform hover:scale-[1.02] border ${revenueClasses.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <FaCalendar className={`${revenueClasses.icon} text-xl sm:text-2xl`} />
                            <h3 className={`text-blue-900 font-semibold text-xs sm:text-sm uppercase tracking-wider`}>Monthly Revenue</h3>
                        </div>
                        <p className={`${revenueClasses.text} text-2xl sm:text-3xl font-bold`}>${revenue.monthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <hr className="my-6 sm:my-8 border-gray-200" />

            {/* Quick Links */}
            <h2 className="text-xl sm:text-2xl font-light text-gray-800 mb-6 border-b pb-2">Quick Actions</h2>
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