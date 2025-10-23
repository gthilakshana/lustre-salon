import { useNavigate } from "react-router-dom";

export default function StepNavigation({ activeStep, setStep, employeeName }) {
    const navigate = useNavigate();

    const steps = [
        { id: "barber", label: "Select Barber", path: "/appointment" },
        { id: "select", label: "Select Service" },
        { id: "datetime", label: "Pick Date & Time" },
        { id: "cart", label: "Confirm Payment" },
    ];

    return (
        <div className="relative z-10 w-full flex flex-col items-center ">
            <div className="w-full flex justify-center py-6 sm:py-10 px-2 sm:px-0">
                <div className="flex flex-wrap sm:flex-nowrap bg-white shadow-lg rounded-full overflow-hidden">
                    {steps.map((s, index) => {
                        const isActive = s.id === activeStep || (s.id === "barber" && activeStep === "barber" && employeeName);

                        return (
                            <button
                                key={s.id}
                                onClick={() => {
                                    if (s.path) navigate(s.path);
                                    else setStep(s.id);
                                }}
                                className={`
                flex-1 sm:flex-none flex items-center justify-center
                px-5 sm:px-8 py-3 sm:py-4
                text-xs sm:text-sm font-semibold
                transition-colors duration-300
                ${isActive
                                        ? "bg-black text-white"
                                        : "bg-white text-black hover:bg-black hover:text-white"
                                    }
            `}
                            >
                                <span className="sm:hidden w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-black text-white">
                                    {index + 1}
                                </span>
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                        );
                    })}


                </div>
            </div>
        </div>
    );
}
