const { withSwiftPackages } = require("./withSwiftPackages");
const { withSwiftPackagesForPod } = require("./withSwiftPackagesForPod");

const withLinkUI = (config) => {
  config = withSwiftPackages(config, {
    podTarget: "RNMyLibrary", // Replace with your Pod target name
    packages: [
      {
        url: "https://github.com/enode/enode-link-ios",
        repoName: "enode-link-ios",
        productName: "LinkKit",
        requirement: {
          kind: "upToNextMajorVersion",
          minimumVersion: "1.0.6",
        },
      },
    ],
  });
  config = withSwiftPackagesForPod(config, {
    podTarget: "EncodeLinkSdk",
    frameworkName: "LinkKit.xcframework",
  });
  return config;
};

exports.default = withLinkUI;
