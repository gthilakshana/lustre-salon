import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Brand from "./brand";


export default function HomeView() {

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section id="home">
            <section className="relative w-full h-screen overflow-hidden">

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
                        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                            Experience the Elegance of <br /> LusTre Salon
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg mt-4 max-w-2xl drop-shadow">
                            Where Expert Care Meets Luxurious Services for a Transformative
                            Beauty Experience in Sri Lanka.
                        </p>
                    </div>
                </div>
            </section>



            <Brand />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <section className="relative w-full overflow-hidden">


                    <div className="md:flex flex-col md:flex-row w-full h-auto md:h-[300px] py-10 px-5 mt-9 gap-6">

                        <div className="md:w-1/2 w-full flex justify-center items-center p-5">
                            <h1 className="text-black text-3xl md:text-5xl font-bold leading-tight text-center md:text-left">
                                The Pinnacle of Beauty and Luxury
                            </h1>
                        </div>


                        <div className="md:w-1/2 w-full flex flex-col justify-between p-5 h-full">
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>

                            <div className="flex justify-center md:justify-start mt-5">
                                <button className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6  cursor-pointer">
                                    View More
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="w-full h-[600px] flex justify-center items-center relative mt-10">
                        <div className="w-[1100px] h-[430px] relative overflow-hidden shadow-lg">
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
                                    <div className="relative w-28 h-28 flex justify-center items-center">

                                        <span className="absolute w-full h-full rounded-full border-4 border-white animate-ping"></span>
                                        <span className="absolute w-20 h-20 rounded-full border-4 border-white opacity-50 animate-ping delay-200"></span>
                                        <span className="absolute w-24 h-24 rounded-full border-4 border-white opacity-70 animate-ping delay-400"></span>


                                        <div className="relative z-10 w-16 h-16 flex justify-center items-center bg-white rounded-full shadow-lg">
                                            <svg
                                                className="w-6 h-6 text-black"
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
            </motion.div>

        </section>
    );
}
