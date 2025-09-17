import { FaMale, FaFemale } from "react-icons/fa";

export default function TimeSlots({ selectedTime, setSelectedTime, selectedGender, setSelectedGender }) {
    const times = [
        "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "12:00 PM",
        "1:00 PM", "1:45 PM", "2:30 PM", "3:15 PM", "4:00 PM", "4:45 PM"
    ];

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md w-full flex flex-col gap-4">
            <h3 className="font-medium mb-3">Select your time</h3>
            <div className="grid grid-cols-4 gap-2">
                {times.map((time) => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 border cursor-pointer rounded-full transition 
                            ${selectedTime === time
                                ? "bg-blue-500 text-white border-blue-500"
                                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            }`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <h3 className="font-semibold mt-4">For whom is the appointment being made?</h3>
            <div className="flex gap-4 justify-center items-center">
                <button
                    onClick={() => setSelectedGender("Gents")}
                    className={`flex flex-col items-center p-3 border rounded-lg transition cursor-pointer
                    ${selectedGender === "Gents"
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300 bg-white"
                        }`}
                >
                    <FaMale
                        size={48}
                        className={`${selectedGender === "Gents" ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span className={`${selectedGender === "Gents" ? "text-blue-600" : "text-gray-500"} font-medium`}>
                        Gents
                    </span>
                </button>

                <button
                    onClick={() => setSelectedGender("Ladies")}
                    className={`flex flex-col items-center p-3 border rounded-lg transition cursor-pointer
                    ${selectedGender === "Ladies"
                            ? "border-pink-500 bg-pink-100"
                            : "border-gray-300 bg-white"
                        }`}
                >
                    <FaFemale
                        size={48}
                        className={`${selectedGender === "Ladies" ? "text-pink-500" : "text-gray-400"}`}
                    />
                    <span className={`${selectedGender === "Ladies" ? "text-pink-600" : "text-gray-500"} font-medium`}>
                        Ladies
                    </span>
                </button>
            </div>
        </div>
    );
}
