import { ClipLoader } from "react-spinners";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Services from "../components/services";
import Product from "../components/product";
import Blog from "../components/blog";
import Pricing from "../components/pricing";
import Contact from "../pages/contact";
import HomeView from "../components/homeView";

export default function HomePage() {
    const [loadingSections, setLoadingSections] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setLoadingSections(false), 2000);
        return () => clearTimeout(timer);
    }, []);


    return (
        <>
            <div className="min-h-screen w-full flex flex-col " >
                <Header />


                {loadingSections ? (
                    <div className="flex-1 flex items-center justify-center bg-white">
                        <ClipLoader color="#006400" loading={loadingSections} size={45} />
                    </div>
                ) : (
                    <main className="flex-1 ">
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/product" element={<Product />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>

                    </main>
                )}

                <Footer />
            </div>
        </>
    )
}