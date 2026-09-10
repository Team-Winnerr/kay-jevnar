import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FoodCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
}

const CATEGORIES: { label: FoodCategory; icon: string }[] = [
  { label: 'All', icon: '🔥' },
  { label: 'Quick Bites', icon: '🍔' },
  { label: 'Snacks', icon: '🍟' },
  { label: 'Main Course', icon: '🍛' },
  { label: 'Beverages', icon: '🥤' },
  { label: 'Desserts', icon: '🍩' }
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.label;
        return (
          <TouchableOpacity
            key={cat.label}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelectCategory(cat.label)}
            activeOpacity={0.75}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#ECE7E1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  pillSelected: {
    backgroundColor: '#161616',
    borderColor: '#161616',
    shadowColor: '#161616',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  icon: {
    fontSize: 15,
    marginRight: 6
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.2
  },
  labelSelected: {
    color: '#FFFFFF'
  }
});
