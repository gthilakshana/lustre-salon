import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { motion } from "framer-motion";
import axios from "axios";

import toast from "react-hot-toast";
import Header from "../components/header";
import ServiceGrid from "../components/serviceGrid";
import Calendar from "../components/calender";
import TimeSlots from "../components/timeSlots";
import Tabs from "../components/tabs";
import Cart from "../components/cart";
import Footer from "../components/footer";

export default function DateAndTimeSelect() {
    const location = useLocation();
    const state = location.state || {};
    const { employee: employeeName, title, price } = state;
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [cartItems, setCartItems] = useState([]);


    const [selectedServices, setSelectedServices] = useState([]);
    const [step, setStep] = useState("select");
    const [services, setServices] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [activeTab, setActiveTab] = useState("All");


    const stylistName = employeeName
        ? decodeURIComponent(employeeName)
        : "Unnamed Stylist";

    const displayInfo =
        selectedServices.length > 0
            ? `${stylistName} : ${selectedServices
                .map((s) => s.name || s.subName)
                .join(" , ")}`
            : null;




    // Tabs
    const tabs = [
        { id: "All", label: "All" },
        { id: "Haircuts & Styling", label: "Haircuts & Styling" },
        { id: "Hair Color Services", label: "Hair Color Services" },
        { id: "Ladies hair chemical services", label: "Ladies hair chemical services" },
        { id: "Hair extension services", label: "Hair extension services" },
    ];

    // Fetch services from backend
    const fetchServices = async () => {
        try {
            setFetching(true);
            const baseURL = import.meta.env.VITE_API_URL || "";
            const res = await axios.get(`${baseURL}/api/services`);
            setServices(res.data);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            toast.error("Failed to load services");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (title) {
            setSelectedServices([{ name: title, price }]);
            setStep("select");
        }
    }, [title, price]);



    const handleAddToCart = () => {
        if (
            !selectedServices.length ||
            !selectedDate ||
            !selectedTime ||
            !selectedGender
        ) {
            toast.error("Please select at least one service, date/time, and gender.");
            return;
        }

        const newItems = selectedServices.map((service) => ({
            id: Date.now() + (service._id || service.id),
            ...service,
            date: selectedDate,
            time: selectedTime,
            gender: selectedGender,
            stylist: stylistName,
        }));

        const filtered = newItems.filter(
            (newItem) =>
                !cartItems.some(
                    (item) =>
                        (item.name || item.title) === (newItem.name || newItem.title) &&
                        item.date === newItem.date &&
                        item.time === newItem.time &&
                        item.gender === newItem.gender &&
                        item.stylist === newItem.stylist
                )
        );

        if (!filtered.length) {
            toast.error(
                "These services are already in the cart for the selected date/time, gender, and stylist."
            );
            return;
        }

        setCartItems([...cartItems, ...filtered]);
        setStep("cart");
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (title) {
            setSelectedServices([{ name: title, price }]);
            setStep("select");
        }
    }, [title, price]);


    return (
        <>
            <Header />

            <div
                className="w-full pt-20 min-h-screen flex flex-col items-center justify-start relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/appointment-bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    {/* --- Steps Header --- */}
                    <div className="w-full flex justify-center py-12">
                        <div className="flex bg-white shadow-lg overflow-hidden">

                            <button
                                className={`px-8 py-4 text-sm cursor-pointer font-semibold border-r transition-colors duration-300 flex items-center justify-center 
                                  ${step === "barber" ? "bg-black text-white" : "bg-white text-black"}`}
                                onClick={() => navigate("/appointment")}
                            >

                                <span
                                    className={`sm:hidden w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                                 ${step === "barber" ? "bg-black text-white" : "bg-black text-white"}`}
                                >
                                    1
                                </span>

                                <span className="hidden sm:inline">Select Barber</span>
                            </button>


                            <button
                                className={`px-8 py-4 text-sm cursor-pointer font-semibold border-r transition-colors duration-300 flex items-center justify-center 
                                 ${step === "select" ? "bg-black text-white" : "bg-white text-black"}`}
                                onClick={() => setStep("select")}
                            >
                                <span
                                    className={`sm:hidden w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                                ${step === "select" ? "bg-black text-white" : "bg-black text-white"}`}
                                >
                                    2
                                </span>
                                <span className="hidden sm:inline">Select Service</span>
                            </button>


                            <button
                                className={`px-8 py-4 text-sm cursor-pointer font-semibold border-r transition-colors duration-300 flex items-center justify-center 
                                ${step === "datetime" ? "bg-black text-white" : "bg-white text-black"}`}
                                onClick={() => setStep("datetime")}
                            >
                                <span
                                    className={`sm:hidden w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                                ${step === "datetime" ? "bg-black text-white" : "bg-black text-white"}`}
                                >
                                    3
                                </span>
                                <span className="hidden sm:inline">Pick Date & Time</span>
                            </button>


                            <button
                                className={`px-8 py-4 text-sm cursor-pointer font-semibold transition-colors duration-300 flex items-center justify-center 
                               ${step === "cart" ? "bg-black text-white" : "bg-white text-black"}`}
                                onClick={() => setStep("cart")}
                            >
                                <span
                                    className={`sm:hidden w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                               ${step === "cart" ? "bg-black text-white" : "bg-black text-white"}`}
                                >
                                    4
                                </span>
                                <span className="hidden sm:inline">Confirm Payment</span>
                            </button>
                        </div>
                    </div>


                    {/* --- Main Content --- */}
                    <div className="w-full p-10 bg-white/90 backdrop-blur-md shadow-xl text-center flex flex-col items-center h-full">

                        <div className="w-full flex justify-end items-center mb-6">
                            {displayInfo ? (
                                <div className="flex items-center px-4 py-2 space-x-4 transition">
                                    <h2 className="text-sm text-gray-800 ">{displayInfo}</h2>
                                </div>
                            ) : (
                                <h2 className="text-sm text-gray-500">No stylist selected yet</h2>
                            )}
                        </div>

                        <div className="w-full min-h-screen flex flex-col justify-between items-center">
                            {/* Step: Select Service */}

                            {step === "select" && (
                                <motion.div
                                    className="w-full flex flex-col items-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2 className="text-3xl font-bold mb-4 uppercase">Select Service</motion.h2>

                                    <p className="mb-6">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                                    {/* Tabs */}
                                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                                    {/* Service Grid */}
                                    {fetching ? (
                                        <p>Loading services...</p>
                                    ) : (
                                        <ServiceGrid
                                            services={
                                                activeTab === "All"
                                                    ? services
                                                    : services.filter((s) => s.serviceName === activeTab)
                                            }
                                            selectedServices={selectedServices}
                                            setSelectedServices={setSelectedServices}
                                        />
                                    )}

                                    {/* Confirm Button */}
                                    {selectedServices.length > 0 && (
                                        <div className="w-full flex justify-end mt-6">
                                            <button
                                                onClick={() => setStep("datetime")}
                                                className="flex px-8 py-2 items-center justify-center rounded bg-red-500 w-auto h-[50px] font-medium text-white shadow cursor-pointer hover:bg-red-600 hover:text-white transition"
                                            >
                                                Confirm Selection
                                                <HiArrowRight className="ml-2 w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step: Pick Date & Time */}
                            {step === "datetime" && (
                                <motion.div
                                    className="w-full sm:w-full md:w-[90%] p-4 sm:p-6 mt-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2
                                        className="text-2xl sm:text-3xl font-bold mb-4 uppercase"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        Pick Date & Time
                                    </motion.h2>

                                    <p className="mb-6 text-sm sm:text-base">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>

                                    <motion.div
                                        className="flex flex-col md:flex-row gap-4 md:gap-6 w-full mx-auto mt-6 md:mt-10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <Calendar
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                        />
                                        <TimeSlots
                                            selectedTime={selectedTime}
                                            setSelectedTime={setSelectedTime}
                                            selectedGender={selectedGender}
                                            setSelectedGender={setSelectedGender}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="flex flex-col sm:flex-row w-full mt-4 sm:mt-6 items-center justify-between gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    >
                                        <button
                                            onClick={() => setStep("select")}
                                            className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black w-10 sm:w-12 h-10 sm:h-12 font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                        >
                                            <FaArrowLeft size={16} sm={20} />
                                        </button>

                                        <button
                                            onClick={handleAddToCart}
                                            className="flex items-center justify-center px-4 sm:px-8 py-2 sm:py-2.5 rounded bg-red-500 h-[45px] sm:h-[50px] w-full sm:w-auto font-medium text-white shadow cursor-pointer hover:bg-red-600 transition"
                                        >
                                            Confirm Appointment
                                            <HiCheck className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}


                            {/* Step: Cart */}
                            {step === "cart" && (
                                <motion.div
                                    className="w-full sm:w-[90%] p-4 sm:p-6 mt-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2
                                        className="text-2xl sm:text-3xl font-bold mb-4 uppercase"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        Confirm Appointment Payment
                                    </motion.h2>

                                    <span className="text-sm sm:text-base">
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo
                                        recusandae ea, quae minima, iusto dolorem ducimus accusamus
                                        amet error commodi aspernatur architecto laboriosam nobis sed
                                        consequuntur impedit.
                                    </span>

                                    <div className="w-full relative mt-6 h-[180px] sm:h-[200px] rounded-md overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="banner.jpg"
                                            alt="Banner"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                                            <p className="text-white text-center text-sm sm:text-lg md:text-xl font-semibold bg-black/40 p-1 sm:p-2 rounded">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
                                            </p>
                                        </div>
                                        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-[80px] sm:w-[100px] h-[80px] sm:h-[100px]">
                                            <img
                                                className="w-full h-full object-contain"
                                                src="LUSTRE.png"
                                                alt="Logo"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-10">
                                        <Cart cartItems={cartItems} setCartItems={setCartItems} />
                                    </div>

                                    <motion.div
                                        className="flex w-full mt-4 sm:mt-6 items-center justify-between"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    >
                                        <button
                                            onClick={() => setStep("datetime")}
                                            className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black w-10 sm:w-12 h-10 sm:h-12 font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                        >
                                            <FaArrowLeft size={16} sm={20} />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
