import Slider from "react-slick";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Reviews() {
    const reviews = [
        {
            name: "Maleesha Jayasinghe",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
            rating: 5,
        },
        {
            name: "Samantha Perera",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
            rating: 5,
        },
        {
            name: "Nadeesha Fernando",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
            rating: 4,
        },
        {
            name: "Kavindu Silva",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
            rating: 5,
        },
        {
            name: "Dilani Rathnayake",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
            rating: 5,
        },
    ];


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <section className="w-full py-8 bg-gray-100 border-t-2 border-gray-200">
            <div className="max-w-6xl mx-auto text-center px-6">
                <Slider {...settings}>
                    {reviews.map((review, index) => (
                        <div key={index}>
                            <FaQuoteRight className="text-2xl md:text-3xl text-gray-700 mx-auto mb-6" />
                            <p className="text-base md:text-lg leading-relaxed text-gray-800 mb-6">{review.text}</p>
                            <h3 className="font-bold text-md md:text-lg mb-2 uppercase">{review.name}</h3>
                            <div className="flex justify-center mb-6">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <FaStar key={i} className="text-yellow-500 text-md md:text-lg" />
                                ))}
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}
