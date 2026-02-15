import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MandalartBlock } from '../../types/mandalart';
import { ProgressBar } from '../ProgressBar';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing, FontSize, FontWeight } from '../../constants/theme';

interface BlockCardProps {
  block: MandalartBlock;
  isCenterBlock: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  isCenterBlock,
  onPress,
  onLongPress,
}) => {
  const nonCenterCells = block.cells.filter((c) => !c.isCenter);
  const completedCount = nonCenterCells.filter((c) => c.completed).length;
  const progress = nonCenterCells.length > 0 ? completedCount / nonCenterCells.length : 0;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.card, isCenterBlock && styles.centerCard]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {isCenterBlock && (
          <Text style={styles.centerIcon}>🎯</Text>
        )}

        <Text
          style={[styles.title, isCenterBlock && styles.centerTitle]}
          numberOfLines={2}
        >
          {block.goalTitle}
        </Text>

        <ProgressBar progress={progress} />

        <View style={styles.footer}>
          <Text style={styles.countText}>{completedCount}/8</Text>
        </View>

        <View style={styles.dots}>
          {nonCenterCells.map((cell) => (
            <View
              key={cell.id}
              style={[styles.dot, cell.completed && styles.dotCompleted]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 110,
    ...Shadow.sm,
  },
  centerCard: {
    backgroundColor: Colors.light.centerBlockBackground,
    borderColor: Colors.light.centerBlockBorder,
    borderWidth: 2,
  },
  centerIcon: {
    fontSize: FontSize.lg,
    marginBottom: 2,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    lineHeight: 14,
  },
  centerTitle: {
    color: Colors.light.primary,
  },
  footer: {
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  countText: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.medium,
  },
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.light.border,
  },
  dotCompleted: {
    backgroundColor: Colors.light.progressHigh,
  },
});
