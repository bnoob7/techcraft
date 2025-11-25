import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { 
  ChevronRight, 
  ChevronLeft, 
  Smartphone,
  Cpu,
  PcCase,
  Gamepad2,
  MemoryStick,
  HardDrive,
  Plug,
  Box,
  Fan,
  Headphones,
  Zap
} from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./categoryShop.css";

const CategoryShop = ({ onCategorySelect }) => {
  const swiperRef = useRef(null);

  const CATEGORIES = [
    { name: "Mobile", color: "bg-blue-100", icon: Smartphone },
    { name: "Processor (CPU)", color: "bg-red-100", icon: Cpu },
    { name: "Motherboard", color: "bg-green-100", icon: PcCase },
    { name: "Graphics Card (GPU)", color: "bg-purple-100", icon: Gamepad2 },
    { name: "Memory (RAM)", color: "bg-yellow-100", icon: MemoryStick },
    { name: "Storage", color: "bg-pink-100", icon: HardDrive },
    { name: "Power Supply (PSU)", color: "bg-orange-100", icon: Plug },
    { name: "Cabinet / Case", color: "bg-cyan-100", icon: Box },
    { name: "Cooling System", color: "bg-indigo-100", icon: Fan },
    { name: "Acessories", color: "bg-rose-100", icon: Headphones },
    { name: "Other", color: "bg-gray-100", icon: Zap },
  ];

  return (
    <div className="category-shop-section">
      <div className="category-header">
        <h2 className="text-3xl font-bold text-white">Shop By Category</h2>
      </div>

      <div className="swiper-container-wrapper">
        {/* Custom Navigation Buttons */}
        {/* <button className="swiper-button-prev-custom">
          <ChevronLeft size={24} />
        </button> */}

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
          className="category-swiper"
        >
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <SwiperSlide key={category.name}>
                <button
                  onClick={() => onCategorySelect(category.name)}
                  className={`category-card group ${category.color}`}
                >
                  <div className="category-icon mb-3 text-white">
                    <IconComponent size={48} strokeWidth={1.5} stroke="white" />
                  </div>
                  <h3 className="category-name text-center font-semibold text-gray-800 dark:text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Shop</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* <button className="swiper-button-next-custom">
          <ChevronRight size={24} />
        </button> */}
      </div>
    </div>
  );
};

export default CategoryShop;