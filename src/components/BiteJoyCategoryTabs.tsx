import React from 'react';
import { FoodCategory } from '../types';

interface BiteJoyCategoryTabsProps {
  selectedCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
}

const CATEGORIES: FoodCategory[] = ['Burgers', 'Sides', 'Desserts'];

export const BiteJoyCategoryTabs: React.FC<BiteJoyCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div
      className="tabs-wrapper w-tab-menu"
      id="w-node-_47877061-05f6-2257-6f0e-2e4a977401f5-b526a898"
    >
      {CATEGORIES.map((cat) => {
        const isCurrent = selectedCategory === cat;
        return (
          <a
            key={cat}
            className={`tab-link w-inline-block w-tab-link cursor-pointer ${
              isCurrent ? 'w--current' : ''
            }`}
            onClick={() => onSelectCategory(cat)}
          >
            <div className="tab-title">{cat}</div>
          </a>
        );
      })}
    </div>
  );
};
