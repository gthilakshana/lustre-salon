import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { ShowToast } from "../../components/lustreToaster";
import dayjs from "dayjs";

function PageLoader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
            <span className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
}

function AppointmentDeleteConfirm({ appointmentID, close, confirmDelete, loading }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-xl max-w-sm w-full p-6 rounded-lg animate-scaleIn relative">
                <button
                    onClick={close}
                    disabled={loading}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white rounded-full hover:bg-white hover:text-red-600 border border-red-600 flex items-center justify-center transition disabled:opacity-50"
                >
                    ✕
                </button>
                <p className="text-center text-gray-700 text-sm mb-4">
                    Are you sure you want to delete appointment:
                    <span className="block font-semibold mt-1 text-gray-900">{appointmentID}</span>
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={close}
                        disabled={loading}
                        className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => confirmDelete(appointmentID)}
                        disabled={loading}
                        className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    const fetchAppointments = async () => {
        try {
            setFetching(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/appointments`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const now = dayjs();

            const mapped = res.data.map((a) => {
                const dateTime = a.date && a.time
                    ? dayjs(`${a.date} ${a.time}`, "YYYY-MM-DD hh:mm A")
                    : null;
                let status = a.status || "Pending";

                if (dateTime && status !== "Completed") {
                    if (now.isAfter(dateTime) && now.isBefore(dateTime.add(45, "minute"))) {
                        status = "Ongoing";
                    }
                }

                return {
                    _id: a._id,
                    fullName: a.user?.fullName || "-",
                    category: a.subName || "-",
                    service: a.serviceName || "-",
                    stylist: a.stylistName || "-",
                    date: a.date ? new Date(a.date).toLocaleDateString() : "-",
                    time: a.time || "-",
                    payment:
                        a.paymentType === "Full"
                            ? "Full Payment"
                            : a.paymentType === "Half"
                                ? "Half Payment"
                                : "Book Only",
                    price: (a.fullPayment || 0) + (a.duePayment || 0),
                    status,
                };
            });


            setAppointments(mapped);
        } catch (err) {
            console.error(err);
            ShowToast(
                "error",
                "Failed to load appointments",
                "Please try again or contact support."
            );
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/appointments/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            ShowToast("success", "Appointment deleted");
            setAppointments((prev) => prev.filter((a) => a._id !== id));
            setConfirmVisible(false);
        } catch {
            ShowToast("error", "Delete failed", "Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = appointments
        .filter((a) => {
            const term = search.toLowerCase();
            const matchSearch =
                a.fullName.toLowerCase().includes(term) ||
                a.service.toLowerCase().includes(term) ||
                a.stylist.toLowerCase().includes(term);
            const matchPayment =
                paymentFilter === "All" || a.payment === paymentFilter;
            return matchSearch && matchPayment;
        })
        .sort((a, b) => {
            // ✅ Sort so Pending is always first, then Ongoing, then Completed
            const order = { Pending: 1, Ongoing: 2, Completed: 3 };
            const rankA = order[a.status] ?? 4;
            const rankB = order[b.status] ?? 4;
            if (rankA !== rankB) return rankA - rankB;
            return new Date(b.date) - new Date(a.date);
        });

    const paid = (payment, price) =>
        payment === "Full Payment"
            ? `Rs. ${price.toLocaleString()}`
            : payment === "Half Payment"
                ? `Rs. ${price.toLocaleString()}`
                : "—";

    const due = (payment, price) =>
        payment === "Half Payment"
            ? `Rs. ${price.toLocaleString()}`
            : payment === "Book Only"
                ? `Rs. ${price.toLocaleString()}`
                : "—";

    return (
        <div className="w-full min-h-screen bg-white p-4 text-sm relative">
            {confirmVisible && (
                <AppointmentDeleteConfirm
                    appointmentID={appointmentToDelete}
                    close={() => setConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}

            {fetching && <PageLoader />}

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-800 uppercase">
                    Appointments
                </h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        {filtered.length} records
                    </span>
                    <button
                        onClick={fetchAppointments}
                        disabled={fetching}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        {fetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, service or stylist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-full md:w-1/2 focus:ring-1 focus:ring-gray-400"
                />
                <div className="flex gap-2 flex-wrap">
                    {["All", "Full Payment", "Half Payment", "Book Only"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setPaymentFilter(type)}
                            className={`px-3 py-1.5 rounded-md border text-xs font-medium transition
                ${paymentFilter === type
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className={`overflow-x-auto border rounded-md transition-opacity ${fetching ? "opacity-50" : "opacity-100"
                    }`}
            >
                <table className="w-full min-w-[950px] text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {[
                                "Customer",
                                "Category",
                                "Service",
                                "Stylist",
                                "Date",
                                "Time",
                                "Payment",
                                "Paid",
                                "Due",
                                "Appointment",
                                "Actions",
                            ].map((h) => (
                                <th key={h} className="px-3 py-2 uppercase text-xs">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((a) => {
                                const isOldPending =
                                    a.status !== "Completed" &&
                                    (() => {
                                        const apptDate = new Date(a.date);
                                        const now = new Date();
                                        const diffDays =
                                            (now - apptDate) / (1000 * 60 * 60 * 24);
                                        return diffDays >= 3;
                                    })();
                                return (
                                    <tr
                                        key={a._id}
                                        className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition
                                            ${a.status === "Pending" ? "bg-red-50" : ""} 
                                            ${isOldPending ? "bg-yellow-50" : ""}`}
                                    >
                                        <td className="px-3 py-2">{a.fullName}</td>
                                        <td className="px-3 py-2">{a.category}</td>
                                        <td className="px-3 py-2">{a.service}</td>
                                        <td className="px-3 py-2">{a.stylist}</td>
                                        <td className="px-3 py-2">{a.date}</td>
                                        <td className="px-3 py-2">{a.time}</td>
                                        <td
                                            className={`px-3 py-2 font-medium ${a.payment === "Full Payment"
                                                ? "text-green-600"
                                                : a.payment === "Half Payment"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                                }`}
                                        >
                                            {a.payment}
                                        </td>
                                        <td className="px-3 py-2">
                                            {paid(a.payment, a.price)}
                                        </td>
                                        <td className="px-3 py-2 text-red-600">
                                            {due(a.payment, a.price)}
                                        </td>
                                        <td
                                            className={`px-3 py-2 font-medium ${a.status === "Completed"
                                                ? "text-green-600"
                                                : a.status === "Ongoing"
                                                    ? "text-orange-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {a.status}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <RiDeleteBin6Line
                                                size={20}
                                                className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                                                onClick={() => {
                                                    setAppointmentToDelete(a._id);
                                                    setConfirmVisible(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={11}
                                    className="px-3 py-8 text-center text-gray-500"
                                >
                                    No appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
