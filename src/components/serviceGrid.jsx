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
                return "bg-gray-100 text-gray-700 border-gray-300";
            case "inactive":
                return "bg-white text-gray-400 border-gray-200";
            case "pending":
                return "bg-gray-200 text-gray-600 border-gray-300";
            default:
                return "bg-gray-200 text-gray-600 border-gray-300";
        }
    };

    const activeServices = services.filter(s => s.status?.toLowerCase() === "active");
    const otherServices = services.filter(s => s.status?.toLowerCase() !== "active");
    const sortedServices = [...activeServices, ...otherServices];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 py-8 mx-auto">
            {sortedServices.map((service, index) => {
                const serviceId = getId(service);
                const isSelected = selectedServices.some((s) => getId(s) === serviceId);
                const isActive = service.status?.toLowerCase() === "active";
                const cursorClass = isActive ? "cursor-pointer" : "cursor-not-allowed";

                // --- ASSUMED IMAGE URL PROPERTY ---
                const imageUrl = service.imageUrl || '/Haircutsoon.jpg';
                // ----------------------------------

                return (
                    <motion.div
                        key={serviceId}
                        onClick={() => toggleService(service)}
                        className={`
                            relative flex flex-col p-6 rounded-xl transition-all duration-300 min-h-[250px] overflow-hidden 
                            text-white 
                            shadow-md border border-gray-900 
                            hover:shadow-xl hover:border-gray-700
                            ${!isActive && "opacity-60"} 
                            ${cursorClass}
                        `}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={isActive ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                    >

                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
                            style={{
                                backgroundImage: `url(${imageUrl})`,

                                transform: isActive ? 'scale(1)' : 'scale(1)',
                            }}

                            {...(isActive && { whileHover: { scale: 1.05 } })}
                        >
                        </div>


                        <div
                            className={`absolute inset-0 z-[1] transition-all duration-300 rounded-xl
                                ${isSelected
                                    ? "bg-black/80"
                                    : "bg-black/60 hover:bg-black/70"
                                }
                            `}
                        ></div>


                        <div className="relative z-20 flex flex-col gap-3 flex-grow">

                            {/* Checkmark */}
                            {isSelected && isActive && (
                                <FaCheckCircle className="absolute top-0 right-0 text-white text-2xl drop-shadow-lg" />
                            )}

                            {/* Service Details */}
                            <h3 className={`text-2xl font-bold uppercase tracking-wide mt-4 ${isSelected ? "text-white" : "text-gray-100"}`}>
                                {getName(service)}
                            </h3>

                            <p className={`text-lg font-medium ${isSelected ? "text-gray-200" : "text-gray-300"}`}>
                                Price: <span className="font-extrabold">

                                    {service.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}

                                </span>
                            </p>

                            {service.description && (
                                <p className={`text-sm mt-1 line-clamp-3 ${isSelected ? "text-gray-400" : "text-gray-300"}`}>
                                    {service.description}
                                </p>
                            )}
                        </div>

                        {/* Status Badge */}
                        {service.status && (
                            <span
                                className={`relative z-20 text-xs font-semibold px-3 py-1 mt-4 rounded-full self-start border 
                                    ${getStatusClasses(service.status).replace('bg-gray-100', 'bg-white').replace('text-gray-700', 'text-black')}
                                `}
                            >
                                {service.status}
                            </span>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}