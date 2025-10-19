import { useState, useEffect } from "react";
import { FaCalendarAlt, FaTachometerAlt } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import AppointmentCard from "../components/appointmentCard";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ShowToast } from "../components/lustreToaster";

dayjs.extend(customParseFormat);

export default function User() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);


    const fetchAppointments = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/appointments/my`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const { appointments: fetchedAppointments, user: fetchedUser } = res.data;
            const appointmentsArray = fetchedAppointments || [];

            const now = dayjs();
            let upcomingAppointments = [];
            let completedAppointments = [];

            appointmentsArray.forEach(a => {
                const dateStr = a.date ? dayjs(a.date).format("MM/DD/YYYY") : "-";
                const timeStr = a.time || "-";

                const appointmentDateTime = dayjs(
                    `${dayjs(a.date).format("YYYY-MM-DD")} ${a.time}`,
                    "YYYY-MM-DD h:mm A"
                );

                const isCompleted = appointmentDateTime.isBefore(now);

                const full = Number(a.fullPayment || 0);
                const due = Number(a.duePayment || 0);
                const totalCost = Number(full + due).toFixed(2);
                const paidAmount = Number(full).toFixed(2);
                const dueAmount = Number(due).toFixed(2);

                const appointmentData = {
                    id: a._id,
                    service: a.serviceName || "-",
                    subName: a.subName || "-",
                    stylist: a.stylistName || "-",
                    date: dateStr,
                    time: timeStr,
                    payment:
                        a.paymentType === "Full"
                            ? "Full Payment"
                            : a.paymentType === "Half"
                                ? "Half Payment"
                                : "Book Only",


                    cost: totalCost,


                    paid:
                        a.paymentType === "Full"
                            ? paidAmount
                            : a.paymentType === "Half"
                                ? paidAmount
                                : "0.00",


                    due:
                        a.paymentType === "Full"
                            ? "0.00"
                            : a.paymentType === "Half"
                                ? dueAmount
                                : totalCost,


                    isCompleted: isCompleted,
                    rawDate: a.date,
                    rawTime: a.time,
                    userId: a.userId,
                };




                if (isCompleted) {
                    completedAppointments.push(appointmentData);
                } else {
                    upcomingAppointments.push(appointmentData);
                }
            });

            completedAppointments.sort((a, b) =>
                dayjs(b.rawDate).diff(dayjs(a.rawDate))
            );

            const limitedCompleted = completedAppointments.slice(0, 2);

            upcomingAppointments.sort((a, b) =>
                dayjs(a.rawDate).diff(dayjs(b.rawDate))
            );

            const finalAppointments = [...upcomingAppointments, ...limitedCompleted];

            setAppointments(finalAppointments);
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


    const groupAppointmentsByTime = (appointments) => {
        const map = {};
        appointments.forEach(a => {
            const key = `${a.date}-${a.time}`;
            if (!map[key]) map[key] = [];
            map[key].push(a);
        });
        return Object.values(map);
    };


    const pendingAppointmentsCount = groupAppointmentsByTime(
        appointments.filter(apt => !apt.isCompleted)
    ).length;

    return (
        <>
            <Header />
            <div className="w-full min-h-screen pt-30 bg-gray-50 flex justify-center p-3">
                <div className="w-full max-w-6xl flex gap-6 md:flex-row flex-col">

                    {/* Sidebar */}
                    <div className="w-full h-[500px] md:h-[600px] md:max-w-sm bg-white shadow-xl flex flex-col justify-between overflow-hidden order-1 md:order-2">

                        {/* User Info */}
                        <div className="flex flex-col items-center p-8 bg-black text-gray-50">
                            <img
                                src={user.image || "/user.png"}
                                alt="User Avatar"
                                className="w-14 h-14 md:w-18 md:h-18 rounded-full border-4 object-cover border-white shadow-lg mb-4"
                            />
                            <h2 className="text-md md:text-lg uppercase">{user.fullName}</h2>
                            <p className="text-sm opacity-90">+1 {user.mobileNumber}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-4 px-6 py-4 transition ${activeTab === "dashboard"
                                    ? "bg-gray-50"
                                    : "hover:bg-gray-200"
                                    }`}
                            >
                                <FaTachometerAlt className="text-black" size={20} />
                                <span className="text-sm font-medium text-gray-800">Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("appointments")}
                                className={`flex items-center gap-4 px-6 py-4 transition ${activeTab === "appointments"
                                    ? "bg-gray-50"
                                    : "hover:bg-gray-200"
                                    }`}
                            >
                                <FaCalendarAlt className="text-black" size={20} />
                                <span className="text-sm font-medium text-gray-800">My Appointments</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-200 transition"
                            >
                                <IoMdLogOut className="text-black" size={20} />
                                <span className="text-sm font-medium text-gray-800">Logout</span>
                            </button>
                        </div>

                        {/* BOOK NOW Button */}
                        <div className="p-6">
                            <Link
                                to="/appointment"
                                className="w-full block text-center bg-black text-sm rounded-md text-white font-semibold py-3 shadow-lg hover:bg-gray-900 hover:text-red-500  transition-all duration-300"
                            >
                                BOOK NOW
                            </Link>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5  order-2 md:order-2 bg-white shadow-xl ">
                        {activeTab === "dashboard" && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">
                                    Dashboard
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gray-100 shadow-md">
                                        <h3 className="font-semibold text-gray-700">Upcoming Appointments</h3>
                                        <p className="text-3xl font-bold text-red-500">
                                            {pendingAppointmentsCount} {/* This will now be 1 */}
                                        </p>
                                        <button
                                            onClick={() => setActiveTab("appointments")}
                                            className="mt-3 px-4 py-2 rounded-full cursor-pointer bg-black text-white hover:bg-red-600 transition"
                                        >
                                            View All Bookings
                                        </button>
                                    </div>
                                    <div className="p-6 bg-gray-100 shadow-md">
                                        <h3 className="font-semibold text-gray-700">
                                            Profile Status
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Your profile is active and visible to stylists.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "appointments" && (
                            <div>
                                <h2 className="text-md md:text-xl uppercase font-semibold  text-gray-800 mb-4">
                                    My Appointments
                                </h2>

                                {loading ? (
                                    <div className="flex justify-center items-center min-h-[200px]">
                                        <span className="w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                                    </div>
                                ) : appointments.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols">

                                        {groupAppointmentsByTime(appointments).map((group, index) => (
                                            <AppointmentCard
                                                key={index}
                                                appointmentGroup={group}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-6 p-6 bg-gray-100  shadow-md">
                                        <p className="text-sm text-gray-500">
                                            You have no upcoming or recent past appointments.
                                        </p>
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