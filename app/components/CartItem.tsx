import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ${item.price.toFixed(2)}
        </Text>
        <View style={styles.actions}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity - 1)}
              style={[styles.quantityButton, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity + 1)}
              style={[styles.quantityButton, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Text style={[styles.removeText, { color: colors.error }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 4,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
