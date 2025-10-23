import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ServiceGrid({ services, selectedServices, setSelectedServices }) {
    const getId = (service) => service._id || service.id;
    const getName = (service) => service.subName || service.name || service.title;

    const toggleService = (service) => {
        if (service.status?.toLowerCase() !== "active") return;
        const serviceId = getId(service);

        if (selectedServices.some((s) => getId(s) === serviceId)) {
            setSelectedServices(selectedServices.filter((s) => getId(s) !== serviceId));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-700 border-green-300";
            case "inactive":
                return "bg-gray-200 text-gray-500 border-gray-300";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            default:
                return "bg-gray-200 text-gray-500 border-gray-300";
        }
    };

    const activeServices = services.filter(s => s.status?.toLowerCase() === "active");
    const otherServices = services.filter(s => s.status?.toLowerCase() !== "active");
    const sortedServices = [...activeServices, ...otherServices];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-8 w-full max-w-7xl px-3 md:px-4 py-6 md:py-8 mx-auto">
            {sortedServices.map((service, index) => {
                const serviceId = getId(service);
                const isSelected = selectedServices.some((s) => getId(s) === serviceId);
                const isActive = service.status?.toLowerCase() === "active";
                const cursorClass = isActive ? "cursor-pointer" : "cursor-not-allowed";
                const imageUrl = service.imageUrl || "/cardImage.jpg";

                return (
                    <motion.div
                        key={serviceId}
                        onClick={() => toggleService(service)}
                        className={`relative bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 
                            transition-all hover:shadow-lg hover:border-gray-300
                            ${!isActive && "opacity-60"} ${cursorClass}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={isActive ? { scale: 1.02 } : {}}
                    >
                        {/* Top Image */}
                        <div className="w-full h-28 sm:h-32 md:h-36 lg:h-40 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}></div>

                        {/* Bottom Section */}
                        <div className="p-3 sm:p-4">
                            {isSelected && isActive && (
                                <FaCheckCircle className="absolute top-2 right-2 text-red-500 text-xl sm:text-2xl" />
                            )}

                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 line-clamp-1">
                                {getName(service)}
                            </h3>

                            <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mt-1">
                                {service.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>

                            {service.description && (
                                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {service.description}
                                </p>
                            )}

                            {service.status && (
                                <span className={`text-[9px] sm:text-xs font-semibold px-2 py-1 mt-2 inline-block rounded-full border ${getStatusClasses(service.status)}`}>
                                    {service.status}
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
