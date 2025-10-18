import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import Reviews from "../components/reviews";

export default function About() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    // ---- //

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

            <div className="w-full min-h-screen  pt-16 flex flex-col items-center justify-start overflow-hidden">



                <div className="w-full flex flex-col items-center justify-start ">
                    <div className="w-full h-80 md:h-96 relative">
                        <img
                            src="/banner.jpg"
                            alt="About Us"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 p-4">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}

                                className="bg-white/10 backdrop-blur-sm px-6 md:px-12 py-8 shadow-2xl max-w-4xl text-center border-t-4 border-red-600"
                            >
                                <h2 className={`text-white text-3xl md:text-5xl font-serif tracking-wider font-bold uppercase`}>
                                    Our Story
                                </h2>
                                <p className={`text-white mt-3 md:mt-5 text-base md:text-xl font-light leading-snug max-w-2xl mx-auto`}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div className="w-full max-w-7xl mt-12 px-4 md:px-8">
                        <h2 className="text-gray-900 text-3xl md:text-4xl font-serif font-bold text-center mb-16 uppercase relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-red-600">
                            Our Journey
                        </h2>

                        {/* Section 1 */}
                        <div className="flex flex-col md:flex-row items-center md:items-stretch mb-16 gap-6 md:gap-10">
                            <div className="md:w-1/2 w-full self-center">
                                <img
                                    src="/salon1.jpg"
                                    alt="Ribbon cutting"
                                    className="rounded-xl shadow-xl w-full h-auto md:h-[380px] object-cover aspect-[4/3] transition duration-300 hover:shadow-2xl"
                                />
                            </div>

                            <div className="md:w-1/2 w-full text-gray-600 text-base sm:text-lg md:text-lg leading-relaxed self-center">
                                <h3 className="text-red-600 text-2xl  md:text-3xl font-serif font-bold mb-3">The Beginning</h3>
                                <p className={`text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto`}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
                            <div className="md:w-1/2 w-full text-gray-600 text-base sm:text-lg md:text-lg leading-relaxed order-2 md:order-1 self-center">
                                <h3 className="text-red-600 text-2xl  md:text-3xl font-serif font-bold mb-3">Our Growth</h3>
                                <p className={`text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto`}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                            </div>

                            <div className="md:w-1/2 w-full order-1 md:order-2 self-center">
                                <img
                                    src="/Haircut2.jpg"
                                    alt="New salon"
                                    className="rounded-xl shadow-xl w-full h-auto md:h-[380px] object-cover aspect-[4/3] transition duration-300 hover:shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>



                <div className={`w-full mt-12 bg-gray-50 flex items-center py-20`}>
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="md:w-1/2 flex justify-center order-1 md:order-2"
                        >

                            <div className="p-2 border-2 border-white shadow-2xl">
                                <img
                                    src="/founder.jpg"
                                    alt="Founder"
                                    className="w-full max-w-sm h-auto object-cover aspect-[3/4]"
                                />
                            </div>
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="md:w-1/2 order-2 md:order-1"
                        >
                            <div className="text-center md:text-left">
                                <h2 className={`text-gray-900 text-3xl md:text-4xl font-serif font-bold mb-4`}>Meet Our Founder</h2>

                                <p className={`text-gray-600 text-base md:text-lg leading-relaxed mb-6  `}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    <br /><br />
                                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.
                                </p>

                                <h3 className={`text-red-600 text-2xl font-arial font-bold`}>Viraj Amarasingha</h3>
                                <p className="text-gray-500 italic">Founder & CEO, LusTre Salon</p>
                            </div>
                        </motion.div>
                    </div>

                </div>





                <div className="w-full bg-black flex items-center py-16">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="md:w-1/2 flex justify-center order-1 md:order-2"
                        >
                            <img
                                src="/Team.jpg"
                                alt="Vision and Mission"
                                className="w-full h-full object-cover shadow-xl rounded-lg aspect-[4/3] "
                            />

                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="md:w-1/2 text-center md:text-left order-1 md:order-2"
                        >
                            <h2 className={`  text-3xl md:text-4xl font-serif font-bold text-white mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 md:after:left-0 after:w-20 after:h-1 after:bg-red-600`}>
                                Our Vision & Mission
                            </h2>

                            <div className="space-y-6">
                                <p className={`text-white text-base md:text-lg leading-relaxed`}>

                                    <span className={`font-arial font-bold text-2xl block text-red-600 mb-1`}>Vision:</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                                <p className={`text-white text-base md:text-lg leading-relaxed`}>

                                    <span className={`font-arial font-bold text-2xl block text-red-600 mb-1`}>Mission:</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>



                <div className={`w-full bg-white py-16`}>
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 text-center">


                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >

                            <h2 className={`text-gray-900 text-3xl md:text-4xl font-serif font-bold mb-10 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-red-600`}>
                                Our Commitment to You
                            </h2>
                            <p className={`text-gray-600 text-base md:text-xl leading-relaxed mb-6`}>

                                At <span className={`font-semibold text-red-600 italic`}>LusTre Salon</span>, our commitment goes beyond beautiful hair. We aim to create a **luxurious and serene experience** from the moment you step inside.
                            </p>
                            <p className={`text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto`}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>
                        </motion.div>


                        <div className="w-full flex justify-center mt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full flex justify-center"
                            >

                                <img
                                    src="/haircut1.jpg"
                                    alt="Our Commitment"
                                    className="w-full max-w-4xl h-[250px] md:h-[550px] object-cover shadow-2xl rounded-xl"
                                />
                            </motion.div>
                        </div>
                    </div>
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
