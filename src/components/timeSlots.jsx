import { FaMale, FaFemale } from "react-icons/fa";

export default function TimeSlots({
    selectedTime,
    setSelectedTime,
    selectedGender,
    setSelectedGender,
    bookedAppointments = [],
    selectedDate
}) {
    const times = [
        "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "12:00 PM",
        "1:00 PM", "1:45 PM", "2:30 PM", "3:15 PM", "4:00 PM", "4:45 PM"
    ];

    const getTimeStatus = (time) => {
        const appointment = bookedAppointments.find(
            a => a.date === selectedDate && a.time === time
        );
        return appointment ? appointment.status : "Available"; // Pending / Completed / Available
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md w-full flex flex-col gap-4">
            <h3 className="font-medium mb-3 text-base sm:text-lg">Select your time</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {times.map((time) => {
                    const status = getTimeStatus(time);
                    const isSelected = selectedTime === time;

                    return (
                        <button
                            key={time}
                            onClick={() => status === "Available" && setSelectedTime(time)}
                            className={`py-2 px-3 text-sm sm:text-base border rounded-full transition 
                                ${isSelected ? "bg-blue-500 text-white border-blue-500" :
                                    status === "Pending" ? "bg-yellow-200 text-yellow-800 cursor-not-allowed" :
                                        status === "Completed" ? "bg-gray-300 text-gray-600 cursor-not-allowed" :
                                            "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                                }`}
                            disabled={status !== "Available"}
                        >
                            {time} {status !== "Available" ? `(${status})` : ""}
                        </button>
                    );
                })}
            </div>

            <h3 className="font-semibold mt-4 text-base sm:text-lg">For whom is the appointment being made?</h3>
            <div className="flex flex-col-4 sm:flex-row gap-4 justify-center items-center">
                <button
                    onClick={() => setSelectedGender("Gents")}
                    className={`flex flex-col items-center p-3 border rounded-lg transition cursor-pointer
                    ${selectedGender === "Gents" ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
                >
                    <FaMale
                        size={36}
                        className={`${selectedGender === "Gents" ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span className={`${selectedGender === "Gents" ? "text-blue-600" : "text-gray-500"} font-medium text-sm sm:text-base`}>
                        Gents
                    </span>
                </button>

                <button
                    onClick={() => setSelectedGender("Ladies")}
                    className={`flex flex-col items-center p-3 border rounded-lg transition cursor-pointer
                    ${selectedGender === "Ladies" ? "border-pink-500 bg-pink-100" : "border-gray-300 bg-white"}`}
                >
                    <FaFemale
                        size={36}
                        className={`${selectedGender === "Ladies" ? "text-pink-500" : "text-gray-400"}`}
                    />
                    <span className={`${selectedGender === "Ladies" ? "text-pink-600" : "text-gray-500"} font-medium text-sm sm:text-base`}>
                        Ladies
                    </span>
                </button>
            </div>
        </div>
    );
}
