import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaPhoneAlt, FaClock, FaHome } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 px-4 md:px-6">
            <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 py-6">

                {/* Logo & Social */}
                <div className="flex flex-col items-center md:items-center text-center md:text-left">
                    <Link to="/" className="flex justify-center md:justify-start">
                        <img
                            src="/LUSTRE.png"
                            alt="Salon Logo"
                            className="h-16 w-[200px] md:h-35 md:w-[280px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                    <p className="text-xs mt-2 tracking-wide">
                        HAIR & BEAUTY <span className="text-red-500"></span>
                    </p>
                    <div className="flex gap-5 mt-4 text-2xl justify-center md:justify-start">
                        <a href="/" className="hover:text-red-600"><FaFacebookF /></a>
                        <a href="#" className="hover:text-red-600"><FaInstagram /></a>
                        <a href="#" className="hover:text-red-600"><FaTiktok /></a>
                    </div>
                </div>



                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-red-500 mb-4 font-semibold">QUICK LINKS</h2>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" className="hover:text-red-500 transition-colors duration-300">
                                HOME
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-red-500 transition-colors duration-300">
                                ABOUT
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms" className="hover:text-red-500 transition-colors duration-300">
                                TERMS & CONDITIONS
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-red-500 transition-colors duration-300">
                                CONTACT
                            </Link>
                        </li>
                    </ul>
                </div>


                {/* Contact Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-red-500 mb-4 font-semibold">CONTACT US</h2>

                    {/* Opening Times */}
                    <div className="flex items-center gap-3 mb-4">
                        <FaClock className="w-5 h-5 hidden md:block text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OPENING TIMES</p>
                            <p className="font-semibold">Tuesday - Sunday: 9:00am - 7:00pm</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 mb-4">
                        <FaHome className="w-6 h-6 hidden md:block text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OUR LOCATION</p>
                            <p className="font-semibold">
                                13801 N Florida Ave C, Tampa, FL 33613, United States
                            </p>
                        </div>
                    </div>
                </div>



                <div className="flex md:mt-10 flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-start gap-3">
                        <FaPhoneAlt className="w-6 h-6 hidden md:block text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OUR PHONE</p>
                            <p className="font-semibold">+1-123 456-7890</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs  text-gray-400">
                © 2025 All Rights Reserved @{" "}
                <span className="text-white text-xs font-semibold">LUSTRE Salon</span> | Designed & Developed by{" "}
                <a
                    href="https://makeitviralmedia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-400 text-xs transition-colors duration-300"
                >
                    MakeItViralMedia
                </a>
            </div>

        </footer>
    );
}
