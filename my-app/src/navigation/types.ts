// Copyright (c) 2026 Jeshuaem Sepulveda. All rights reserved.

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  UserSaveInfo: {
    calculations: { expression: string; result: string }[];
    latestDisplay: string;
  };
  // Legacy screens still referenced in CalculatorScreen
  Calculator: undefined;
  AITutor: { prompt?: string };
};
