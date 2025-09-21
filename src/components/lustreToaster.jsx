import { toast, Toaster } from "react-hot-toast";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

const iconMap = {
    success: <CheckCircle size={20} className="text-green-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-400" />,
    error: <XCircle size={20} className="text-red-500" />,
};

export const LustreToaster = () => (
    <Toaster
        position="bottom-right"
        toastOptions={{
            duration: 5000,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        }}
    />
);

export const ShowToast = (type = "info", message = "", description = "", actions = []) => {
    toast.custom((t) => {
        const Icon = iconMap[type] || iconMap.info;

        return (
            <div className={`${t.visible ? "animate-enter" : "animate-leave"} flex flex-col gap-1 w-80 p-4 rounded-md shadow-lg bg-black text-white`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {Icon}
                        <span className="font-semibold">{type.toUpperCase()}</span>
                    </div>
                    <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-200">
                        <X size={16} />
                    </button>
                </div>

                <div className="text-sm text-gray-300">
                    {message}
                    {description && <div className="text-xs text-gray-400 mt-1">{description}</div>}
                </div>

                {actions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {actions.map((action, idx) => (
                            <button key={idx} onClick={action.onClick} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    });
};
