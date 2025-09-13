import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Header from "../components/header";
import LocationMap from "../components/locationMap"
import Footer from "../components/footer";

export default function Contact() {
    return (
        <>
            <Header />

            <div className="w-full min-h-screen  pt-16 flex flex-col items-center justify-start">

                <div className="w-full flex flex-col items-center justify-start">
                    <div className="w-full h-64 md:h-80 relative">
                        <img
                            src="/banner.jpg"
                            alt="About Us"
                            className="w-full h-full object-cover"
                        />


                        <div className="absolute inset-0 flex flex-col justify-start items-center bg-black/40 pt-16">
                            <div className="bg-black/50 rounded-2xl px-6 md:px-10 py-6 shadow-lg max-w-3xl text-center">
                                <h2 className="text-white text-3xl md:text-5xl font-bold">
                                    Contact
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


                <div className="w-full min-h-[500px] bg-white flex items-center py-16">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-stretch justify-between gap-12">


                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <h2 className="text-3xl font-bold mb-3 text-gray-900 uppercase">Get in Touch</h2>
                            <span className="block text-gray-500 mb-6">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </span>

                            <div className="space-y-4 flex-1 flex flex-col ">
                                <div className="flex items-center gap-4">
                                    <FaPhoneAlt className="text-gray-700 text-xl" />
                                    <p className="text-lg text-gray-800">+94 77 133 456</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaEnvelope className="text-gray-700 text-xl" />
                                    <p className="text-lg text-gray-800">info@lustresalon.com</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaClock className="text-gray-700 text-xl" />
                                    <p className="text-lg text-gray-800">Open 24/7</p>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-gray-700 text-xl mt-1" />
                                    <p className="text-lg text-gray-800">
                                        123 Main Street,
                                        <br /> Colombo, Sri Lanka
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="flex-1 p-6  flex flex-col justify-between">
                            <h2 className="text-3xl font-bold mb-3 text-gray-900 uppercase">Send a Message</h2>
                            <span className="block text-gray-500 mb-6">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </span>

                            <form className="space-y-4 flex-1 flex flex-col justify-between">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Your Contact Number"
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                </div>

                                <textarea
                                    rows="4"
                                    placeholder="Your Message"
                                    className="w-full p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                ></textarea>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-2 hover:bg-gray-800 transition"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>


                <div className="w-full min-h-[500px] bg-gray-100 overflow-hidden shadow-md">
                    {/* <LocationMap /> */}
                </div>



            </div>



            <Footer />


        </>
    );
}