import { useState, useEffect } from "react";
import { FaCalendarAlt, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import AppointmentCard from "../components/appointmentCard";
import axios from "axios";
import { ShowToast, LustreToaster } from "../components/lustreToaster";

export default function User() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch appointments from backend
    const fetchAppointments = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const mapped = res.data.map(a => ({
                serviceName: a.serviceName || "-",
                subName: a.subName || "-",
                stylist: a.stylistName || "-",
                date: a.date ? new Date(a.date).toLocaleDateString() : "-",
                time: a.time || "-",
                payment: a.paymentType === "Full" ? "Full Payment" :
                    a.paymentType === "Half" ? "Half Payment" : "Book Only",
                due: (a.duePayment || 0).toString(),
                cost: ((a.fullPayment || 0) + (a.duePayment || 0)).toString()
            }));

            setAppointments(mapped);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            ShowToast(
                "error",
                "Failed to load your appointments",
                "Please try again or contact support."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchAppointments();
    }, [user]);

    if (!user) return null;

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Header />
            <div className="w-full min-h-screen pt-30 bg-gray-50 flex justify-center p-6">
                <div className="w-full max-w-6xl flex gap-6">
                    {/* Sidebar */}
                    <div className="w-full max-w-sm bg-white shadow-xl overflow-hidden">
                        <div className="flex flex-col items-center p-8 bg-black text-gray-50">
                            <img
                                src={user.image || "/user.png"}
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full border-4 object-cover border-white shadow-lg mb-4"
                            />
                            <h2 className="text-2xl font-bold uppercase">{user.fullName}</h2>
                            <p className="text-sm opacity-90">+94 {user.mobileNumber}</p>
                        </div>

                        <div className="flex flex-col divide-y divide-gray-200">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center cursor-pointer gap-4 px-6 py-4 transition ${activeTab === "dashboard" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                            >
                                <FaTachometerAlt className="text-black" size={20} />
                                <span className="font-medium text-gray-800">Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("appointments")}
                                className={`flex items-center cursor-pointer gap-4 px-6 py-4 transition ${activeTab === "appointments" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                            >
                                <FaCalendarAlt className="text-black" size={20} />
                                <span className="font-medium text-gray-800">My Appointments</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center cursor-pointer gap-4 px-6 py-4 hover:bg-gray-200 transition"
                            >
                                <FaSignOutAlt className="text-black" size={20} />
                                <span className="font-medium text-gray-800">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8">
                        {activeTab === "dashboard" && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">Dashboard</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gray-100 shadow-md">
                                        <h3 className="font-semibold text-gray-700">Appointments</h3>
                                        <p className="text-3xl font-bold text-red-500">{appointments.length}</p>
                                        <button
                                            onClick={() => setActiveTab("appointments")}
                                            className="mt-3 px-4 py-2 bg-black text-white hover:bg-red-600 transition"
                                        >
                                            View All Bookings
                                        </button>
                                    </div>
                                    <div className="p-6 bg-gray-100 shadow-md">
                                        <h3 className="font-semibold text-gray-700">Profile Status</h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Your profile is active and visible to stylists.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "appointments" && (
                            <div>
                                <h2 className="text-xl uppercase font-bold text-gray-800 mb-4">My Appointments</h2>
                                {loading ? (
                                    <div className="flex justify-center items-center mt-6">
                                        <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                                    </div>
                                ) : appointments.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols">
                                        {appointments.map((apt, index) => (
                                            <AppointmentCard key={index} {...apt} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-md">
                                        <p className="text-sm text-gray-500">No appointments yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
