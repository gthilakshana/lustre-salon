// components/TimeSlots.jsx

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaMale, FaFemale, FaArrowRight, FaClock, FaUsers } from "react-icons/fa";

dayjs.extend(customParseFormat);

// ----------------------------------------------------------------------
// MOCK DATA & CONSTANTS
// ----------------------------------------------------------------------

const allTimeSlots = [
    "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM",
    "12:00 PM", "1:00 PM", "1:45 PM", "2:30 PM",
    "3:15 PM", "4:00 PM", "4:45 PM", "5:30 PM",
];
const SLOT_DURATION_MINUTES = 45;

// ----------------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------------

const isSlotInPast = (selectedDate, slotTime) => {
    if (!selectedDate) return true;
    const slotDateTime = dayjs(`${selectedDate} ${slotTime}`, "YYYY-MM-DD h:mm A");
    const currentDateTime = dayjs();
    return slotDateTime.isBefore(currentDateTime.subtract(1, "minute"));
};

const getBlockingStylists = (selectedDate, slotTime, bookingsArray) => {
    if (!selectedDate || !slotTime || bookingsArray.length === 0) return [];

    const slotDateTime = dayjs(`${selectedDate} ${slotTime}`, "YYYY-MM-DD h:mm A");
    const slotEndTime = slotDateTime.add(SLOT_DURATION_MINUTES, "minutes");
    const blockingStatuses = ["Pending", "Ongoing", "Confirmed"];

    const conflictingBookings = bookingsArray.filter((booking) => {
        if (!booking.time || !booking.stylistName || !booking.status || !blockingStatuses.includes(booking.status)) return false;

        let bookingEndTimeString = booking.endTime;
        if (!booking.endTime) {
            const tempStartTime = dayjs(booking.time, "h:mm A");
            bookingEndTimeString = tempStartTime.add(SLOT_DURATION_MINUTES, "minutes").format("h:mm A");
        }

        const bookingStartTime = dayjs(`${selectedDate} ${booking.time}`, "YYYY-MM-DD h:mm A");
        const bookingEndTime = dayjs(`${selectedDate} ${bookingEndTimeString}`, "YYYY-MM-DD h:mm A");

        return slotDateTime.isBefore(bookingEndTime) && slotEndTime.isAfter(bookingStartTime);
    });

    return conflictingBookings.map((b) => ({
        name: b.stylistName,
        normalizedName: b.stylistName.toLowerCase(),
        status: b.status,
    }));
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function TimeSlots({
    selectedTime,
    setSelectedTime,
    selectedGender,
    setSelectedGender,
    selectedDate,
    stylistName,
    setStylistName,
    bookedAppointments = [],
}) {
    const [uiSelectedTime, setUiSelectedTime] = useState(selectedTime);
    const [showStylistOptions, setShowStylistOptions] = useState(false);

    useEffect(() => {
        setUiSelectedTime(selectedTime);
    }, [selectedTime]);


    const handleSlotClick = (slot) => {
        const past = isSlotInPast(selectedDate, slot);
        if (past) return;

        const blockingBookings = getBlockingStylists(selectedDate, slot, bookedAppointments);
        const bookedStylistNames = blockingBookings.map((b) => b.normalizedName);


        setUiSelectedTime(slot);
        setSelectedTime(slot);
        setShowStylistOptions(true);


        if (stylistName && bookedStylistNames.includes(stylistName.toLowerCase())) {
            setSelectedTime(null);
        }
    };

    // Stylist list
    const stylists = ["William", "Liam", "Emma", "Sophia"];


    const bookedStylists = selectedDate && uiSelectedTime
        ? getBlockingStylists(selectedDate, uiSelectedTime, bookedAppointments).map((b) => b.normalizedName)
        : [];

    return (
        <div className="bg-white w-full shadow-2xl p-6 sm:p-8 transition-all duration-300">
            <div className="w-full mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    {selectedDate
                        ? new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })
                        : "Select Date"}
                </h3>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-3">
                {/* Left Section: Time Slots */}
                <div className="lg:w-3/5 w-full flex flex-col border lg:border-r border-gray-200 p-4 lg:p-5 rounded-xl">

                    <div className="mb-6">
                        <h4 className="text-lg font-arial text-gray-700 mb-3">Select Service Type</h4>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedGender("Gents")}
                                className={`p-4 w-[60px] h-[60px] flex items-center justify-center rounded-xl border transition-all duration-300 ${selectedGender === "Gents"
                                    ? "bg-blue-600 text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
                                    }`}
                            >
                                <FaMale size={30} />
                            </button>
                            <button
                                onClick={() => setSelectedGender("Ladies")}
                                className={`p-4 w-[60px] h-[60px] flex items-center justify-center rounded-xl border transition-all duration-300 ${selectedGender === "Ladies"
                                    ? "bg-pink-500 text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-pink-50"
                                    }`}
                            >
                                <FaFemale size={30} />
                            </button>
                        </div>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                        Select Time Slot for{" "}
                        <span className="text-blue-600 font-bold text-sm">{stylistName || "Stylist"}</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allTimeSlots.map((slot) => {
                            const past = isSlotInPast(selectedDate, slot);
                            const blockingStylists = getBlockingStylists(selectedDate, slot, bookedAppointments);
                            const bookedForSelectedStylist =
                                stylistName &&
                                blockingStylists.map((b) => b.normalizedName).includes(stylistName.toLowerCase());
                            const isSelected = selectedTime === slot;

                            const base = "cursor-pointer rounded-md text-xs font-medium py-3 flex flex-col items-center transition-all duration-200 text-center";
                            let style = "";
                            let text = "";

                            if (past) {
                                style = "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200";
                                text = "Past";
                            } else if (blockingStylists.length > 0) {
                                style = "bg-red-100 text-red-700 border-2 border-red-400 hover:scale-[1.02]";
                                text = "Booked";
                            } else if (isSelected) {
                                style = "bg-blue-600 text-white border-2 border-blue-700 shadow-lg scale-[1.05]";
                                text = "Selected";
                            } else {
                                style = "bg-white text-gray-800 border border-gray-300 hover:bg-green-50 hover:border-green-400";
                                text = "Available";
                            }

                            return (
                                <button
                                    key={slot}
                                    onClick={() => handleSlotClick(slot)}
                                    disabled={past}
                                    className={`${base} ${style}`}
                                >
                                    <span className="text-sm">{slot}</span>
                                    <span className="text-xs mt-1 opacity-80">{text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Section: Stylist Options */}
                <div className="lg:w-2/5 w-full flex flex-col mt-5">
                    <h4 className="text-lg font-arial justify-center text-gray-800 mb-4 flex items-center">Stylist Options</h4>

                    <div className="flex justify-center items-center w-full">
                        {showStylistOptions ? (
                            <div className="grid  grid-cols-2  gap-4 w-full p-2 border-gray-200 bg-white shadow-sm rounded-xl border">
                                {stylists.map((stylist) => {
                                    const stylistImages = {
                                        William: "/William.jpg",
                                        Liam: "/Liam.jpg",
                                        Emma: "/Emma.jpg",
                                        Sophia: "/Sophia.jpg",
                                    };
                                    const isBooked = bookedStylists.includes(stylist.toLowerCase());
                                    const isSelected = stylistName === stylist;

                                    let cardClass =
                                        "relative overflow-hidden group border-2 justify-center items-center cursor-pointer rounded-xl w-full transition-all duration-300 flex flex-col";

                                    if (isSelected) cardClass += " border-blue-600 shadow-xl ring-4 ring-blue-200";
                                    else if (isBooked) cardClass += " border-gray-200 opacity-60 cursor-not-allowed";
                                    else cardClass += " border-gray-300 hover:border-blue-400 hover:shadow-lg";

                                    return (
                                        <div className="flex justify-center items-center w-full" key={stylist}>
                                            <button
                                                disabled={isBooked}
                                                onClick={() => setStylistName(stylist)}
                                                className={cardClass}
                                                style={{ backgroundColor: isSelected ? "#F0F8FF" : "#F9F9F9" }}
                                            >
                                                <div className="w-full aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={stylistImages[stylist]}
                                                        alt={stylist}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div
                                                    className={`p-2 text-center text-sm font-semibold ${isBooked ? "text-gray-500" : "text-gray-800"
                                                        }`}
                                                >
                                                    {stylist}
                                                    {isBooked && (
                                                        <span className="block text-xs text-red-500 font-normal">(Booked)</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 border border-black/10 pointer-events-none"></div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-gray-200 w-full min-h-[300px] sm:min-h-[400px]">
                                <p className="text-sm text-gray-700 max-w-xs">
                                    Click a time slot to see stylist options.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}
