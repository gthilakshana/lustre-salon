export default function AppointmentCard({ service, subName, stylist, date, time, payment, cost, due, comingSoon }) {
    return (
        <div className={`relative border border-gray-200  shadow-md p-6 bg-gray-50 hover:shadow-lg transition 
            ${comingSoon ? "opacity-70 cursor-not-allowed" : ""}`}>


            {comingSoon && (
                <div className="absolute top-3 right-3">
                    <div className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Coming Soon
                    </div>
                </div>
            )}


            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-3">
                <h2 className="text-lg font-bold uppercase text-gray-800">{service} - <span className="font-medium text-gray-600">{subName}</span></h2>
                <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full 
                    ${payment === "Full Payment"
                        ? "bg-green-100 text-green-700"
                        : payment === "Half Payment"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}>
                    {payment}
                </span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm mb-3">
                <div>
                    <p><span className="font-semibold text-gray-800">Stylist:</span> {stylist}</p>
                    <p><span className="font-semibold text-gray-800">Date:</span> {date}</p>
                    <p><span className="font-semibold text-gray-800">Time:</span> {time}</p>
                </div>
                <div>
                    <p><span className="font-semibold text-gray-800">Total Cost:</span> <span className="text-gray-900 font-bold">LKR {cost}</span></p>
                    {payment !== "Full Payment" && (
                        <p><span className="font-semibold text-gray-800">Due Amount:</span> <span className="text-red-600 font-bold">LKR {due}</span></p>
                    )}
                </div>
            </div>


            <div className="text-xs text-gray-500 border-t pt-2">
                <p>Thank you for booking with us! Please arrive 10 minutes before your appointment time.</p>
            </div>
        </div>
    );
}
