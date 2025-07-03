const { withSwiftPackages } = require("./withSwiftPackages");

const withLinkUI = (config) => {
  return withSwiftPackages(config, {
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
};

exports.default = withLinkUI;
