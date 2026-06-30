import type { ReactNode } from 'react';

export type DockItemData = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
};

export type DockItemProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  mouseX: import('react-native-reanimated').SharedValue<number>;
  baseItemSize: number;
  magnification: number;
  distance: number;
};
