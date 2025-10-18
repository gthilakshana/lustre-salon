import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Pricing() {
    const [activeTab, setActiveTab] = useState("haircuts");


    const pricingData = {
        haircuts: [
            { title: "Ladies’ long Haircuts", price: "$65.00" },
            { title: "Bob cuts & pixie cuts", price: "$70.00" },
            { title: "Ladies hair trim", price: "$35.00" },
            { title: "Gents' Hair cuts (by Master Surith)", price: "$50.00" },
            { title: "Gents' Haircuts (by assistant)", price: "$35.00" },
            { title: "Beard Trimming", price: "$20.00" },
            { title: "Beard shaving", price: "$25.00" },
            { title: "Ladies' Temporary Hair settings", price: "$45.00" },
            { title: "Gents' temporary hair settings (by assistant)", price: "$30.00" },
            { title: "Beard color", price: "$25.00" },
        ],
        color: [
            { title: "Master Surith’s Expert Hair Coloring", price: "$180.00" },
            { title: "Senior Assistants’ Hair Coloring", price: "$120.00" },
            { title: "Gents’ Hair Coloring Services", price: "$60.00" },
            { title: "Ladies’ Full Hair Root Touch-Ups", price: "$90.00" },
            { title: "Gents’ Root Touch-Up", price: "$55.00" },
            { title: "Ladies crown hair root touch up", price: "$70.00" },
            { title: "Ladies’ Hair Fringe Touch-Up", price: "$45.00" },
            { title: "Fashion Hair Color Lines", price: "$80.00" },
        ],
        chemical: [
            { title: "Ladies' Hair Rebounding", price: "$250.00" },
            { title: "Ladies’ Crown Rebonding", price: "$180.00" },
            { title: "Ladies Hair Fringe Rebounding", price: "$120.00" },
            { title: "Ladies hair straightening services", price: "$220.00" },
            { title: "Ladies' Hair crown straightening", price: "$160.00" },
            { title: "Ladies’ Hair Fringe Straightening", price: "$100.00" },
            { title: "Ladies' hair relaxing", price: "$150.00" },
            { title: "Ladies' hair crown relaxing", price: "$130.00" },
            { title: "Fringe relaxing", price: "$95.00" },
            { title: "Gents' hair perming", price: "$180.00" },
        ],
        extensions: [
            { title: "Itip Method Hair Extensions (New fixing)", price: "$400.00" },
            { title: "Brazilian knot method Hair extensions (New fixing)", price: "$450.00" },
            { title: "Itip hair extensions maintenance (removing, repairing and fixing)", price: "$250.00" },
            { title: "Brazilian Knot Extensions Maintenance", price: "$300.00" },
        ],
    };



    const tabs = [
        { id: "haircuts", label: "Haircuts & Styling" },
        { id: "color", label: "Hair Color" },
        { id: "chemical", label: "Ladies hair chemical" },
        { id: "extensions", label: "Hair extension" },
    ];

    return (
        <section id="pricing" className="bg-black md:h-[600px] text-white py-16 px-8 md:px-20">

            <motion.h1
                className="text-3xl md:text-4xl font-serif font-bold text-center mb-10 uppercase"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Our Pricing
            </motion.h1>


            <div className="flex justify-center flex-wrap gap-3 mb-10">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 font-serif transition ${activeTab === tab.id
                            ? "bg-white text-black rounded-full"
                            : "bg-gray-800 text-white hover:bg-gray-700 rounded-full"
                            }`}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {pricingData[activeTab].map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex  justify-between border-b border-gray-700 pb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                        >
                            <span>{item.title}</span>
                            <span className="font-semibold">{item.price}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>


        </section>
    );
}
