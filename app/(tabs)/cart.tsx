import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';

export default function CartScreen() {
  const { colors } = useTheme();
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Total: $${totalPrice.toFixed(2)}\n\nThis is a demo checkout. In production, this would integrate with a payment gateway.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Order placed successfully!');
            clearCart();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                onRemove={() => removeFromCart(item.id)}
              />
            )}
          />
          <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
              <Text style={[styles.totalPrice, { color: colors.primary }]}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
