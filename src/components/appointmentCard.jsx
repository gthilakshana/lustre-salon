import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaCalendarAlt, FaClock, FaUserTie } from "react-icons/fa";

dayjs.extend(customParseFormat);

export default function AppointmentCard({
    service,
    subName,
    stylist,
    date,
    time,
    payment,
    cost,
    due,
    comingSoon,
    isCompleted,
    rawDate,
    rawTime
}) {
    const [visible, setVisible] = useState(true);


    useEffect(() => {

        if (isCompleted || !rawDate || !rawTime) {
            return;
        }


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


        const timer = setTimeout(() => {
            setVisible(false);
        }, msUntilEnd);


        return () => clearTimeout(timer);
    }, [isCompleted, rawDate, rawTime]);

    if (!visible) return null;


    const statusColor = isCompleted ? "bg-green-600" : "bg-red-600";
    const statusText = isCompleted ? "Completed" : "Pending";


    let paymentColor = "bg-red-100 text-red-700";
    if (payment === "Full Payment") {
        paymentColor = "bg-green-100 text-green-700";
    } else if (payment === "Half Payment") {
        paymentColor = "bg-yellow-100 text-yellow-700";
    }

    return (
        <div
            className={`relative p-4 bg-white border border-gray-100 rounded-lg shadow-lg 
            ${comingSoon ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"} transition duration-300`}
        >


            <div className="absolute top-0 right-0">
                <div className={`text-white text-xs font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg ${statusColor} shadow-md`}>
                    {statusText}
                </div>
            </div>


            <div className="border-b border-gray-200 pb-3 mb-3">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    {service}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    {subName}
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">

                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Date:</span> {date}
                    </p>
                    <p className="flex items-center text-gray-700">
                        <FaClock className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Time:</span> {time}
                    </p>
                </div>


                <div className="space-y-1.5">
                    <p className="flex items-center text-gray-700">
                        <FaUserTie className="text-red-500 mr-2" size={12} />
                        <span className="font-semibold mr-1">Stylist:</span> {stylist}
                    </p>

                    <span
                        className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${paymentColor}`}
                    >
                        {payment}
                    </span>
                </div>
            </div>


            <div className="border-t border-gray-200 pt-3 mt-3 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-gray-800">Total Cost:</p>
                    <p className="font-semibold text-base text-black">LKR {cost}</p>
                </div>

                {payment !== "Full Payment" && (
                    <div className="flex justify-between items-center mt-1">
                        <p className="font-semibold text-xs text-gray-600">Due Amount:</p>
                        <p className="font-semibold text-sm text-red-600">LKR {due}</p>
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-400 mt-2 text-center">
                <p>Please arrive 10 minutes before your scheduled appointment time.</p>
            </div>
        </div>
    );
}