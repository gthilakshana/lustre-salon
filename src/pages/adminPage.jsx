import { useState } from "react";
import { FaSignOutAlt, FaUsers, FaChartLine, FaShoppingCart, FaLeaf, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AdminView from "./admin/adminView";
import AdminCustomer from "./admin/adminCustomer";
import AdminTable from "./admin/adminTable";



export default function AdminPage() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: "Dashboard", icon: <FaChartLine />, path: "/admin/dashboard" },
        { name: "Customers List", icon: <FaUsers />, path: "/admin/customers" },
        { name: "Manage Admins", icon: <FaUserShield />, path: "/admin/admins" },
        { name: "Appointments List", icon: <FaShoppingCart />, path: "/admin/orders" },
        { name: "Customer Messages", icon: <FaLeaf />, path: "/admin/messages" },

    ];

    return (
        <>

            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-black text-white rounded-xl shadow-md hover:bg-red-600 transition duration-300 cursor-pointer"
                >
                    {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
            </div>


            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-black to-black shadow-lg p-6 z-40 border-r border-gray-700 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-1/5 flex flex-col`}
            >

                <header className="flex justify-center items-center w-full h-[100px] md:h-[100px] cursor-pointer  ">
                    <Link to="/admin">
                        <img src="LUSTRE.png"
                            alt="Lustre Logo"
                            className="h-[100px] w-[250px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300 " />

                    </Link>

                </header>


                <main className="flex flex-col flex-1">
                    <nav className="flex flex-col gap-2 mt-10">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 p-3  font-sm transition-all duration-300 ${active
                                        ? "bg-gray-700 text-white shadow-md"
                                        : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon} <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>


                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            sessionStorage.clear();
                            setIsOpen(false);
                            navigate("/login");
                        }}
                        className="flex items-center gap-3 p-3 mt-auto cursor-pointer bg-gray-700 text-white hover:bg-red-600 hover:text-white transition duration-300 justify-center font-medium w-full "
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </main>
            </aside>




            <div className="w-full md:w-[calc(100%-20%)] bg-white flex flex-col overflow-hidden ml-0 md:ml-[20%]">
                <div className="h-default w-full overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<AdminView />} />
                        <Route path="/dashboard" element={<AdminView />} />
                        <Route path="/customers" element={<AdminCustomer />} />
                        <Route path="/admins" element={<AdminTable />} />
                        {/* <Route path="/orders" element={<AdminOrders />} />  */}


                    </Routes>
                </div>
            </div>
        </>
    );
}
