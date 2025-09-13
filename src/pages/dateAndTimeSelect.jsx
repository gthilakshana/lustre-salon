import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import ServiceGrid from "../components/serviceGrid";
import Calendar from "../components/calender";
import TimeSlots from "../components/timeSlots";
import Tabs from "../components/tabs";
import Footer from "../components/footer";

export default function DateAndTimeSelect() {
    const location = useLocation();
    const serviceFromState = location.state;
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");


    const [activeTab, setActiveTab] = useState("haircuts");
    const [selectedService, setSelectedService] = useState(null);
    const [step, setStep] = useState("select");
    const displayInfo = selectedService ? (selectedService.name || selectedService.title) : null;



    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (serviceFromState) {
            setSelectedService(serviceFromState);
            setStep("select");
        }
    }, [serviceFromState]);


    useEffect(() => {
        console.log("Selected service:", selectedService);
    }, [selectedService]);

    const services = {
        haircuts: [
            { id: 1, title: "Ladies’ long Haircuts", price: "8000.00 LKR" },
            { id: 2, title: "Bob cuts & pixie cuts", price: "9500.00 LKR" },
            { id: 3, title: "Ladies hair trim", price: "3000.00 LKR" },
            { id: 4, title: "Gents' Hair cuts (by Master Surith)", price: "2800.00 LKR" },
            { id: 5, title: "Gents' Haircuts (by assistant)", price: "1900.00 LKR" },
            { id: 6, title: "Beard Trimming", price: "1000.00 LKR" },
            { id: 7, title: "Beard shaving", price: "1200.00 LKR" },
            { id: 8, title: "Ladies' Temporary Hair settings", price: "3500.00 LKR" },
            { id: 9, title: "Gents' temporary hair settings (by assistant)", price: "1500.00 LKR" },
            { id: 10, title: "Beard color", price: "1000.00 LKR" },
        ],
        color: [
            { id: 11, title: "Master Surith’s Expert Hair Coloring", price: "30000.00 LKR" },
            { id: 12, title: "Senior Assistants’ Hair Coloring", price: "12000.00 LKR" },
            { id: 13, title: "Gents’ Hair Coloring Services", price: "5000.00 LKR" },
        ],
        chemical: [
            { id: 19, title: "Ladies' Hair Rebounding", price: "14000.00 LKR" },
            { id: 20, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
        ],
    };

    const tabs = [
        { id: "haircuts", label: "Haircuts" },
        { id: "color", label: "Color" },
        { id: "chemical", label: "Chemical" },
    ];

    return (
        <>
            <Header />

            <div
                className="w-full pt-20 min-h-screen flex flex-col items-center justify-start relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/appointment-bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 w-full flex flex-col items-center">

                    <div className="w-full flex justify-center py-12">
                        <div className="flex bg-white shadow-lg overflow-hidden">
                            <button className="px-8 py-4 text-sm font-semibold border-r hover:bg-black hover:text-white transition-colors duration-300">
                                Select Barber
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold border-r bg-black text-white transition-colors duration-300">
                                Select Service
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold border-r bg-black text-white transition-colors duration-300">
                                Pick Date & Time
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-300">
                                Confirm Payment
                            </button>
                        </div>
                    </div>

                    <div className="w-full p-10 bg-white/90 backdrop-blur-md shadow-xl text-center flex flex-col items-center h-full">

                        <div className="w-full flex justify-end items-center mb-6">
                            {displayInfo ? (
                                <div className="flex items-center px-4 py-2 space-x-4 transition">
                                    <h2 className="text-lg text-gray-800 font-semibold">
                                        {selectedService.name}
                                    </h2>
                                </div>
                            ) : (
                                <h2 className="text-lg text-gray-500">No stylist selected yet</h2>
                            )}
                        </div>






                        <div className="w-full h-[750px] flex flex-col items-center">
                            {step === "select" && (
                                <>
                                    <h2 className="text-3xl font-bold mb-4 uppercase">Select Service</h2>
                                    <span className="text-sm text-gray-500 mb-9">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque adipisci incidunt iusto beatae! Ea possimus eligendi sed laudantium recusandae laborum molestias nemo reiciendis labore quaerat, facere vitae! Harum, quaerat excepturi.</span>
                                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                                    <ServiceGrid
                                        services={services[activeTab]}
                                        selectedService={selectedService}
                                        setSelectedService={setSelectedService}
                                    />

                                    {selectedService && (
                                        <div className="w-full flex justify-end mt-6">
                                            <button
                                                onClick={() => setStep("datetime")}
                                                className="flex px-8 py-2 rounded-md bg-black w-[200px] h-[40px] font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                            >
                                                Confirm Selection
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {step === "datetime" && (
                                <div className="w-[80%]  h-[600px] p-6 mt-6 ">
                                    <h2 className="text-3xl font-bold mb-4 uppercase">Pick Date & Time</h2>
                                    <span className="text-sm text-gray-500 ">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque adipisci incidunt iusto beatae! Ea possimus eligendi sed laudantium recusandae laborum molestias nemo reiciendis labore quaerat, facere vitae! Harum, quaerat excepturi.</span>

                                    <p className="mb-4 mt-6 text-black text-lg">
                                        <strong className="text-lg font-bold text-red-500">Service: &nbsp; </strong>{"  "}
                                        {selectedService

                                            ? `${selectedService.title} – ${selectedService.price}`
                                            : "No service selected"}
                                    </p>


                                    <div className="flex flex-col md:flex-row gap-6 w-full mx-auto  mt-10">
                                        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                                        <TimeSlots selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

                                    </div>

                                    <div className="flex flex-col md:flex-row w-full mt-6">
                                        <div className="flex w-full justify-between">

                                            <button
                                                onClick={() => setStep("select")}
                                                className="px-8 py-2 rounded-md bg-black w-[200px] h-[40px] font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition">
                                                Back
                                            </button>


                                            <button
                                                onClick={() => setStep("payment")}
                                                className="px-8 py-2 rounded-md bg-black w-auto h-[40px] font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                            >
                                                Confirm Appointment
                                            </button>
                                        </div>
                                    </div>



                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
