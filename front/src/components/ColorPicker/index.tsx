import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlockColors } from '../../constants/colors';
import { BorderRadius, Spacing, FontSize, FontWeight } from '../../constants/theme';

interface ColorPickerProps {
  selectedColor?: string;
  onSelectColor: (color: string | undefined) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.container}>
      {/* 색상 없음 (초기화) */}
      <TouchableOpacity
        style={[styles.dot, styles.noneDot, selectedColor === undefined && styles.selectedDot]}
        onPress={() => onSelectColor(undefined)}
        activeOpacity={0.7}
      >
        <Text style={styles.noneText}>✕</Text>
      </TouchableOpacity>

      {BlockColors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.dot,
            { backgroundColor: color },
            selectedColor === color && styles.selectedDot,
          ]}
          onPress={() => onSelectColor(color)}
          activeOpacity={0.7}
        >
          {selectedColor === color && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  dot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDot: {
    borderColor: '#212121',
    borderWidth: 3,
  },
  noneDot: {
    backgroundColor: '#E0E0E0',
  },
  noneText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#757575',
  },
  checkmark: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
});
