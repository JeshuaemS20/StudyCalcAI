import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const LOGO_SOURCE = require('../../assets/StudyCalc AI logo app.png');

type Props = {
  size?: number;
  borderColor?: string;
};

export default function AppLogo({ size = 100, borderColor = '#aaff00' }: Props) {
  const inset = Math.round(size * 0.08);

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
        },
      ]}
    >
      <Image
        source={LOGO_SOURCE}
        style={{ width: size - inset * 2, height: size - inset * 2 }}
        contentFit="contain"
        accessibilityLabel="StudyCalc AI logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0d0d',
  },
});
