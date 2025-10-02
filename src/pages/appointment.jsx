import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ServiceCard from "../components/serviceCard";

export default function Appointment() {
    const navigate = useNavigate();

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    //-----//


    const handleStylistSelect = (stylistName) => {

        navigate(`/dateAndTimeSelect`, {
            state: {
                employee: stylistName,
            },
        });
    };

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

                            <button className="px-8 py-4 text-sm font-semibold border-r bg-black text-white transition-colors duration-300 flex items-center justify-center">
                                <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                                    1
                                </span>
                                <span className="hidden sm:inline">Select Barber</span>
                            </button>


                            <button
                                onClick={() => navigate("/date-time-select")}
                                className="px-8 py-4 text-sm font-semibold border-r hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center"
                            >
                                <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                                    2
                                </span>
                                <span className="hidden sm:inline">Select Service</span>
                            </button>


                            <button
                                onClick={() => navigate("/date-time-select")}
                                className="px-8 py-4 text-sm font-semibold border-r hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center"
                            >
                                <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                                    3
                                </span>
                                <span className="hidden sm:inline">Pick Date &amp; Time</span>
                            </button>


                            <button
                                onClick={() => navigate("/date-time-select")}
                                className="px-8 py-4 text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center"
                            >
                                <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                                    4
                                </span>
                                <span className="hidden sm:inline">Confirm Payment</span>
                            </button>
                        </div>
                    </div>


                    <motion.div
                        className="w-full p-10 bg-white/90 backdrop-blur-md shadow-xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase">
                            Select LusTre Haircut Appointment or Salon Services
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-6xl mx-auto mb-10">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        </p>


                        <motion.div
                            className="flex flex-col items-center justify-center gap-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex flex-col items-center space-y-6 w-full px-4 md:px-0">
                                <h2 className="text-xl font-semibold text-black uppercase text-center">
                                    Choose Your Stylist
                                </h2>


                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">

                                    <div onClick={() => handleStylistSelect("Gavrawa Thialkshana")} className="cursor-pointer">
                                        <ServiceCard image="/founder.jpg" name="Gavrawa Thialkshana" />
                                    </div>
                                    <div onClick={() => handleStylistSelect("Thilakshana")} className="cursor-pointer">
                                        <ServiceCard image="/founder.jpg" name="Thilakshana" />
                                    </div>
                                    <div onClick={() => handleStylistSelect("Kaveen")} className="cursor-pointer">
                                        <ServiceCard image="/founder.jpg" name="Kaveen" />
                                    </div>
                                    <div onClick={() => handleStylistSelect("Nuvan")} className="cursor-pointer">
                                        <ServiceCard image="/founder.jpg" name="Nuvan" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>


                        <motion.div
                            className="flex flex-col items-center justify-center mt-[50px] gap-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="flex flex-col items-center space-y-8 w-full px-4 md:px-0">
                                <h2 className="text-xl md:text-xl font-semibold text-black uppercase text-center">
                                    Choose a Service
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 items-center justify-items-center gap-6 p-4 md:p-0 w-full md:w-auto">

                                    <ServiceCard image="/founder.jpg" title="LusTre Haircut" comingSoon />
                                    <div className="hidden sm:grid items-center justify-center h-full space-y-2">
                                        <div className="w-px h-8 bg-gray-300 mx-auto"></div>
                                        <span className="text-sm font-medium text-gray-500 text-center">OR</span>
                                        <div className="w-px h-8 bg-gray-300 mx-auto"></div>
                                    </div>
                                    <ServiceCard image="/founder.jpg" title="Wedding Appointment" comingSoon />
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>

            <Footer />
        </>
    );
}