import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserShield, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

export default function AdminView() {
    const navigate = useNavigate();

    // Dummy admin data
    const adminName = "John Doe";
    const adminImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    // Dummy stats for display
    const stats = [
        { icon: FaUsers, title: "Customers", value: 85, color: "blue" },
        { icon: FaUserShield, title: "Admins", value: 12, color: "gray" },
        { icon: FaEnvelope, title: "New Messages", value: 23, color: "red" },
        { icon: FaCalendarAlt, title: "Appointments", value: 17, color: "blue" },
    ];

    // Quick links
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


            <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <img
                    src={adminImage}
                    alt={adminName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{adminName}</h2>
                    <p className="text-gray-600 text-sm">Administrator</p>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const classes = colorClasses[stat.color];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} rounded-xl p-6 shadow-md hover:shadow-xl transition flex flex-col items-start`}
                        >
                            <Icon className={`${classes.icon} text-3xl mb-3`} />
                            <h3 className={`${classes.title} font-semibold text-lg`}>{stat.title}</h3>
                            <p className={`${classes.text} mt-2 text-xl font-bold`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const classes = colorClasses[link.color];
                    return (
                        <div
                            key={idx}
                            className={`${classes.bg} rounded-xl p-6 shadow-md hover:shadow-lg transition flex items-center gap-4 cursor-pointer`}
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
