export default function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="flex justify-center flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                        px-6 py-2 min-w-[200px] text-sm md:text-base font-semibold cursor-pointer uppercase transition-all duration-300 shadow-sm
                        focus:outline-none
                        ${activeTab === tab.id
                            ? "bg-black text-white shadow-lg scale-105"
                            : "bg-white text-gray-800 hover:bg-gray-100 hover:scale-105"
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
