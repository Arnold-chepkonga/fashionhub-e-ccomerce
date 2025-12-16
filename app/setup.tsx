import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { useProducts } from './context/ProductContext';

export default function FirebaseSetupScreen() {
  const { colors } = useTheme();
  const { initializeProducts } = useProducts();
  const [initializing, setInitializing] = useState(false);

  const handleInitialize = async () => {
    try {
      setInitializing(true);
      await initializeProducts();
      Alert.alert(
        'Success',
        'Products have been initialized in Firebase!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize products. Please check your Firebase configuration.');
    } finally {
      setInitializing(false);
    }
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Firebase Setup</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Welcome to FashionHub with Firebase!
        </Text>

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>First Time Setup</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This is a one-time setup to initialize your Firebase database with sample products.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Make sure you have:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Created a Firebase project
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Enabled Email/Password authentication
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Created a Firestore database
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
            • Added your Firebase config to .env file
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleInitialize}
          disabled={initializing}
        >
          {initializing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Initialize Products</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: colors.card }]}
          onPress={handleSkip}
          disabled={initializing}
        >
          <Text style={[styles.skipButtonText, { color: colors.text }]}>
            Skip (Products Already Initialized)
          </Text>
        </TouchableOpacity>

        <View style={styles.helpContainer}>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Need help? Check the FIREBASE_SETUP.md file for detailed instructions.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 24,
    marginLeft: 10,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    marginTop: 20,
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
