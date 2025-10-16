import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaCalendarAlt, FaClock, FaUserTie, FaDownload } from "react-icons/fa";
import { generateInvoicePDF } from "../components/invoicePDF";

dayjs.extend(customParseFormat);

export default function AppointmentCard({ appointmentGroup }) {
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [visible, setVisible] = useState(true);

    if (!appointmentGroup?.length) return null;

    const { date, time, payment, rawDate, rawTime, isCompleted } = appointmentGroup[0];

    // Hide expired appointments
    useEffect(() => {
        if (isCompleted || !rawDate || !rawTime) return;

        const appointmentDateTime = dayjs(
            `${dayjs(rawDate).format("YYYY-MM-DD")} ${rawTime}`,
            "YYYY-MM-DD h:mm A"
        );
        const now = dayjs();

        if (now.isAfter(appointmentDateTime)) {
            setVisible(false);
            return;
        }

        const msUntilEnd = appointmentDateTime.diff(now);
        const timer = setTimeout(() => setVisible(false), msUntilEnd);
        return () => clearTimeout(timer);
    }, [isCompleted, rawDate, rawTime]);

    if (!visible) return null;

    // --- Status and Payment Styling ---
    const status = {
        text: isCompleted ? "Completed" : "Pending",
        color: isCompleted ? "bg-green-600" : "bg-red-600",
    };

    const paymentStyle = {
        "Full Payment": "bg-green-100 text-green-700",
        "Half Payment": "bg-yellow-100 text-yellow-700",
        "Book Only": "bg-red-100 text-red-700",
    }[payment] || "bg-gray-100 text-gray-700";

    // --- Grouped Data ---
    const services = [...new Set(appointmentGroup.map(a => a.service))];
    const subNames = [...new Set(appointmentGroup.map(a => a.subName).filter(Boolean))];
    const stylists = [...new Set(appointmentGroup.map(a => a.stylist))];

    // 💡 NEW: Get the count of services in this single cart/booking
    const serviceCount = appointmentGroup.length;

    // --- Cost ---
    const totalCost = appointmentGroup.reduce((acc, a) => acc + (a.cost || 0), 0);
    const totalDue = appointmentGroup.reduce((acc, a) => acc + (a.due || 0), 0);

    // --- Invoice Generation ---
    const handleDownloadInvoice = async () => {
        setLoadingInvoice(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("User not found. Please log in again.");

            const customerInfo = {
                name: user.fullName || "Valued Customer",
                mobile: user.mobileNumber || "N/A",
                email: user.email || "N/A",
            };

            await generateInvoicePDF(appointmentGroup, customerInfo);
        } catch (err) {
            alert(`Failed to generate invoice: ${err.message}`);
        } finally {
            setLoadingInvoice(false);
        }
    };

    // --- Card Style ---
    const cardStyle = isCompleted
        ? "relative p-5 bg-white border border-gray-200 rounded-2xl shadow-md opacity-70 pointer-events-none"
        : "relative p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300";

    return (
        <div className={cardStyle}>
            {/* Status Tag */}
            <div className="absolute top-0 right-0">
                <span
                    className={`text-white text-xs font-semibold px-3 py-1 rounded-tr-2xl rounded-bl-2xl shadow-md ${status.color}`}
                >
                    {status.text}
                </span>
            </div>

            {/* Header */}
            <div className="border-b border-gray-200 pb-3 mb-3">
                {/* 💡 FIX: Add the service count (cart count) here */}
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    {services.join(", ")}
                    <span className="text-xs font-medium text-gray-500 normal-case ml-2">
                        ({serviceCount} {serviceCount === 1 ? 'Service' : 'Services'})
                    </span>
                </h2>
                {subNames.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">{subNames.join(", ")}</p>
                )}
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-red-500 mr-2" size={14} />
                        <span className="font-semibold mr-1">Date:</span> {date}
                    </p>
                    <p className="flex items-center text-gray-700">
                        <FaClock className="text-red-500 mr-2" size={14} />
                        <span className="font-semibold mr-1">Time:</span> {time}
                    </p>
                </div>
                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaUserTie className="text-red-500 mr-2" size={14} />
                        <span className="font-semibold mr-1">Stylist:</span> {stylists.join(", ")}
                    </p>
                    <span
                        className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${paymentStyle}`}
                    >
                        {payment}
                    </span>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 border-t border-gray-200 pt-3 mt-3 rounded-md p-3 flex justify-between items-center">
                <div>
                    {(payment === "Full Payment" || payment === "Half Payment") && (
                        <p className="font-bold text-gray-800 text-sm">
                            Total Cost: ${totalCost.toFixed(2)}
                        </p>
                    )}
                    {(payment === "Half Payment" || payment === "Book Only") && (
                        <p className="font-semibold text-xs text-red-600">
                            Due Amount: ${totalDue.toFixed(2)}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleDownloadInvoice}
                    disabled={loadingInvoice || isCompleted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${isCompleted
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    {loadingInvoice ? "Generating..." : <><FaDownload size={12} /> Invoice</>}
                </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
                Please arrive 10 minutes before your appointment.
            </p>
        </div>
    );
}