import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import Reviews from "../components/reviews";

export default function About() {
    return (
        <>
            <Header />

            <div className="w-full min-h-screen  pt-16 flex flex-col items-center justify-start">


                <div className="w-full h-64 md:h-80 relative">
                    <img
                        src="/banner.jpg"
                        alt="About Us"
                        className="w-full h-full object-cover"
                    />
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


                <div className="w-full  mt-12 bg-gray-100 flex items-center py-16">
                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-4xl font-bold mb-4">Meet Our Founder</h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                                <br />
                                <br />
                                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                            </p>
                            <h3 className="text-xl font-semibold">Gavrawa Thilakshana</h3>
                            <p className="text-gray-600">Founder & CEO</p>
                        </div>


                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="/founder.jpg"
                                alt="Founder"
                                className="w-full h-full object-cover  shadow-lg"
                            />
                        </div>

                    </div>
                </div>



                <div className="w-full bg-black flex items-center py-16">
                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">


                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="/salon.jpg"
                                alt="Vision and Mission"
                                className="w-full h-full object-cover shadow-lg rounded-lg"
                            />
                        </div>


                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Our Vision and Mission
                            </h2>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                <span className="font-semibold text-white">Our vision</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                <span className="font-semibold text-white">Our mission</span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                            </p>
                        </div>

                    </div>
                </div>



                <div className="w-full bg-gray-100 py-16">
                    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 text-center">

                        <h2 className="text-4xl font-bold text-black mb-6">
                            Our Commitment
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            At <span className="font-semibold">LusTre Salon</span>, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </p>
                    </div>


                    <div className="w-full  mt-10  px-[150px]">
                        <img
                            src="/haircut1.jpg"
                            alt="Our Commitment"
                            className="w-full h-[500px] object-cover shadow-lg"
                        />
                    </div>
                </div>



                <Reviews />


            </div>


            <Footer />
        </>
    );
}
