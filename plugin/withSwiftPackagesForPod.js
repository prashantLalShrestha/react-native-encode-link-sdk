const { withPodfile } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// === 2. Patch Podfile with post_install ===

const withSwiftPackagePostInstall = (config, { podTarget, productName }) => {
  return withPodfile(config, (config) => {
    config.modResults.contents = patchPodfile(config.modResults.contents, {
      podTarget,
      productName,
    });
    return config;
  });
};

function patchPodfile(src, { podTarget, productName }) {
  const injectCode = `
  installer.pods_project.targets.each do |target|
    if target.name == '${podTarget}'
      puts "✅ Linking ${productName} to #{target.name}"
      product_ref = installer.pods_project.products_group["${productName}"]
      target.frameworks_build_phase.add_file_reference(product_ref, true) if product_ref
    end
  end`;

  if (!src.includes("post_install do |installer|")) {
    return `${src.trim()}

post_install do |installer|
  ${injectCode.trim()}
end
`;
  }

  return src.replace(
    /post_install do \|installer\|([\s\S]*?)end/,
    (match, body) => {
      if (body.includes(productName)) return match; // Already patched
      return `post_install do |installer|${body.trim()}

  ${injectCode.trim()}
end`;
    }
  );
}

exports.withSwiftPackagesForPod = withSwiftPackagePostInstall;
