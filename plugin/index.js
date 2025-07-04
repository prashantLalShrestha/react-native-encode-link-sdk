const { withSwiftPackages } = require("./withSwiftPackages");

const withLinkUI = (config) => {
  return withSwiftPackageForPod(config, {
    podTarget: "EncodeLinkSdk", // Replace with your Pod target name
    packages: [
      {
        url: "https://github.com/apple/swift-algorithms.git",
        requirement: { exact: "1.0.0" },
        repoName: "swift-algorithms",
        productName: "Algorithms",
      },
    ],
  });
};

exports.default = withLinkUI;
