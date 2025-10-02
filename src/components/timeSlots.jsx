import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaMale, FaFemale } from "react-icons/fa";


dayjs.extend(customParseFormat);


const allTimeSlots = [
    "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM",
    "12:00 PM", "1:00 PM", "1:45 PM", "2:30 PM",
    "3:15 PM", "4:00 PM", "4:45 PM", "5:30 PM",
];
const SLOT_DURATION_MINUTES = 45;


const isSlotInPast = (selectedDate, slotTime) => {
    if (!selectedDate) return true;

    const slotDateTime = dayjs(`${selectedDate} ${slotTime}`, "YYYY-MM-DD h:mm A");
    const currentDateTime = dayjs();


    return slotDateTime.isBefore(currentDateTime.subtract(1, 'minute'));
};

export default function TimeSlots({
    selectedTime,
    setSelectedTime,
    selectedGender,
    setSelectedGender,
    selectedDate,
    stylistName,
    bookedAppointments = []
}) {

    const bookingsArray = Array.isArray(bookedAppointments) ? bookedAppointments : [];

    const isSlotBooked = (slotTime) => {
        if (!selectedDate || bookingsArray.length === 0) {
            return false;
        }


        const slotDateTime = dayjs(`${selectedDate} ${slotTime}`, "YYYY-MM-DD h:mm A");
        const slotEndTime = slotDateTime.add(SLOT_DURATION_MINUTES, 'minutes');

        const normalizedStylistName = stylistName ? stylistName.toLowerCase() : "";

        return bookingsArray.some((booking) => {


            if (!booking.time || !booking.stylistName || !booking.status) {
                return false;
            }


            let bookingEndTimeString = booking.endTime;
            if (!booking.endTime) {
                const tempStartTime = dayjs(booking.time, "h:mm A");

                bookingEndTimeString = tempStartTime.add(SLOT_DURATION_MINUTES, 'minutes').format("h:mm A");
            }
            // ----------------------------------------------------


            const bookingStartTime = dayjs(`${selectedDate} ${booking.time}`, "YYYY-MM-DD h:mm A");
            const bookingEndTime = dayjs(`${selectedDate} ${bookingEndTimeString}`, "YYYY-MM-DD h:mm A");


            const bookingStylistNormalized = booking.stylistName ? booking.stylistName.toLowerCase() : "";
            const stylistMatch = bookingStylistNormalized === normalizedStylistName;


            const blockingStatuses = ["Pending", "Ongoing", "Confirmed"];
            const statusBlocks = blockingStatuses.includes(booking.status);


            const isOverlapping = (

                slotDateTime.isBefore(bookingEndTime) &&

                slotEndTime.isAfter(bookingStartTime)
            );


            return isOverlapping && stylistMatch && statusBlocks;
        });
    };

    const isReady = selectedDate && selectedGender && stylistName;

    return (
        <div className="bg-white p-6 shadow-xl w-full">
            <h3 className="text-lg font-semibold mb-6 text-left text-gray-800">
                {selectedDate
                    ? `Available Slots for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                    : 'Select Date'}
            </h3>


            <div className="mb-8">
                <h4 className="text-md font-semibold mb-3 text-left">1. Select Service Type</h4>
                <div className="flex gap-4">

                    <button
                        onClick={() => setSelectedGender("Gents")}
                        className={`flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors rounded-lg 
                            ${selectedGender === "Gents"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                            }`}
                    >
                        <FaMale /> Gents
                    </button>

                    <button
                        onClick={() => setSelectedGender("Ladies")}
                        className={`flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors rounded-lg 
                            ${selectedGender === "Ladies"
                                ? "bg-pink-600 text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-pink-50 hover:border-pink-400"
                            }`}
                    >
                        <FaFemale /> Ladies
                    </button>
                </div>
            </div>


            <h4 className="text-md font-semibold mb-4 text-left">2. Select Time Slot</h4>

            {!isReady ? (
                <p className="text-red-600 font-medium text-left bg-red-100 p-3 rounded-lg border border-red-300">
                    Please select a **Date** and **Service Type** above to see availability for {stylistName}.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allTimeSlots.map((slot) => {
                        const booked = isSlotBooked(slot);
                        const past = isSlotInPast(selectedDate, slot);
                        const isSelected = selectedTime === slot;

                        const isDisabled = booked || past;

                        const baseClasses = "rounded-lg text-sm sm:text-base px-2 py-3 font-medium transition-all text-center relative";
                        let slotClasses = "";

                        const statusLabel = booked ? "Booked" : past ? "Past" : "Available";

                        if (booked) {
                            slotClasses = "bg-red-100 text-red-600 border border-red-200 cursor-not-allowed opacity-90 ";
                        } else if (past) {
                            slotClasses = "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed opacity-70 ";
                        } else if (isSelected) {
                            slotClasses = "bg-blue-600 text-white border-2 border-blue-700 shadow-lg cursor-pointer transform scale-[1.03]";
                        } else {
                            slotClasses = "bg-white text-gray-800 border border-gray-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";
                        }

                        return (
                            <button
                                key={slot}
                                onClick={() => !isDisabled && setSelectedTime(slot)}
                                className={`${baseClasses} ${slotClasses}`}
                                disabled={isDisabled}
                            >
                                {slot}
                                <span className={`text-xs block mt-0.5 font-normal ${booked ? 'text-red-600' : past ? 'text-gray-500' : isSelected ? 'text-white' : 'text-green-600'}`}>
                                    {statusLabel}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}