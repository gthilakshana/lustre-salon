import { User as UserIcon } from "lucide-react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCut } from "react-icons/io5";

export default function Header({ currentUser }) {
    const sections = ["home", "pricing", "services", "products"];
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(currentUser || null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, [currentUser]);

    const handleScroll = (id) => {
        if (location.pathname === `/${id}` || (id === "home" && location.pathname === "/")) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(id === "home" ? "/" : `/${id}`);
        }
        setMenuOpen(false);
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-black text-white">
            <div className="w-full mx-auto flex items-center justify-between px-2 py-4 md:px-4 md:py-4">
                {/* Logo */}
                <div className="flex justify-start -ml-8 md:-ml-6">
                    <Link to="/">
                        <img
                            src="/LUSTRE.png"
                            alt="Salon Logo"
                            className="h-17 w-[160px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="flex-grow flex justify-center">
                    <nav className="hidden md:flex space-x-10 font-semibold text-sm">
                        <button
                            onClick={() => handleScroll("home")}
                            className="hover:text-red-600 cursor-pointer"
                        >
                            HOME
                        </button>
                        <button
                            onClick={() => navigate("/about")}
                            className="hover:text-red-600 cursor-pointer"
                        >
                            ABOUT
                        </button>
                        {sections.slice(1).map((sec) => (
                            <button
                                key={sec}
                                onClick={() => handleScroll(sec)}
                                className="hover:text-red-600 cursor-pointer"
                            >
                                {sec.toUpperCase()}
                            </button>
                        ))}
                        <button
                            onClick={() => navigate("/contact")}
                            className="hover:text-red-600 cursor-pointer"
                        >
                            CONTACT
                        </button>
                    </nav>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center space-x-3">
                    <Link
                        to="/appointment"
                        className="border border-white md:px-4 md:py-2 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500"
                    >
                        BOOK NOW
                    </Link>

                    {user && user.fullName && user.role === "user" ? (
                        <span
                            onClick={() => navigate("/user")}
                            className="cursor-pointer text-white font-semibold flex items-center space-x-2 truncate max-w-[150px]"
                            title={user.fullName}
                        >
                            <UserIcon size={20} />
                            <span>{user.fullName.charAt(0).toUpperCase()}</span>
                        </span>
                    ) : (
                        <Link
                            to="/login"
                            className="border border-white p-2 cursor-pointer hover:bg-white hover:text-black transition-colors duration-500 inline-flex items-center justify-center"
                        >
                            <UserIcon size={20} />
                        </Link>
                    )}
                </div>


                <div className="flex md:hidden items-center">
                    <button onClick={() => setMenuOpen(true)}>
                        <HiOutlineMenu className="w-8 h-8 text-white cursor-pointer hover:text-red-600 " />
                    </button>
                </div>
            </div>

            {/* Mobile Slide Menu */}
            {menuOpen && (
                <>

                    <div
                        className="fixed inset-0 bg-opacity-50 z-40"
                        onClick={() => setMenuOpen(false)}
                    ></div>


                    <div className=" fixed top-0 right-0 w-64 h-full bg-black text-white  z-50 p-6 flex flex-col space-y-6 transform transition-transform duration-300">

                        <div
                            className="absolute h-full inset-0 bg-[url('/appointment-bg.jpg')] bg-cover bg-center opacity-10"
                            aria-hidden="true"
                        ></div>

                        <div className="z-10 flex flex-col justify-center space-y-6 ">
                            <div className="flex justify-end items-center mb-10">

                                <button onClick={() => setMenuOpen(false)}>
                                    <IoCut className="w-6 h-6 text-white cursor-pointer hover:text-red-600 " />
                                </button>
                            </div>



                            <button
                                onClick={() => handleScroll("home")}
                                className="hover:text-red-600 text-left text-sm font-semibold"
                            >
                                HOME
                            </button>
                            <button
                                onClick={() => navigate("/about")}
                                className="hover:text-red-600 text-left text-sm font-semibold"
                            >
                                ABOUT
                            </button>
                            {sections.slice(1).map((sec) => (
                                <button
                                    key={sec}
                                    onClick={() => handleScroll(sec)}
                                    className="hover:text-red-600 text-left text-sm font-semibold"
                                >
                                    {sec.toUpperCase()}
                                </button>
                            ))}
                            <button
                                onClick={() => navigate("/contact")}
                                className="hover:text-red-600 text-left text-sm font-semibold"
                            >
                                CONTACT
                            </button>

                            <hr className="border-gray-700" />

                            <div className="flex items-center ">
                                <Link
                                    to="/appointment"
                                    onClick={() => setMenuOpen(false)}
                                    className="border border-white px-4 py-2 w-[60%] m-2 hover:bg-red-500 hover:text-white text-sm font-semibold hover:border-red-500 transition-all duration-500 text-center"
                                >
                                    BOOK NOW
                                </Link>

                                {user ? (
                                    <button
                                        onClick={() => {
                                            navigate("/user");
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center  space-x-2 mt-1 hover:text-red-600 transition-all duration-500 text-center"
                                    >
                                        <UserIcon size={20} />
                                        <span>{user.fullName.charAt(0).toUpperCase()}</span>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="border border-white p-2 w-[20%] hover:bg-white hover:text-black transition-all duration-500 text-center  inline-flex items-center justify-center"
                                    >
                                        <UserIcon size={20} />
                                    </Link>
                                )}


                            </div>
                        </div>


                    </div>
                </>
            )}
        </header>
    );
}
