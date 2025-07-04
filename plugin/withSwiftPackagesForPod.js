const { withXcodeProject } = require("@expo/config-plugins");

function withSwiftPackageForPod(config, { packages, podTarget }) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const objects = project.hash.project.objects;
    const pbxProject = objects.PBXProject;
    const pbxNativeTargets = objects.PBXNativeTarget;
    const spmRefs = (objects.XCRemoteSwiftPackageReference ||= {});
    const spmProducts = (objects.XCSwiftPackageProductDependency ||= {});
    const pbxBuildFile = objects.PBXBuildFile;
    const pbxFrameworksPhase = objects.PBXFrameworksBuildPhase;

    // Locate project & frameworks phase:
    const projectId = Object.keys(pbxProject)[0];
    const frameworksPhaseId = Object.keys(pbxFrameworksPhase)[0];

    // Find Pod target ID:
    const podTargetId = Object.entries(pbxNativeTargets).find(
      ([_, val]) => val.name === podTarget
    )?.[0];

    if (!podTargetId) {
      throw new Error(`Pod target "${podTarget}" not found in Xcode project`);
    }

    for (const pkg of packages) {
      // Skip if already added
      if (Object.values(spmRefs).some((ref) => ref.repositoryURL === pkg.url)) {
        continue;
      }

      const refId = project.generateUuid();
      spmRefs[
        `${refId} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`
      ] = {
        isa: "XCRemoteSwiftPackageReference",
        repositoryURL: pkg.url,
        requirement: pkg.requirement,
      };

      const prodId = project.generateUuid();
      spmProducts[`${prodId} /* ${pkg.productName} */`] = {
        isa: "XCSwiftPackageProductDependency",
        package: `${refId} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`,
        productName: pkg.productName,
      };

      // Link to app project (optional if needed)
      pbxProject[projectId].packageReferences ||= [];
      pbxProject[projectId].packageReferences.push(
        `${refId} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`
      );

      // Link the framework in Pod target's build phase
      const buildFileId = project.generateUuid();
      pbxBuildFile[buildFileId] = {
        isa: "PBXBuildFile",
        productRef: prodId,
        productRef_comment: pkg.productName,
      };
      pbxBuildFile[
        `${buildFileId}_comment`
      ] = `${pkg.productName} in Frameworks`;
      pbxFrameworksPhase[frameworksPhaseId].files ||= [];
      pbxFrameworksPhase[frameworksPhaseId].files.push(
        `${buildFileId} /* ${pkg.productName} in Frameworks */`
      );

      // Add to Pod target’s package dependencies
      const podTargetObj = pbxNativeTargets[podTargetId];
      podTargetObj.packageProductDependencies ||= [];
      podTargetObj.packageProductDependencies.push(
        `${prodId} /* ${pkg.productName} */`
      );
    }

    return config;
  });
}

module.exports = withSwiftPackageForPod;
