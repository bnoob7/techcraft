import React, { useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import "./categoryShop.css";

const CategoryShop = ({ onCategorySelect }) => {
  const CATEGORIES = [
    { name: "Mobile", color: "bg-blue-100", icon: "📱" },
    { name: "Processor (CPU)", color: "bg-red-100", icon: "⚙️" },
    { name: "Motherboard", color: "bg-green-100", icon: "🖥️" },
    { name: "Graphics Card (GPU)", color: "bg-purple-100", icon: "🎮" },
    { name: "Memory (RAM)", color: "bg-yellow-100", icon: "💾" },
    { name: "Storage", color: "bg-pink-100", icon: "💿" },
    { name: "Power Supply (PSU)", color: "bg-orange-100", icon: "🔌" },
    { name: "Cabinet / Case", color: "bg-cyan-100", icon: "📦" },
    { name: "Cooling System", color: "bg-indigo-100", icon: "❄️" },
    { name: "Acessories", color: "bg-rose-100", icon: "🎧" },
    { name: "Other", color: "bg-gray-100", icon: "⚡" },
  ];

  return (
    <div className="category-shop-section">
      <div className="category-header">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Shop By Category
        </h2>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className={`category-card group ${category.color}`}
          >
            <div className="category-icon text-4xl mb-3">
              {category.icon}
            </div>
            <h3 className="category-name text-center font-semibold text-gray-800 dark:text-gray-900 mb-2">
              {category.name}
            </h3>
            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Shop</span>
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryShop;
