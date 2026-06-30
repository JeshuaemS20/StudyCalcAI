module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Explicitly transform private class fields and methods to property assignments.
      // Required because the hermes-v1 profile (SDK 56+) no longer includes these
      // transforms by default, but the Hermes binary used by EAS doesn't yet support
      // native private class fields — causing "private properties are not supported" errors.
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ],
  };
};
