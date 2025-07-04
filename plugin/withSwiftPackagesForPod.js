const { withPodfile } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function withSwiftPackagePostInstall(config, { podTarget, frameworkName }) {
  return withPodfile(config, (config) => {
    config.modResults.contents = patchPodfile(config.modResults.contents, {
      podTarget,
      frameworkName,
    });
    return config;
  });
}

function patchPodfile(contents, { podTarget, frameworkName }) {
  const postInstallStart = `post_install do |installer|`;
  const postInstallEnd = `end`;

  const linkCode = `
  installer.pods_project.targets.each do |target|
    if target.name == '${podTarget}'
      puts "⚙️  Linking ${frameworkName} to #{target.name}"
      framework_ref = installer.pods_project.frameworks_group.new_file('${frameworkName}')
      target.frameworks_build_phase.add_file_reference(framework_ref, true)
    end
  end`;

  // Case 1: Podfile has no post_install at all — inject full block
  if (!contents.includes("post_install do |installer|")) {
    return (
      contents +
      `\n\n${postInstallStart}\n  ${linkCode.trim()}\n${postInstallEnd}\n`
    );
  }

  // Case 2: post_install exists — append inside it (naïvely)
  return contents.replace(
    /post_install do \|installer\|([\s\S]*?)end/,
    (match, body) => {
      if (body.includes(frameworkName)) return match; // already patched
      return `${postInstallStart}${body}\n  ${linkCode.trim()}\n${postInstallEnd}`;
    }
  );
}

exports.withSwiftPackagesForPod = withSwiftPackagePostInstall;
