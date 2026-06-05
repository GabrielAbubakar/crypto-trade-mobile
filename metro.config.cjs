const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    // This points Metro to the SVG transformer
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };

  config.resolver = {
    ...resolver,
    // Filter out 'svg' from asset extensions and add it to source extensions
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    // Alias D3 packages to pre-bundled files to avoid relative ES module import issues
    extraNodeModules: {
      "d3-shape": path.resolve(__dirname, "node_modules/d3-shape/dist/d3-shape.js"),
      "d3-path": path.resolve(__dirname, "node_modules/d3-path/dist/d3-path.js"),
      "d3-array": path.resolve(__dirname, "node_modules/d3-array/dist/d3-array.js"),
    },
  };

  return config;
})();

