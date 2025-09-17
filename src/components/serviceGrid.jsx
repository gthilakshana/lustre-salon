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
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-200 text-gray-600";
        }
    };


    const activeServices = services.filter(s => s.status?.toLowerCase() === "active");
    const otherServices = services.filter(s => s.status?.toLowerCase() !== "active");
    const sortedServices = [...activeServices, ...otherServices];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl p-4">
            {sortedServices.map((service, index) => {
                const serviceId = getId(service);
                const isSelected = selectedServices.some((s) => getId(s) === serviceId);

                const cursorClass = service.status?.toLowerCase() === "active"
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-60";

                return (
                    <motion.div
                        key={serviceId}
                        onClick={() => toggleService(service)}
                        className={`relative flex flex-col justify-between p-5 border  shadow hover:shadow-lg transition-all 
                            ${isSelected ? "bg-blue-600 text-white border-blue-500" : "bg-white text-gray-800 border-gray-200"}
                            ${cursorClass}
                        `}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        {isSelected && (
                            <FaCheckCircle className="absolute top-3 right-3 text-white text-xl" />
                        )}

                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{getName(service)}</h3>
                            <p className={`text-sm font-medium ${isSelected ? "text-white" : ""}`}>
                                Price: <span className="font-bold">{service.price.toLocaleString()} LKR</span>
                            </p>
                            {service.description && (
                                <p className={`text-xs line-clamp-3 ${isSelected ? "text-white" : "text-gray-600"}`}>
                                    {service.description}
                                </p>
                            )}
                            {service.status && (
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full self-start mt-2 
                                        ${isSelected ? "bg-white text-blue-500" : getStatusClasses(service.status)}
                                    `}
                                >
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
