import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  mouseX: SharedValue<number>;
  baseItemSize: number;
  magnification: number;
  distance: number;
};

export default function DockItem({
  icon,
  label,
  onPress,
  active,
  mouseX,
  baseItemSize,
  magnification,
  distance,
}: Props) {
  const centerX = useSharedValue(0);
  const wrapRef = useRef<View>(null);
  const [labelVisible, setLabelVisible] = useState(false);

  const measureCenter = () => {
    wrapRef.current?.measureInWindow((x, _y, width) => {
      centerX.value = x + width / 2;
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const dist =
      mouseX.value === Infinity
        ? distance
        : Math.abs(mouseX.value - centerX.value);

    const size = interpolate(
      dist,
      [0, distance],
      [magnification, baseItemSize],
      Extrapolation.CLAMP
    );

    return {
      width: withSpring(size, SPRING),
      height: withSpring(size, SPRING),
    };
  });

  return (
    <View
      ref={wrapRef}
      style={styles.wrap}
      onLayout={measureCenter}
    >
      {labelVisible && (
        <View style={styles.label}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}
      <Pressable
        onPress={onPress}
        onPressIn={() => setLabelVisible(true)}
        onPressOut={() => setLabelVisible(false)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Animated.View
          style={[
            styles.item,
            active && styles.itemActive,
            animatedStyle,
          ]}
        >
          <View style={styles.icon}>{icon}</View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  itemActive: {
    borderColor: colors.lime,
    backgroundColor: colors.app,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    top: -28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
  },
  labelText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
});
