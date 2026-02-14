import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const BlockDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Block Detail Screen - 3x3 세부 만다라트</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});
