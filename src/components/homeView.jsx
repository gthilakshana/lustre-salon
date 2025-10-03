import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ShowToast } from "../components/lustreToaster";
import Brand from "./brand";


export default function HomeView() {

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const paymentStatus = params.get("payment");

        if (paymentStatus === "success") {
            ShowToast("success", "Payment successful! Your appointments are booked.");

            window.history.replaceState({}, document.title, "/");
        }
    }, [search]);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section id="home">


            <section className="relative w-full h-[40vh] md:h-screen overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src="/salon-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                <div className="absolute inset-0 bg-black/40 z-10 flex items-center">
                    <div className="max-w-4xl px-6 md:px-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="text-white text-2xl md:text-5xl font-serif font-bold leading-tight drop-shadow-lg"
                        >
                            Experience the Elegance of <br /> LusTre Salon
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-gray-200 text-sm md:text-lg mt-4 max-w-2xl drop-shadow"
                        >
                            Where Expert Care Meets Luxurious Services for a Transformative
                            Beauty Experience in Sri Lanka.
                        </motion.p>
                    </div>
                </div>
            </section>




            <Brand />


            <section className="relative w-full overflow-hidden">


                <div className="md:flex flex-col md:flex-row w-full h-auto md:h-[300px] py-5 px-5 mt-2 gap-6">


                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 w-full flex justify-center items-center p-5"
                    >
                        <h1 className="text-black text-3xl md:text-5xl font-serif font-bold leading-tight text-center md:text-left">
                            The Pinnacle of Beauty and Luxury
                        </h1>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 w-full flex flex-col justify-between p-5 h-full"
                    >
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex justify-center md:justify-start mt-5"
                        >
                            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 cursor-pointer">
                                View More
                            </button>
                        </motion.div>
                    </motion.div>

                </div>


                <div className="w-full h-[300px] md:h-[600px] flex justify-center items-center relative ">
                    <div className="w-full max-w-[1100px] h-[200px] md:h-[430px] relative overflow-hidden shadow-lg">
                        <video
                            ref={videoRef}
                            src="/salon-video.mp4"
                            className="w-full h-full object-cover"
                            controls={isPlaying}
                            onEnded={() => setIsPlaying(false)}
                        />

                        {!isPlaying && (
                            <div
                                onClick={handlePlay}
                                className="absolute inset-0 flex justify-center items-center cursor-pointer"
                            >
                                <div className="relative w-20 h-20 md:w-28 md:h-28 flex justify-center items-center">
                                    <span className="absolute w-full h-full rounded-full border-4 border-white animate-ping"></span>
                                    <span className="absolute w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-white opacity-50 animate-ping delay-200"></span>
                                    <span className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white opacity-70 animate-ping delay-400"></span>

                                    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 flex justify-center items-center bg-white rounded-full shadow-lg">
                                        <svg
                                            className="w-5 h-5 md:w-6 md:h-6 text-black"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


            </section>


        </section>
    );
}
