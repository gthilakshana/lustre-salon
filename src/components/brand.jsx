import { motion } from "framer-motion";

export default function Brand() {
  const logos = [
    "/brands/brand1.png",
    "/brands/brand2.png",
    "/brands/brand3.png",
    "/brands/brand4.png",
    "/brands/brand5.png",
    "/brands/brand1.png",
    "/brands/brand2.png",
    "/brands/brand3.png",
  ];

  return (
    <section className="relative bg-gray-100 py-10 px-4 w-full h-[150px] md:h-[180px] overflow-hidden flex items-center">


      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-gray-200 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-200 to-transparent z-10 pointer-events-none" />


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="flex animate-scroll gap-12">
          {[...logos, ...logos].map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Brand Logo"
              className="h-32 md:h-40 object-contain opacity-80 hover:opacity-100 transition-transform duration-300" />))}
        </div>
      </motion.div>


      <style jsx>{`
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 50s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
