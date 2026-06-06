import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { AuthColors } from '@/constants/theme';

export default function IndexRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={AuthColors.primary} />
      </View>);

  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AuthColors.background
  }
});