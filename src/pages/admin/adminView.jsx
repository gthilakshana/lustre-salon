import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserShield, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";

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
        { icon: FaUsers, title: "Customers", value: 0, color: "blue" },
        { icon: FaUserShield, title: "Admins", value: 0, color: "gray" },
        { icon: FaEnvelope, title: "New Messages", value: 0, color: "red" },
        { icon: FaCalendarAlt, title: "Appointments", value: 0, color: "blue" },
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwt_decode(token);
            setCurrentAdmin({
                fullName: decoded.fullName || "Admin",
                role: decoded.role || "admin",
                image: decoded.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            });
        } catch (err) {
            console.error("Invalid token:", err);
            toast.error("Invalid session. Please login again.");
            navigate("/login");
        }
    }, [navigate]);


    const fetchStats = async () => {
        try {
            setLoading(true);
            const [usersRes, messagesRes] = await Promise.all([
                axios.get(import.meta.env.VITE_API_URL + "/api/users"),
                axios.get(import.meta.env.VITE_API_URL + "/api/messages"),
            ]);

            const users = usersRes.data || [];
            const customers = users.filter((u) => u.role === "user").length;
            const admins = users.filter((u) => u.role === "admin").length;
            const messages = messagesRes.data?.length || 0;

            setStats([
                { icon: FaUsers, title: "Customers", value: customers, color: "blue" },
                { icon: FaUserShield, title: "Admins", value: admins, color: "gray" },
                { icon: FaEnvelope, title: "New Messages", value: messages, color: "red" },
                { icon: FaCalendarAlt, title: "Appointments", value: 0, color: "blue" },
            ]);
        } catch (err) {
            console.error("Failed to fetch dashboard stats:", err);
            toast.error("Failed to load dashboard stats");
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
        { title: "Manage Appointments", icon: FaCalendarAlt, path: "/admin/appointments", color: "blue" },
    ];

    const colorClasses = {
        blue: { bg: "bg-blue-50", text: "text-blue-800", icon: "text-blue-600", title: "text-blue-900" },
        red: { bg: "bg-red-50", text: "text-red-800", icon: "text-red-600", title: "text-red-900" },
        gray: { bg: "bg-gray-100", text: "text-gray-800", icon: "text-gray-600", title: "text-gray-900" },
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 uppercase">Dashboard</h1>


            <div className="flex items-center gap-4 mb-8 p-4 bg-white  shadow-md hover:shadow-lg transition">
                <img
                    src={currentAdmin.image}
                    alt={currentAdmin.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                    <h2 className="text-xl font-semibold uppercase text-gray-900">{currentAdmin.fullName}</h2>
                    <p className="text-gray-600 text-sm">
                        {currentAdmin.role === "admin" ? "Administrator" : currentAdmin.role}
                    </p>
                </div>
            </div>


            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        const classes = colorClasses[stat.color];
                        return (
                            <div
                                key={idx}
                                className={`${classes.bg}  p-6 shadow-md hover:shadow-xl transition flex flex-col items-start`}
                            >
                                <Icon className={`${classes.icon} text-3xl mb-3`} />
                                <h3 className={`${classes.title} font-semibold text-lg`}>{stat.title}</h3>
                                <p className={`${classes.text} mt-2 text-xl font-bold`}>{stat.value}</p>
                            </div>
                        );
                    })}
                </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const classes = colorClasses[link.color];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg}  p-6 shadow-md hover:shadow-lg transition flex items-center gap-4 cursor-pointer`}
                            onClick={() => navigate(link.path)}
                        >
                            <Icon className={`${classes.icon} text-3xl`} />
                            <span className={`${classes.title} font-semibold`}>{link.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
