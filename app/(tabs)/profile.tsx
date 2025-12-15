import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { colors, theme, themeMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const getThemeLabel = () => {
    if (themeMode === 'auto') return 'Auto';
    if (themeMode === 'light') return 'Light';
    return 'Dark';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <FontAwesome name="user" size={40} color="#ffffff" />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.name || 'Guest'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email || 'Not logged in'}
        </Text>
        {user?.isAdmin && (
          <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={toggleTheme}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="moon-o" size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Theme</Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {getThemeLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="bell-o" size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="heart-o" size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Wishlist</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.settingLeft}>
            <FontAwesome name="history" size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Order History</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="#ffffff" style={styles.settingIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          FashionHub v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  adminBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
  },
});
