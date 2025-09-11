import { User } from "lucide-react"
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-black text-white">
            <div className="w-full mx-auto flex items-center justify-between px-8 py-1">

                {/* Logo (Left) */}
                <div className="flex  justify-start">
                    <Link to="/">
                        <img
                            src="/LUSTRE.png"
                            alt="Salon Logo"
                            className="h-16 md:h-22 w-[200px] object-cover   cursor-pointer hover:scale-105 transition-transform duration-300 "
                        />

                    </Link>
                </div>

                {/* Navigation (Center) */}
                <div className="flex-grow flex justify-center ">
                    <nav className="hidden md:flex space-x-10 font-semibold text-sm">
                        <a href="#" className="hover:text-red-600">HOME</a>
                        <a href="#" className="hover:text-red-600">ABOUT</a>
                        <a href="#" className="hover:text-red-600">SERVICES</a>
                        <a href="#" className="hover:text-red-600">PRODUCT</a>
                        <a href="#" className="hover:text-red-600">PRICING</a>
                        <a href="#" className="hover:text-red-600">CONTACT</a>
                    </nav>
                </div>

                {/* Buttons (Right) */}
                <div className="flex items-center space-x-3">
                    <button className="border border-white px-4 py-2 cursor-pointer hover:bg-white hover:text-black transition">
                        BOOK NOW
                    </button>
                    <button className="border border-white p-2 cursor-pointer hover:bg-white hover:text-black transition">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    )
}
