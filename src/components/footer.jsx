import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaPhoneAlt, FaClock, FaHome } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">


                <div className="flex flex-col items-center ">
                    <div className="flex justify-center">
                        <Link to="/">
                            <img
                                src="/LUSTRE.png"
                                alt="Salon Logo"
                                className="h-16 md:h-22 w-[200px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Hair & Beauty</p>
                    <div className="flex gap-4 mt-4 text-2xl">
                        <a href="#" className="hover:text-red-600"><FaFacebookF /></a>
                        <a href="#" className="hover:text-red-600"><FaInstagram /></a>
                        <a href="#" className="hover:text-red-600"><FaTiktok /></a>
                    </div>
                </div>


                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-red-600 font-semibold mb-4">QUICK LINKS</h2>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-red-500">HOME</a></li>
                        <li><a href="#" className="hover:text-red-500">ABOUT</a></li>
                        <li><a href="#" className="hover:text-red-500">TERMS & CONDITIONS</a></li>
                        <li><a href="#" className="hover:text-red-500">CONTACT</a></li>
                    </ul>
                </div>


                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-red-600 font-semibold mb-4">CONTACT US</h2>
                    <div className="flex items-start gap-3 mb-3">
                        <FaClock className="text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OPENING TIMES</p>
                            <p className="font-semibold">Tuesday - Sunday: 9:00am - 7:00pm</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                        <FaHome className="text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OUR LOCATION</p>
                            <p className="font-semibold">No.7, Galle Road, Colombo Sri Lanka.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaPhoneAlt className="text-red-600 mt-1" />
                        <div>
                            <p className="text-gray-400 text-sm">OUR PHONE</p>
                            <p className="font-semibold">+94 77 000 000</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-t border-gray-100 mt-10 pt-4 text-center text-sm text-gray-400">
                © 2025 All Rights Reserved @ Lustre Salon | Designed & Developed by Thilakshana
            </div>
        </footer>
    );
}
