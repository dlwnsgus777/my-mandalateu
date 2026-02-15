import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
}

const getProgressColor = (progress: number): string => {
  if (progress < 0.34) return Colors.light.progressLow;
  if (progress < 0.67) return Colors.light.progressMid;
  return Colors.light.progressHigh;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const barColor = color ?? getProgressColor(clampedProgress);
  const widthAnim = useRef(new Animated.Value(clampedProgress)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.round,
  },
});
