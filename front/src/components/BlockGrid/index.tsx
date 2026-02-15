import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { MandalartBlock } from '../../types/mandalart';
import { BlockCard } from '../BlockCard';
import { Layout } from '../../constants/theme';

interface BlockGridProps {
  blocks: MandalartBlock[];
  onBlockPress: (blockId: string, blockTitle: string) => void;
  onBlockLongPress?: (blockId: string) => void;
}

const AnimatedCell: React.FC<{ flatIndex: number; children: React.ReactNode }> = ({
  flatIndex,
  children,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const delay = flatIndex * 50;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.cell, animStyle]}>{children}</Animated.View>;
};

export const BlockGrid: React.FC<BlockGridProps> = ({
  blocks,
  onBlockPress,
  onBlockLongPress,
}) => {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  const rows = [sorted.slice(0, 3), sorted.slice(3, 6), sorted.slice(6, 9)];

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((block, colIndex) => (
            <AnimatedCell key={block.id} flatIndex={rowIndex * 3 + colIndex}>
              <BlockCard
                block={block}
                isCenterBlock={block.position === 4}
                onPress={() => onBlockPress(block.id, block.goalTitle)}
                onLongPress={
                  onBlockLongPress ? () => onBlockLongPress(block.id) : undefined
                }
              />
            </AnimatedCell>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: Layout.gridGap,
  },
  row: {
    flexDirection: 'row',
    gap: Layout.gridGap,
  },
  cell: {
    flex: 1,
  },
});
