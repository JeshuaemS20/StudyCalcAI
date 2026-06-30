if (typeof globalThis.DOMException === 'undefined') {
  class DOMException extends Error {
    constructor(message, name = 'DOMException') {
      super(message);
      this.name = name;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, DOMException);
      }
    }
  }

  globalThis.DOMException = DOMException;
  globalThis.window = globalThis.window ?? globalThis;
  globalThis.self = globalThis.self ?? globalThis;
}

// Polyfill for read-only Event constants in Hermes/React Native 0.85
if (globalThis.Event) {
  const eventConstants = { NONE: 0, CAPTURING_PHASE: 1, AT_TARGET: 2, BUBBLING_PHASE: 3 };
  for (const [key, value] of Object.entries(eventConstants)) {
    try {
      if (globalThis.Event[key] === undefined) {
        Object.defineProperty(globalThis.Event, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    } catch (e) {
      // Ignore if property is already defined
    }
  }
}

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
