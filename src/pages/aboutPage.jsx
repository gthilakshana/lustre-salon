import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import Reviews from "../components/reviews";

export default function About() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };




    return (
        <>
            <Header />

            <div className="w-full min-h-screen  pt-16 flex flex-col items-center justify-start">


                <div className="w-full   flex flex-col items-center justify-start ">
                    <div className="w-full h-64 md:h-80 relative">
                        <img
                            src="/banner.jpg"
                            alt="About Us"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex flex-col justify-start items-center bg-black/40 pt-16">
                            <div className="bg-black/50 rounded-2xl px-6 md:px-10 py-6 shadow-lg max-w-3xl text-center">
                                <h2 className="text-white text-3xl md:text-5xl font-bold">
                                    About
                                </h2>
                                <p className="text-white mt-4 text-base md:text-lg leading-relaxed">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    when an unknown printer took.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div className="w-full max-w-6xl mt-12 px-4 md:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 uppercase">
                            Our Journey
                        </h2>


                        <div className="flex flex-col md:flex-row items-center md:items-start mb-12 gap-8">

                            <div className="flex flex-col md:flex-row gap-4 md:w-1/2">

                                <img
                                    src="/salon.jpg"
                                    alt="Ribbon cutting"
                                    className="rounded-lg shadow-md w-full object-cover"
                                />
                            </div>


                            <div className="md:w-1/2 text-gray-700 text-lg leading-relaxed">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </div>
                        </div>


                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                            <div className="md:w-1/2 text-gray-700 text-lg leading-relaxed order-2 md:order-1">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </div>


                            <div className="md:w-1/2 order-1 md:order-2">
                                <img
                                    src="/haircut.jpg"
                                    alt="New salon"
                                    className="rounded-lg shadow-md w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>


                <div className="w-full mt-12 bg-gray-100 flex items-center py-16">
                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="md:w-1/2"
                        >
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-bold mb-4">Meet Our Founder</h2>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                    <br /><br />
                                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable
                                </p>
                                <h3 className="text-xl font-semibold">Gavrawa Thilakshana</h3>
                                <p className="text-gray-600">Founder & CEO</p>
                            </div>
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="md:w-1/2 flex justify-center"
                        >
                            <img
                                src="/founder.jpg"
                                alt="Founder"
                                className="w-full max-w-md h-auto object-cover shadow-lg "
                            />
                        </motion.div>

                    </div>
                </div>





                <div className="w-full bg-black flex items-center py-16">
                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="md:w-1/2 flex justify-center"
                        >
                            <img
                                src="/salon.jpg"
                                alt="Vision and Mission"
                                className="w-full h-full object-cover shadow-lg rounded-lg"
                            />
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="md:w-1/2 text-center md:text-left"
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Our Vision and Mission
                            </h2>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                <span className="font-semibold text-white">Our vision</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                <span className="font-semibold text-white">Our mission</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>
                        </motion.div>

                    </div>
                </div>



                <div className="w-full bg-gray-100 py-16">
                    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 text-center">


                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-black mb-6">
                                Our Commitment
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-4">
                                At <span className="font-semibold">LusTre Salon</span>, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </p>
                        </motion.div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full mt-10 px-[150px]"
                    >
                        <img
                            src="/haircut1.jpg"
                            alt="Our Commitment"
                            className="w-full h-[500px] object-cover shadow-lg"
                        />
                    </motion.div>
                </div>



                <Reviews />


            </div>
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-0 right-6 z-50 cursor-pointer bg-black hover:bg-gray-900 text-white p-3 shadow-lg transition"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}


            <Footer />
        </>
    );
}
