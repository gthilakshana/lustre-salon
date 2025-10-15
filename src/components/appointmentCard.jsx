import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaCalendarAlt, FaClock, FaUserTie, FaDownload } from "react-icons/fa";
import { generateInvoicePDF } from "../components/invoicePDF";
import axios from "axios";

dayjs.extend(customParseFormat);

export default function AppointmentCard({ appointmentGroup }) {
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [visible, setVisible] = useState(true);

    if (!appointmentGroup || appointmentGroup.length === 0) return null;

    const { date, time, payment, rawDate, rawTime, isCompleted } = appointmentGroup[0];

    // Hide expired appointments
    useEffect(() => {
        if (isCompleted || !rawDate || !rawTime) return;

        const appointmentDateTime = dayjs(`${dayjs(rawDate).format("YYYY-MM-DD")} ${rawTime}`, "YYYY-MM-DD h:mm A");
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


    const statusColor = isCompleted ? "bg-green-600" : "bg-red-600";
    const statusText = isCompleted ? "Completed" : "Pending";

    let paymentColor = "bg-red-100 text-red-700";
    if (payment === "Full Payment") paymentColor = "bg-green-100 text-green-700";
    else if (payment === "Half Payment") paymentColor = "bg-yellow-100 text-yellow-700";


    const uniqueServices = [...new Set(appointmentGroup.map(a => a.service))];
    const uniqueSubNames = [...new Set(appointmentGroup.map(a => a.subName).filter(Boolean))];
    const uniqueStylists = [...new Set(appointmentGroup.map(a => a.stylist))];


    const totalCost = appointmentGroup.reduce((acc, a) => acc + (a.cost || 0), 0);
    const totalDue = appointmentGroup.reduce((acc, a) => acc + (a.due || 0), 0);



    const downloadInvoice = async () => {
        setLoadingInvoice(true);

        try {

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/appointments/my`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );


            const user = res.data.user || {};

            const customerInfo = {
                name: user.fullName || "Valued Customer",
                mobile: user.mobileNumber || "N/A",
                email: user.email || "N/A",
            };

            if (!appointmentGroup || appointmentGroup.length === 0) {
                alert("Cannot generate invoice: Appointment data is missing from the card.");
                return;
            }

            // 3. Generate PDF
            await generateInvoicePDF(appointmentGroup, customerInfo);

        } catch (err) {
            console.error("Invoice generation failed:", err);
            alert("Failed to generate invoice. Please ensure you are logged in or try again later.");
        } finally {
            setLoadingInvoice(false);
        }
    };



    const cardClasses = isCompleted
        ? "relative p-4 bg-white border border-gray-100 rounded-lg shadow-lg transition duration-300 pointer-events-none opacity-60"
        : "relative p-4 bg-white border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300";

    return (
        <div className={cardClasses}>

            <div className="absolute top-0 right-0">
                <div className={`text-white text-xs font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg ${statusColor} shadow-md`}>
                    {statusText}
                </div>
            </div>


            <div className="border-b border-gray-200 pb-3 mb-3">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    {uniqueServices.join(", ")}
                </h2>
                {uniqueSubNames.length > 0 && (
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        {uniqueSubNames.join(", ")}
                    </p>
                )}
                {/* <p className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-sm mr-1">Booking Date:</span>{" "}
                    {dayjs(createdAt).format("DD/MM/YYYY")}
                </p> */}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Appointment Date:</span> {date}
                    </p>
                    <p className="flex items-center text-gray-700">
                        <FaClock className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Time:</span> {time}
                    </p>

                </div>
                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaUserTie className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Stylist:</span> {uniqueStylists.join(", ")}
                    </p>
                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${paymentColor}`}>
                        {payment}
                    </span>
                </div>
            </div>


            <div className="border-t border-gray-200 pt-3 mt-3 bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <div>
                    {(payment === "Full Payment" || payment === "Half Payment") && (
                        <p className="font-bold text-sm text-gray-800">Total Cost: ${totalCost}</p>
                    )}
                    {(payment === "Half Payment" || payment === "Book Only") && (
                        <p className="font-semibold text-xs text-red-600">Due Amount: ${totalDue}</p>
                    )}
                </div>
                <button
                    onClick={downloadInvoice}
                    disabled={loadingInvoice}
                    className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded cursor-pointer text-xs font-semibold transition ${isCompleted ? "cursor-not-allowed opacity-60" : "hover:bg-gray-800"
                        }`}
                >
                    {loadingInvoice ? "Generating..." : <><FaDownload size={12} /> Download Invoice</>}
                </button>
            </div>

            <div className="text-xs text-gray-400 mt-2 text-center">
                <p>Please arrive 10 minutes before your scheduled appointment time.</p>
            </div>
        </div>
    );
}
