import React from 'react';
import { Platform, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import DockItem from './DockItem';
import type { DockProps } from './types';
import { colors } from '../../theme/colors';

function pageX(e: GestureResponderEvent) {
  return e.nativeEvent.pageX;
}

export default function Dock({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
  distance = 200,
}: DockProps) {
  const mouseX = useSharedValue(Infinity);

  const trackX = (e: GestureResponderEvent) => {
    mouseX.value = pageX(e);
  };

  const resetX = () => {
    mouseX.value = Infinity;
  };

  return (
    <View style={[styles.outer, { height: panelHeight + 24 }]}>
      <View
        style={[styles.panel, { height: panelHeight }]}
        onTouchStart={trackX}
        onTouchMove={trackX}
        onTouchEnd={resetX}
        onTouchCancel={resetX}
        {...(Platform.OS === 'web'
          ? {
              onMouseMove: trackX,
              onMouseLeave: resetX,
            }
          : {})}
        accessibilityRole="toolbar"
        accessibilityLabel="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
            active={item.active}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },
});
