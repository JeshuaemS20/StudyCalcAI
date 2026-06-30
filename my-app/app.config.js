export default {
  expo: {
    name: 'StudyCalc AI',
    slug: 'studycalc-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'studycalc',
    userInterfaceStyle: 'automatic',
    platforms: ['android', 'ios'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jeshuaem.studycalcai',
    },
    android: {
      package: 'com.jeshuaem.studycalcai',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'single',
      favicon: './assets/icon.png',
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 280,
          resizeMode: 'contain',
          backgroundColor: '#000000',
          dark: { backgroundColor: '#000000' },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'StudyCalc AI needs access to your photos to scan math problems.',
          cameraPermission: 'StudyCalc AI needs camera access to photograph math problems.',
        },
      ],
    ],
    experiments: {
      reactCompiler: true,
    },
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY ?? process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '',
      eas: {
        projectId: 'dc560dae-ba3a-40d0-a97c-5c069ca7f3e0',
      },
    },
  },
};
