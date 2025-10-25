import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaCalendarAlt, FaClock, FaUserTie, FaDownload } from "react-icons/fa";
import { downloadInvoice } from "../utils/downloadInvoice";
// import { generateInvoicePDF } from "../components/invoicePDF";

dayjs.extend(customParseFormat);

export default function AppointmentCard({ appointmentGroup }) {
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [visible, setVisible] = useState(true);

    if (!appointmentGroup?.length) return null;

    const { date, time, payment, rawDate, rawTime, isCompleted } = appointmentGroup[0];

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

    const status = {
        text: isCompleted ? "Completed" : "Pending",
        color: isCompleted ? "bg-green-600" : "bg-red-600",
    };

    const paymentStyle = {
        "Full Payment": "bg-green-100 text-green-700",
        "Half Payment": "bg-yellow-100 text-yellow-700",
        "Book Only": "bg-red-100 text-red-700",
    }[payment] || "bg-gray-100 text-gray-700";

    const services = [...new Set(appointmentGroup.map(a => a.service))];
    const subNames = [...new Set(appointmentGroup.map(a => a.subName).filter(Boolean))];
    const stylists = [...new Set(appointmentGroup.map(a => a.stylist))];
    const serviceCount = appointmentGroup.length;
    const totalCost = appointmentGroup.reduce((acc, a) => acc + (Number(a.cost) || 0), 0);
    const totalDue = appointmentGroup.reduce((acc, a) => acc + (Number(a.due) || 0), 0);

    // --- Invoice Generation ---
    const handleDownloadInvoice = async () => {
        if (!appointmentGroup || appointmentGroup.length === 0) {
            alert("No appointments to generate invoice for.");
            return;
        }

        setLoadingInvoice(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("User not found. Please log in again.");

            const customer = {
                name: user.fullName || "Valued Customer",
                mobile: user.mobileNumber || "N/A",
                email: user.email || "N/A",
            };

            await downloadInvoice(appointmentGroup, customer);

        } catch (err) {
            alert(`Failed to generate invoice: ${err.message}`);
        } finally {
            setLoadingInvoice(false);
        }
    };

    const cardStyle = isCompleted
        ? "relative p-5 bg-white border border-gray-200 shadow-md opacity-70 pointer-events-none"
        : "relative p-5 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300";

    return (
        <div className={cardStyle}>
            <div className="absolute top-3 left-3 bg-gray-50 text-black text-[10px] font-semibold px-3 py-1 rounded-full">
                {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
            </div>

            <div className="absolute top-0 right-0">
                <span
                    className={`text-white text-[9px] font-arial px-4 py-2 rounded-bl-2xl shadow-md ${status.color}`}
                >
                    {status.text}
                </span>
            </div>

            <div className="border-b border-gray-200 pb-3 mb-3 mt-12">
                <h2 className="text-xs md:text-sm font-semibold uppercase text-gray-900 tracking-wide">
                    {services.join(", ")}
                </h2>
                {subNames.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{subNames.join(", ")}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div className="space-y-1.5">
                    <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-gray-400 mr-2" size={14} />
                        <span className="text-xs font-semibold mr-1">Date:</span> <span className="text-xs">{date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaClock className="text-gray-400 mr-2" size={14} />
                        <span className="text-xs font-semibold mr-1">Time:</span> <span className="text-xs">{time}</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center text-gray-700">
                        <FaUserTie className="text-gray-400 mr-2" size={14} />
                        <span className="text-xs font-semibold mr-1">Stylist:</span> <span className="text-xs">{stylists.join(", ")}</span>
                    </div>
                    <span
                        className={`mt-1 inline-block px-2 py-0.5 text-xs font-arial rounded-full ${paymentStyle}`}
                    >
                        {payment}
                    </span>
                </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 pt-3 mt-3 rounded-md p-3 flex justify-between items-center">
                <div>
                    {payment === "Full Payment" && (
                        <>
                            <p className="font-bold text-gray-800 text-xs">
                                Total Cost: ${totalCost.toFixed(2)}
                            </p>
                            <p className="font-arial text-xs text-green-600">
                                Paid: ${totalCost.toFixed(2)}
                            </p>
                            <p className="font-arial text-xs text-red-600">
                                Due: $0.00
                            </p>
                        </>
                    )}
                    {payment === "Half Payment" && (
                        <>
                            <p className="font-bold text-gray-800 text-xs">
                                Total Cost: ${totalCost.toFixed(2)}
                            </p>
                            <p className="font-arial text-xs text-green-600">
                                Paid: ${(totalCost - totalDue).toFixed(2)}
                            </p>
                            <p className="font-arial text-xs text-red-600">
                                Due: ${totalDue.toFixed(2)}
                            </p>
                        </>
                    )}
                    {payment === "Book Only" && (
                        <>
                            <p className="font-bold text-gray-800 text-xs">
                                Total Cost: ${totalCost.toFixed(2)}
                            </p>
                            <p className="font-arial text-xs text-green-600">
                                Paid: $0.00
                            </p>
                            <p className="font-arial text-xs text-red-600">
                                Due: ${totalDue.toFixed(2)}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* --- Download Invoice Button --- */}
            <div className="mt-3 flex justify-end">
                <button
                    onClick={() => !isCompleted && handleDownloadInvoice()}
                    disabled={isCompleted || loadingInvoice}
                    className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs  font-semibold transition
                    ${isCompleted || loadingInvoice
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer   "
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
