import { FaMale, FaFemale } from "react-icons/fa";
import { useState } from "react";

export default function TimeSlots() {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);

    const times = [
        "9:00 AM",
        "9:45 AM",
        "10:30 AM",
        "11:15 AM",
        "12:00 PM",
        "1:00 PM",
        "1:45 PM",
        "2:30 PM",
        "3:15 PM",
        "4:00 PM",
        "4:45 PM",
    ];

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md w-full flex flex-col gap-4">
            <h3 className="font-bold mb-3">Select your time</h3>
            <div className="grid grid-cols-4 gap-2">
                {times.map((time) => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 border cursor-pointer rounded-full transition ${selectedTime === time
                            ? "bg-blue-500 text-white"
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
                            : "border-gray-300 hover:bg-blue-50"
                        }`}
                >
                    <div
                        className={`mb-1 transition ${selectedGender === "Gents" ? "text-blue-500" : "text-blue-200"
                            }`}
                    >
                        <FaMale size={48} />
                    </div>
                    <span
                        className={`font-medium transition ${selectedGender === "Gents" ? "text-blue-600" : "text-blue-500"
                            }`}
                    >
                        Gents
                    </span>
                </button>


                <button
                    onClick={() => setSelectedGender("Ladies")}
                    className={`flex flex-col items-center p-3 border rounded-lg transition cursor-pointer
            ${selectedGender === "Ladies"
                            ? "border-pink-500 bg-pink-100"
                            : "border-gray-300 hover:bg-pink-50"
                        }`}
                >
                    <div
                        className={`mb-1 transition ${selectedGender === "Ladies" ? "text-pink-500" : "text-pink-200"
                            }`}
                    >
                        <FaFemale size={48} />
                    </div>
                    <span
                        className={`font-medium transition ${selectedGender === "Ladies" ? "text-pink-600" : "text-pink-500"
                            }`}
                    >
                        Ladies
                    </span>
                </button>
            </div>
        </div>
    );
}
