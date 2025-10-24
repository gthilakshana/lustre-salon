import { toast, Toaster } from "react-hot-toast";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import SalonLogo from "/LUSTRE.png";

// --- Icon Map ---
const iconMap = {
    success: <CheckCircle size={20} className="text-green-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-400" />,
    error: <XCircle size={20} className="text-red-500" />,
};

// --- Toaster Component ---
export const LustreToaster = () => (
    <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
            duration: 3000,
            style: {
                fontFamily: "Inter, sans-serif, 'Helvetica Neue', Arial",
                maxWidth: "90vw",
                padding: "0",
            },
        }}
    />
);

// --- Toast Function ---
export const ShowToast = (type = "info", message = "", description = "", actions = []) => {
    return toast.custom((t) => {
        const Icon = iconMap[type] || iconMap.info;

        const pause = () => toast.pause(t.id);
        const resume = () => toast.resume(t.id);


        const headerColorClass = {
            success: "text-green-500",
            info: "text-blue-500",
            warning: "text-yellow-400",
            error: "text-red-500",
        }[type] || "text-gray-400";

        return (
            <div
                onMouseEnter={pause}
                onMouseLeave={resume}
                className={`${t.visible ? "animate-enter" : "animate-leave"} 
                    flex flex-col gap-2 w-[80vw] md:w-[90vw] max-w-sm p-4 sm:p-5 shadow-2xl bg-black text-white rounded-lg backdrop-blur-md`}
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">

                        <div className={`font-bold text-xs md:text-sm uppercase tracking-wide ${headerColorClass}`}>
                            Lustre Salon
                        </div>
                        <div className={`p-1.5 rounded-full ${headerColorClass}`}>
                            {Icon}
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.dismiss(t.id);
                        }}
                        className="text-white hover:text-red-500 transition-colors duration-200 p-1 -mt-1 -mr-1"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Message */}
                <div className="text-xs md:text-sm border-t border-white/20 pt-2 mt-1">
                    <div className="text-white font-medium">{message}</div>
                    {description && (
                        <div className="text-xs sm:text-sm text-gray-300 mt-1">{description}</div>
                    )}
                </div>

                {/* Action Buttons */}
                {actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    action.onClick?.();
                                    toast.dismiss(t.id);
                                }}
                                className="bg-white/10 px-3 py-1.5 rounded text-xs md:text-sm font-semibold uppercase tracking-wide
                                    text-white hover:bg-red-700 transition-colors duration-200
                                    border border-white/20 hover:border-red-700"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    });
};
