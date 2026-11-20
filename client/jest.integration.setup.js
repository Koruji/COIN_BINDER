// Reanimated and Worklets need native code, which does not exist in Jest.
// Minimal mock: only what the app uses (Animated.View, shared values,
// animated styles, timing, entering/exiting animations, Easing).
jest.mock("react-native-worklets", () => require("react-native-worklets/src/mock"));

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");

  const chain = () => {
    const animation = { duration: () => animation };
    return animation;
  };

  const easing = { out: () => easing, cubic: () => easing };

  return {
    __esModule: true,
    default: { View },
    Easing: easing,
    FadeIn: chain(),
    FadeOut: chain(),
    useSharedValue: (initial) => {
      const shared = {
        value: initial,
        get: () => shared.value,
        set: (next) => {
          shared.value = next;
        },
      };
      return shared;
    },
    useAnimatedStyle: (updater) => updater(),
    withTiming: (target) => target,
  };
});
