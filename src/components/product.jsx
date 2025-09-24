import { motion } from "framer-motion";

export default function Product() {
    return (
        <section id="products" className="w-full py-5 bg-gray-50 border-t-2 border-gray-200">
            <div className="px-4 py-4 max-w-7xl mx-auto md:flex flex-col md:flex-row items-center gap-12">

                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="md:w-1/2 w-full flex flex-col justify-center p-5"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 uppercase">
                        Our Products
                    </h2>
                    <span className="text-gray-600 text-base md:text-lg leading-relaxed">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </span>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: -100, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1 }}
                    className="md:w-1/2 w-full"
                >
                    <img
                        src="/Product.jpg"
                        alt="Service Image"
                        className="w-full h-full object-cover shadow-lg"
                    />
                </motion.div>




            </div>
        </section>
    );
}