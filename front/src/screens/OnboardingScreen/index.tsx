import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

type OnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

// ─── 슬라이드 데이터 ────────────────────────────────────────────────────────────

type Slide = {
  id: string;
  title: string;
  description: string;
  visual: 'core' | 'sub' | 'task' | 'start';
};

const SLIDES: Slide[] = [
  {
    id: '1',
    title: '만다라트란?',
    description:
      '핵심 목표 하나를 중심에 놓고,\n주변 8개의 세부 목표로 펼쳐가는\n목표 달성 프레임워크입니다.',
    visual: 'core',
  },
  {
    id: '2',
    title: '세부 목표 8개',
    description:
      '핵심 목표를 달성하기 위한\n8가지 세부 목표를 정의합니다.\n각 목표는 독립된 블록으로 관리됩니다.',
    visual: 'sub',
  },
  {
    id: '3',
    title: '실행 과제 64개',
    description:
      '각 세부 목표마다 8개씩,\n총 64개의 구체적인 실행 과제를 작성합니다.\n하나씩 체크하며 목표에 다가가세요.',
    visual: 'task',
  },
  {
    id: '4',
    title: '시작할 준비가\n됐나요?',
    description: '지금 바로 나만의 만다라트를\n채워보세요.',
    visual: 'start',
  },
];

// ─── 미니 그리드 비주얼 ────────────────────────────────────────────────────────

const MiniGrid = ({ visual }: { visual: Slide['visual'] }) => {
  const getCellStyle = (index: number) => {
    const isCenter = index === 4;

    if (visual === 'core') {
      return isCenter ? styles.gridCellCore : styles.gridCellEmpty;
    }
    if (visual === 'sub') {
      return isCenter ? styles.gridCellCore : styles.gridCellSub;
    }
    if (visual === 'task') {
      return isCenter ? styles.gridCellCore : styles.gridCellTask;
    }
    return styles.gridCellEmpty;
  };

  if (visual === 'start') {
    return (
      <View style={styles.startIcon}>
        <Text style={styles.startIconText}>🎯</Text>
      </View>
    );
  }

  return (
    <View style={styles.miniGrid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={[styles.gridCell, getCellStyle(i)]} />
      ))}
    </View>
  );
};

// ─── 슬라이드 아이템 ────────────────────────────────────────────────────────────

const SlideItem = ({ item, width }: { item: Slide; width: number }) => (
  <View style={[styles.slide, { width }]}>
    <MiniGrid visual={item.visual} />
    <Text style={styles.slideTitle}>{item.title}</Text>
    <Text style={styles.slideDescription}>{item.description}</Text>
  </View>
);

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const setFirstLaunchDone = useMandalartStore((state) => state.setFirstLaunchDone);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (isLastSlide) {
      setFirstLaunchDone();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    setFirstLaunchDone();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 건너뛰기 */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      )}

      {/* 슬라이드 */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideItem item={item} width={width} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.flatList}
      />

      {/* 페이지 인디케이터 */}
      <View style={styles.indicators}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      {/* 버튼 */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, isLastSlide && styles.buttonStart]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{isLastSlide ? '시작하기' : '다음'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── 스타일 ────────────────────────────────────────────────────────────────────

const GRID_SIZE = 120;
const CELL_SIZE = (GRID_SIZE - 8) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  skipText: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.medium,
  },
  flatList: {
    flex: 1,
  },

  // 슬라이드
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  slideTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  slideDescription: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // 미니 그리드 비주얼
  miniGrid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: BorderRadius.sm,
  },
  gridCellEmpty: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gridCellCore: {
    backgroundColor: Colors.light.centerBlockBackground,
    borderWidth: 1.5,
    borderColor: Colors.light.centerBlockBorder,
  },
  gridCellSub: {
    backgroundColor: Colors.light.primary + '33',
    borderWidth: 1,
    borderColor: Colors.light.primary + '66',
  },
  gridCellTask: {
    backgroundColor: Colors.light.secondary + '33',
    borderWidth: 1,
    borderColor: Colors.light.secondary + '66',
  },

  // 시작 아이콘
  startIcon: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: GRID_SIZE / 2,
    backgroundColor: Colors.light.centerBlockBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  startIconText: {
    fontSize: 48,
  },

  // 페이지 인디케이터
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.light.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.light.border,
  },

  // 버튼
  buttonArea: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  button: {
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  buttonStart: {
    backgroundColor: Colors.light.secondary,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonText,
  },
});
