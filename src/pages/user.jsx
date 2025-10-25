import { useState, useEffect } from "react";
import { FaTachometerAlt } from "react-icons/fa";
import { FaChartPie, FaCalendarCheck, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineViewTimeline } from "react-icons/md";
import { LuUserRoundCheck } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { IoMdLogOut, IoMdBook } from "react-icons/io";
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

    // load user from localStorage
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
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const { appointments: fetchedAppointments = [], user: fetchedUser } = res.data || {};
            const now = dayjs();
            let upcomingAppointments = [];
            let completedAppointments = [];

            fetchedAppointments.forEach(a => {
                const dateStr = a.date ? dayjs(a.date).format("MM/DD/YYYY") : "-";
                const timeStr = a.time || "-";

                // parse using known format
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
                    isCompleted,
                    rawDate: a.date,
                    rawTime: a.time,
                    userId: a.userId,
                };

                if (isCompleted) completedAppointments.push(appointmentData);
                else upcomingAppointments.push(appointmentData);
            });

            completedAppointments.sort((a, b) => dayjs(b.rawDate).diff(dayjs(a.rawDate)));
            const limitedCompleted = completedAppointments.slice(0, 2);

            upcomingAppointments.sort((a, b) => dayjs(a.rawDate).diff(dayjs(b.rawDate)));

            const finalAppointments = [...upcomingAppointments, ...limitedCompleted];

            setAppointments(finalAppointments);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            ShowToast("error", "Failed to load your appointments", "Please try again or contact support.");
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

    const pendingAppointmentsCount = groupAppointmentsByTime(appointments.filter(apt => !apt.isCompleted)).length;


    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <RxDashboard size={18} /> },
        { id: "appointments", label: "Appointments", icon: <MdOutlineViewTimeline size={18} /> },
        { id: "book", label: "Book Now", icon: <IoMdBook size={20} /> },
        { id: "logout", label: "Logout", icon: <IoMdLogOut size={18} /> },
    ];

    return (
        <>
            <Header />

            <div className="w-full min-h-screen bg-gray-50 pt-35 pb-10">
                <div className="max-w-6xl mx-auto px-4">

                    {/* MOBILE PROFILE HEADER */}
                    <div className="md:hidden w-full  pt-3">
                        <div className="flex flex-col items-center text-center py-6 rounded-2xl shadow-xl 
        bg-black/95 text-white border border-white/10 backdrop-blur-xl">


                            <div className="relative flex items-center justify-center">
                                <img
                                    src={user.image || "/user.png"}
                                    alt="User Avatar"
                                    className="w-14 h-14 rounded-full object-cover border-[3px] border-white/90 shadow-md"
                                />


                                <span
                                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 
        border-2 border-black rounded-full shadow-sm"
                                ></span>
                            </div>



                            <h3 className="mt-3 text-[13px]  uppercase tracking-wide">
                                {user.fullName}
                            </h3>


                            <p className="text-[10px] text-gray-300 mt-1 tracking-wider">
                                {user.mobileNumber}
                            </p>


                            <div className="w-10 h-[2px] bg-red-500 rounded-full mt-3"></div>
                        </div>
                    </div>


                    {/* MOBILE NAV TABS (Bottom) */}
                    <div className="md:hidden w-full mt-4 mb-6">
                        <div className="flex justify-between items-center border-2 border-gray-200 rounded-2xl  text-white 
          px-2 py-2 ">

                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            if (tab.id === "logout") {
                                                handleLogout();
                                            } else if (tab.id === "book") {
                                                navigate("/appointment");
                                            } else {
                                                setActiveTab(tab.id);
                                            }
                                        }}
                                        className={`flex flex-col items-center flex-1 py-2 transition-all duration-300 
                        ${isActive ? "text-red-500 font-semibold" : "text-gray-700"}`}
                                    >
                                        <div className="mb-1 text-[18px]">
                                            {tab.icon}
                                        </div>

                                        <span className="text-[10px] tracking-wide">{tab.label}</span>

                                        <div
                                            className={`h-1 w-7 mt-2 rounded-full transition-all duration-300 
                            ${isActive ? "bg-red-500" : "bg-transparent"}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>




                    <div className="flex flex-col md:flex-row gap-6 ">

                        {/* SIDEBAR - desktop only */}
                        <aside className="hidden h-[510px] md:flex md:flex-col md:w-80 bg-white rounded-lg shadow-md overflow-hidden ">
                            <div className="flex flex-col items-center px-6 py-8 bg-black text-white">
                                <div className="relative">
                                    <img
                                        src={user.image || "/user.png"}
                                        alt="User Avatar"
                                        className="w-16 h-16 rounded-full object-cover border-4 border-white/80 shadow-lg"
                                    />
                                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                                </div>

                                <h3 className="mt-3 text-[15px] font-bold uppercase tracking-wide">
                                    {user.fullName}
                                </h3>


                                <p className="text-xs text-gray-300 mt-1 tracking-wider">
                                    {user.mobileNumber}
                                </p>


                                <div className="w-10 h-[2px] bg-red-500 rounded-full mt-3"></div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <nav className="flex flex-col divide-y divide-gray-100">
                                    <button
                                        onClick={() => setActiveTab("dashboard")}
                                        className={`flex items-center gap-4 px-6 py-4 transition ${activeTab === "dashboard" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                                    >
                                        <RxDashboard className="text-black" size={17} />
                                        <span className="text-sm font-medium text-gray-800">Dashboard</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("appointments")}
                                        className={`flex items-center gap-4 px-6 py-4 transition ${activeTab === "appointments" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                                    >
                                        <MdOutlineViewTimeline className="text-black" size={17} />
                                        <span className="text-sm font-medium text-gray-800">Appointments</span>
                                    </button>

                                    <button
                                        onClick={() => navigate("/appointment")}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                                    >
                                        <IoMdBook className="text-black" size={17} />
                                        <span className="text-sm font-medium text-gray-800">Book Now</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                                    >
                                        <IoMdLogOut className="text-black" size={17} />
                                        <span className="text-sm font-medium text-gray-800">Logout</span>
                                    </button>
                                </nav>
                            </div>


                        </aside>

                        {/* MAIN CONTENT */}
                        <main className="flex-1">
                            {activeTab === "dashboard" && (
                                <section className="mt-2 md:mt-7">
                                    <h2 className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
                                        Dashboard
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                        <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Upcoming Appointments</p>
                                                    <p className="text-2xl md:text-3xl font-extrabold text-red-500 mt-2">{pendingAppointmentsCount}</p>
                                                </div>
                                                <div className="w-10 h-10  rounded-full bg-red-100 flex items-center justify-center">
                                                    <MdOutlineViewTimeline className="text-red-500" size={18} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab("appointments")}
                                                className="mt-4 text-[10px] font-medium text-red-600 cursor-pointer hover:underline"
                                            >
                                                View All Bookings →
                                            </button>
                                        </div>


                                        <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Profile Status</p>
                                                    <p className="text-xs md:text-sm text-gray-700 mt-2">
                                                        Your profile is active and visible to stylists.
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <LuUserRoundCheck className="text-green-600" size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}


                            {activeTab === "appointments" && (
                                <section>
                                    <h2 className="text-sm md:text-lg font-semibold uppercase mb-4">My Appointments</h2>

                                    {loading ? (
                                        <div className="flex justify-center items-center min-h-[150px]">
                                            <span className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : appointments.length > 0 ? (
                                        <div className="grid gap-5">
                                            {groupAppointmentsByTime(appointments).map((group, index) => (
                                                <AppointmentCard key={index} appointmentGroup={group} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                                            <p className="text-xs md:text-sm text-gray-500">You have no upcoming or recent past appointments.</p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* For mobile, Book Now triggers navigation via top tab; desktop has Book Now in sidebar */}
                        </main>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
