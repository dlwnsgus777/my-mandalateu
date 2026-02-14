import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MandalartBlock } from '../../types/mandalart';
import { BlockCard } from '../BlockCard';
import { Layout } from '../../constants/theme';

interface BlockGridProps {
  blocks: MandalartBlock[];
  onBlockPress: (blockId: string, blockTitle: string) => void;
  onBlockLongPress?: (blockId: string) => void;
}

export const BlockGrid: React.FC<BlockGridProps> = ({
  blocks,
  onBlockPress,
  onBlockLongPress,
}) => {
  // 3x3 행으로 분리
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  const rows = [sorted.slice(0, 3), sorted.slice(3, 6), sorted.slice(6, 9)];

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((block) => (
            <View key={block.id} style={styles.cell}>
              <BlockCard
                block={block}
                isCenterBlock={block.position === 4}
                onPress={() => onBlockPress(block.id, block.goalTitle)}
                onLongPress={
                  onBlockLongPress ? () => onBlockLongPress(block.id) : undefined
                }
              />
            </View>
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
