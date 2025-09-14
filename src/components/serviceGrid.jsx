import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ServiceGrid({ services, selectedService, setSelectedService }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl p-4">
            {services.map((service, index) => (
                <motion.div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`cursor-pointer relative flex flex-col justify-center items-center text-center p-4 border transition-all duration-300
                        ${selectedService?.id === service.id
                            ? "bg-blue-500 text-white shadow-lg scale-105"
                            : "bg-white text-gray-800 hover:bg-gray-100"
                        }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    {selectedService?.id === service.id && (
                        <FaCheckCircle className="absolute top-2 right-2 text-white text-lg" />
                    )}

                    <h3 className="font-medium text-sm md:text-base leading-tight">
                        {service.title}
                    </h3>
                    <p className="text-xs md:text-sm mt-1">{service.price}</p>
                </motion.div>
            ))}
        </div>
    );
}
