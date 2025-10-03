import { useState, useEffect } from "react";
import axios from "axios";
import { ShowToast, LustreToaster } from "../components/lustreToaster";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Header from "../components/header";
import LocationMap from "../components/locationMap";
import Footer from "../components/footer";

export default function Contact() {
    const [yourName, setYourName] = useState("");
    const [yourEmail, setYourEmail] = useState("");
    const [yourPhone, setYourPhone] = useState("");
    const [yourSubject, setYourSubject] = useState("");
    const [yourMessage, setYourMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    //-----//



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/messages",
                {
                    name: yourName,
                    email: yourEmail,
                    contactNumber: yourPhone,
                    subject: yourSubject,
                    message: yourMessage,
                }
            );

            ShowToast(
                "success",
                "Message sent successfully",
                response.data.msg || "Your message has been sent!"
            );

            // reset form
            setYourName("");
            setYourEmail("");
            setYourPhone("");
            setYourSubject("");
            setYourMessage("");
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message || "Failed to send message.";
            ShowToast(
                "error",
                "Message sending failed",
                errorMsg
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Header />

            <div className="w-full min-h-screen  pt-16 flex flex-col items-center justify-start">

                <div className="w-full flex flex-col items-center justify-start">
                    <div className="w-full h-64 md:h-80 relative">
                        <img
                            src="/banner.jpg"
                            alt="Contact Banner"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/70 p-4">

                            <div className="bg-white/10 backdrop-blur-sm px-6 md:px-12 py-8 shadow-2xl max-w-4xl text-center border-t-4 border-red-600 rounded-lg">
                                <h2 className="text-white text-4xl md:text-6xl font-serif tracking-wider font-bold uppercase">
                                    Contact Us
                                </h2>
                                <p className="text-gray-200 mt-3 text-base md:text-xl font-light leading-snug max-w-2xl mx-auto">
                                    Ready to experience the ultimate in beauty and style? Get in touch with our team.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-full min-h-[500px] bg-white flex items-center py-16">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-stretch justify-between gap-12">

                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <h2 className={`text-gray-900 text-3xl font-serif font-bold mb-3 uppercase relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-16 after:h-0.5 after:bg-red-600`}>
                                Get in Touch
                            </h2>
                            <span className="block text-gray-500 mb-6 text-base md:text-lg leading-relaxed">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </span>

                            <div className="space-y-4 flex-1 flex flex-col  ">
                                <div className="flex items-center gap-4">
                                    <FaPhoneAlt className="text-gray-700 text-md md:text-xl" />
                                    <p className="text-md md:text-lg text-gray-800">+94 77 133 456</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaEnvelope className="text-gray-700 text-md md:text-xl" />
                                    <p className="text-md md:text-lg text-gray-800">info@lustresalon.com</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaClock className="text-gray-700 text-md md:text-xl" />
                                    <p className="text-md md:text-lg text-gray-800">Open 24/7</p>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-gray-700 text-md md:text-xl mt-1" />
                                    <p className="text-md md:text-lg text-gray-800">
                                        123 Main Street,
                                        <br /> Colombo, Sri Lanka
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="flex-1 p-6  flex flex-col justify-between">
                            <h2 className={`text-gray-900 text-3xl font-serif font-bold mb-3 uppercase relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-16 after:h-0.5 after:bg-red-600`}>
                                Send a Message
                            </h2>
                            <span className="block text-gray-500 mb-6 text-base md:text-lg leading-relaxed">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </span>

                            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={yourName}
                                        onChange={(e) => setYourName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                    <input
                                        type="email"
                                        value={yourEmail}
                                        onChange={(e) => setYourEmail(e.target.value)}
                                        placeholder="Your Email"
                                        required
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={yourPhone}
                                        onChange={(e) => setYourPhone(e.target.value)}
                                        placeholder="Your Contact Number"
                                        required
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={yourSubject}
                                        onChange={(e) => setYourSubject(e.target.value)}
                                        placeholder="Subject"
                                        required
                                        className="w-1/2 p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                    />
                                </div>

                                <textarea
                                    rows="4"
                                    value={yourMessage}
                                    onChange={(e) => setYourMessage(e.target.value)}
                                    placeholder="Your Message"
                                    required
                                    className="w-full p-3 border border-gray-300 focus:border-gray-200 hover:border-gray-200 outline-none"
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-2 hover:bg-gray-800 transition"
                                >
                                    {loading ? "Sending..." : "Send"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>


                {/* Map */}
                <div className="w-full h-[600px] bg-gray-100 shadow-md">

                    {/* <LocationMap
                        lat={6.9271}
                        lng={79.8612}
                        address="123 Main Street, Colombo, Sri Lanka"
                    /> */}

                </div>

            </div>

            <Footer />
        </>
    );
}
