import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CategoryNavbarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryNavbar: React.FC<CategoryNavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        onPress={() => onSelectCategory('all')}
        style={[
          styles.categoryButton,
          { borderColor: colors.border },
          selectedCategory === 'all' && { backgroundColor: colors.primary }
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            { color: selectedCategory === 'all' ? '#ffffff' : colors.text }
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelectCategory(category)}
          style={[
            styles.categoryButton,
            { borderColor: colors.border },
            selectedCategory === category && { backgroundColor: colors.primary }
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === category ? '#ffffff' : colors.text }
            ]}
          >
            {getCategoryLabel(category)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
