import React from "react";
import "./Navbar.css";

const StickyCategoriesBar = ({ categories, onCategoryClick, visible }) => {
  if (!visible || !categories?.length) return null;
  return (
    <div className="sticky-categories-bar pro-sticky-bar">
      <ul className="sticky-categories-list pro-sticky-list">
        {categories.map((category) => (
          <li key={category._id} className="pro-sticky-list-item">
            <button
              className="sticky-category-btn pro-sticky-btn"
              onClick={() => onCategoryClick(category._id)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="pro-sticky-category-img"
              />
              <span className="pro-sticky-category-name">{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StickyCategoriesBar;
