import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import ServiceCard from "../components/serviceCard";

export default function Appointment() {
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
                            <button className="px-8 py-4 text-sm font-semibold border-r bg-black text-white transition-colors duration-300">
                                Select Barber
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold border-r hover:bg-black hover:text-white transition-colors duration-300">
                                Select Service
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold border-r hover:bg-black hover:text-white transition-colors duration-300">
                                Pick Date & Time
                            </button>
                            <button className="px-8 py-4 text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-300">
                                Confirm Payment
                            </button>
                        </div>
                    </div>

                    <motion.div
                        className="w-full p-10 bg-white/90 backdrop-blur-md shadow-xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            Select LusTre Haircut Appointment or Salon Services
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-6xl mx-auto mb-10">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                        </p>

                        <motion.div
                            className="flex flex-col md:flex-row items-start justify-center gap-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex flex-col items-center space-y-6">
                                <h2 className="text-xl font-semibold text-black uppercase">Choose Your Stylist</h2>
                                <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 cursor-pointer">
                                    <ServiceCard image="/founder.jpg" name="Gavrawa Thialkshana" />
                                    <ServiceCard image="/founder.jpg" name="Thilakshana" />
                                    <ServiceCard image="/founder.jpg" name="Kaveen" />
                                    <ServiceCard image="/founder.jpg" name="Nuvan" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex flex-col md:flex-row items-start justify-center mt-[50px] gap-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="flex flex-col items-center space-y-8">
                                <h2 className="text-xl font-semibold text-black uppercase">Choose a Service</h2>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="grid md:grid-cols-3 sm:grid-cols-3 items-center justify-items-center gap-6 p-4">
                                        <ServiceCard image="/founder.jpg" title="LusTre Haircut" comingSoon />
                                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                                            <div className="w-px h-8 bg-gray-300"></div>
                                            <span className="text-sm font-medium text-gray-500">OR</span>
                                            <div className="w-px h-8 bg-gray-300"></div>
                                        </div>
                                        <ServiceCard image="/founder.jpg" title="Wedding Appointment" comingSoon />
                                    </div>
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
