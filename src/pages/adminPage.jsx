import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { BiMessageAdd } from "react-icons/bi";

import {
    MdHomeRepairService,
    MdOutlineDashboardCustomize,
    MdBorderColor,
} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

import AdminView from "./admin/adminView";
import AdminCustomer from "./admin/adminCustomer";
import AdminAdd from "./admin/adminAdd";
import AdminMessage from "./admin/adminMessage";
import AdminUpdate from "./admin/adminUpdate";
import AdminTable from "./admin/adminTable";
import AdminAppoinment from "./admin/adminAppoinment";
import AdminService from "./admin/adminService";
import AdminServiceUpdate from "./admin/adminServiceUpdate";
import AdminServiceAdd from "./admin/adminServiceAdd";

export default function AdminPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [adminName, setAdminName] = useState("Administrator");
    const [adminCount, setAdminCount] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setAdminName(decoded.fullName || "Administrator");
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, []);

    // Fetch admin count
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users", config);
                const users = res.data || [];
                const admins = users.filter((u) => u.role === "admin").length;
                setAdminCount(admins);
            } catch (err) {
                console.error("Failed to fetch counts", err);
            }
        };
        fetchCounts();
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: <MdOutlineDashboardCustomize />, path: "/admin/dashboard" },
        { name: "Customers", icon: <FiUsers />, path: "/admin/customers" },
        { name: "Appointments", icon: <MdBorderColor />, path: "/admin/orders" },
        { name: "Admins", icon: <RiAdminLine />, path: "/admin/admins" },
        { name: "Services", icon: <MdHomeRepairService />, path: "/admin/services" },
        { name: "Messages", icon: <BiMessageAdd />, path: "/admin/messages" },

    ];

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-black text-white rounded-xl shadow-md hover:bg-red-600 transition duration-300"
                >
                    {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 md:w-1/5 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg p-6 z-40 border-r border-gray-700 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-between`}
            >
                <div>
                    {/* Logo */}
                    <header className="flex justify-center items-center w-full h-[100px] cursor-pointer">
                        <Link to="/admin">
                            <img
                                src="LUSTRE.png"
                                alt="Lustre Logo"
                                className="h-[100px] w-[220px] object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </header>

                    {/* Admin Name */}
                    <div className="flex flex-col justify-center items-center mt-4">
                        <h2 className="text-white font-semibold text-lg">{adminName}</h2>
                        <p className="text-gray-400 text-sm">Administrator</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-3 mt-6">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-md font-semibold transition-all duration-300
                    ${active
                                            ? "bg-gray-600 text-white shadow-lg"
                                            : "text-gray-300 hover:bg-gray-700/70 hover:text-white"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section (Admin Count + Logout) */}
                <div className="mt-8 border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/80 rounded-lg shadow-inner hover:shadow-xl transition duration-300">
                        <span className="text-white font-semibold">Admins</span>
                        <span className="text-red-500 font-bold text-lg">{adminCount}</span>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            sessionStorage.clear();
                            setIsOpen(false);
                            navigate("/login");
                        }}
                        className="flex items-center gap-2 justify-center w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-300"
                    >
                        <IoMdLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="w-full md:w-[calc(100%-20%)] bg-gray-50 min-h-screen ml-0 md:ml-[20%] flex flex-col">
                <div className="overflow-y-auto p-6 space-y-6">
                    <Routes>
                        <Route path="/*" element={<AdminView />} />
                        <Route path="/dashboard" element={<AdminView />} />
                        <Route path="/customers" element={<AdminCustomer />} />
                        <Route path="/admins" element={<AdminTable />} />
                        <Route path="/add-admin" element={<AdminAdd />} />
                        <Route path="/messages" element={<AdminMessage />} />
                        <Route path="/services" element={<AdminService />} />
                        <Route path="/add-service" element={<AdminServiceAdd />} />
                        <Route path="/orders" element={<AdminAppoinment />} />
                        <Route path="/update-service/:id" element={<AdminServiceUpdate />} />
                        <Route path="/update-admin/:id" element={<AdminUpdate />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
