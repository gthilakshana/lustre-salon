import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/header";
import ServiceGrid from "../components/serviceGrid";
import Calendar from "../components/calender";
import TimeSlots from "../components/timeSlots";
import Tabs from "../components/tabs";
import Cart from "../components/cart";
import Footer from "../components/footer";

export default function DateAndTimeSelect() {
    const location = useLocation();
    const state = location.state || {}; // fallback
    const { employee: employeeName, title, price } = state;

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const [activeTab, setActiveTab] = useState("haircuts");
    const [selectedServices, setSelectedServices] = useState([]);
    const [step, setStep] = useState("select");


    const stylistName = employeeName ? decodeURIComponent(employeeName) : "Unnamed Stylist";

    const displayInfo =
        selectedServices.length > 0
            ? `${stylistName} : ${selectedServices.map((s) => s.title).join(" , ")}`
            : null;

    const handleAddToCart = () => {
        if (!selectedServices.length || !selectedDate || !selectedTime || !selectedGender) {
            alert("Please select at least one service, date/time, and gender.");
            return;
        }

        const newItems = selectedServices.map((service) => ({
            id: Date.now() + service.id,
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
                        item.title === newItem.title &&
                        item.date === newItem.date &&
                        item.time === newItem.time &&
                        item.gender === newItem.gender &&
                        item.stylist === newItem.stylist
                )
        );

        if (!filtered.length) {
            alert("These services are already in the cart for the selected date/time, gender, and stylist.");
            return;
        }

        setCartItems([...cartItems, ...filtered]);
        setStep("cart");
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (title) {
            setSelectedServices([{ title, price }]);
            setStep("select");
        }
    }, [title, price]);

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
            { id: 14, title: "Ladies’ Full Hair Root Touch-Ups", price: "7000.00 LKR" },
            { id: 15, title: "Gents’ Root Touch-Up", price: "3500.00 LKR" },
            { id: 16, title: "Ladies crown hair root touch up", price: "5000.00 LKR" },
            { id: 17, title: "Ladies’ Hair Fringe Touch-Up", price: "3000.00 LKR" },
            { id: 18, title: "Fashion Hair Color Lines", price: "3000.00 LKR" },
        ],
        chemical: [
            { id: 19, title: "Ladies' Hair Rebounding", price: "14000.00 LKR" },
            { id: 20, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 21, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 22, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 23, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 24, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 25, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 26, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 27, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { id: 28, title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
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
                            <button className="px-8 py-4 text-sm font-semibold bg-black text-white transition-colors duration-300">
                                Confirm Payment
                            </button>
                        </div>
                    </div>

                    <div className="w-full p-10 bg-white/90 backdrop-blur-md shadow-xl text-center flex flex-col items-center h-full">

                        <div className="w-full flex justify-end items-center mb-6">
                            {displayInfo ? (
                                <div className="flex items-center px-4 py-2 space-x-4 transition">
                                    <h2 className="text-sm text-gray-800 ">
                                        {displayInfo}
                                    </h2>
                                </div>
                            ) : (
                                <h2 className="text-sm text-gray-500">No stylist selected yet</h2>
                            )}
                        </div>

                        <div className="w-full min-h-screen flex flex-col justify-between items-center">

                            {step === "select" && (
                                <motion.div
                                    className="w-full flex flex-col items-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2
                                        className="text-3xl font-bold mb-4 uppercase"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        Select Service
                                    </motion.h2>

                                    <motion.span
                                        className="text-md text-gray-500 mb-9 text-center max-w-4xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nihil vero assumenda reiciendis, error quaerat quidem commodi fugit explicabo. Optio odio nulla similique ad molestiae ab debitis necessitatibus reprehenderit harum.
                                    </motion.span>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <ServiceGrid
                                            services={services[activeTab]}
                                            selectedServices={selectedServices}
                                            setSelectedServices={setSelectedServices}
                                        />
                                    </motion.div>

                                    {selectedServices.length > 0 && (
                                        <motion.div
                                            className="w-[80%] flex flex-col items-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                        >
                                            <div className="w-full flex justify-end mt-6">
                                                <button
                                                    onClick={() => setStep("datetime")}
                                                    className="flex px-8 py-2 rounded-full bg-black w-[200px] h-[40px] font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                                >
                                                    Confirm Selection
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}


                            {step === "datetime" && (
                                <motion.div
                                    className="w-[90%]  p-6 mt-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2
                                        className="text-3xl font-bold mb-4 uppercase"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        Pick Date & Time
                                    </motion.h2>

                                    <motion.p
                                        className="mb-4 mt-6 text-black text-lg"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        <strong className="text-lg font-bold text-red-500">
                                            Services:&nbsp;
                                        </strong>
                                        {selectedServices.length > 0
                                            ? selectedServices.map((s) => `${s.title} – ${s.price}`).join(", ")
                                            : "No service selected"}
                                    </motion.p>

                                    <motion.div
                                        className="flex flex-col md:flex-row gap-6 w-full mx-auto mt-10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                                        <TimeSlots
                                            selectedTime={selectedTime}
                                            setSelectedTime={setSelectedTime}
                                            selectedGender={selectedGender}
                                            setSelectedGender={setSelectedGender}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="flex w-full mt-6 items-center justify-between"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    >
                                        <button
                                            onClick={() => setStep("select")}
                                            className="flex items-center justify-center px-4 py-2 rounded-full bg-black w-12 h-12 font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                        >
                                            <FaArrowLeft size={20} />
                                        </button>

                                        <button
                                            onClick={handleAddToCart}
                                            className="px-8 py-2 rounded-full bg-black w-auto h-[40px] font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                        >
                                            Confirm Appointment
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}


                            {step === "cart" && (
                                <motion.div
                                    className="w-[90%]  p-6 mt-6 "
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <motion.h2
                                        className="text-3xl font-bold mb-4 uppercase"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        Confirm Appointment Payment
                                    </motion.h2>

                                    <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo recusandae ea, quae minima, iusto dolorem ducimus accusamus amet error commodi aspernatur architecto laboriosam nobis sed consequuntur impedit. Voluptatum, at illo?</span>

                                    <div className="w-full relative mt-6 h-[200px] rounded-md overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="banner.jpg"
                                            alt="Banner"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <p className="text-white text-center text-lg md:text-xl font-semibold bg-black/40 p-2 rounded">
                                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. At modi beatae quam voluptate sequi sit officia, fugit neque quia ducimus reiciendis aliquam aliquid labore laboriosam consequuntur nobis aperiam! Impedit, cumque.
                                            </p>
                                        </div>
                                        <div className="absolute bottom-4 right-4 w-[100px] h-[100px]">
                                            <img
                                                className="w-full h-full object-contain"
                                                src="LUSTRE.png"
                                                alt="Logo"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10">
                                        <Cart cartItems={cartItems} setCartItems={setCartItems} />
                                    </div>

                                    <motion.div
                                        className="flex w-full mt-6 items-center justify-between"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    >
                                        <button
                                            onClick={() => setStep("datetime")}
                                            className="flex items-center justify-center px-4 py-2 rounded-full bg-black w-12 h-12 font-medium text-white shadow cursor-pointer hover:bg-red-500 hover:text-white transition"
                                        >
                                            <FaArrowLeft size={20} />
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
