import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

export type BottomNavItem = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
};

type Props = {
  items: BottomNavItem[];
};

const SPRING = { damping: 14, stiffness: 220, mass: 0.6 };
const PRESS_SPRING = { damping: 18, stiffness: 420, mass: 0.45 };

function NavItem({ icon, label, active, onPress }: BottomNavItem) {
  const pressed = useSharedValue(1);
  const activeBoost = useSharedValue(active ? 1.1 : 1);
  const dot = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeBoost.value = withSpring(active ? 1.1 : 1, SPRING);
    dot.value = withSpring(active ? 1 : 0, SPRING);
  }, [active, activeBoost, dot]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value * activeBoost.value }],
    opacity: 0.65 + dot.value * 0.35,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot.value }],
    opacity: dot.value,
  }));

  const handlePressIn = () => {
    pressed.value = withSpring(0.86, PRESS_SPRING);
  };

  const handlePressOut = () => {
    pressed.value = withSpring(1, PRESS_SPRING);
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      style={styles.item}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Animated.View style={[styles.iconWrap, iconStyle]}>
        {icon}
        <Animated.View style={[styles.dot, dotStyle]} />
      </Animated.View>
    </Pressable>
  );
}

export default function BottomNav({ items }: Props) {
  const barY = useSharedValue(24);
  const barOpacity = useSharedValue(0);

  useEffect(() => {
    barY.value = withSpring(0, { damping: 16, stiffness: 180, mass: 0.8 });
    barOpacity.value = withSpring(1, { damping: 20, stiffness: 160 });
  }, [barOpacity, barY]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: barY.value }],
    opacity: barOpacity.value,
  }));

  return (
    <Animated.View style={[styles.bar, barStyle]}>
      {items.map((item, i) => (
        <NavItem key={`${item.label}-${i}`} {...item} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.lime,
  },
});
