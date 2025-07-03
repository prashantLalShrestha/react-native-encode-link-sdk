const { withXcodeProject } = require("@expo/config-plugins");

const withSwiftPackages = (config, { packages }) => {
  return withXcodeProject(config, (inlineConfig) => {
    const project = inlineConfig.modResults;

    const spmReferences =
      project.hash.project.objects.XCRemoteSwiftPackageReference || {};

    const existingPackages = Object.values(spmReferences).filter(
      (pkg) => typeof pkg === "object"
    );

    // Filter out packages already added
    const packagesToAdd = packages.filter(
      (pkg) =>
        !existingPackages.some((existing) => existing.repositoryURL === pkg.url)
    );

    if (packagesToAdd.length === 0) {
      return inlineConfig;
    }

    const addedPackages = [];

    let spmProducts =
      project.hash.project.objects.XCSwiftPackageProductDependency || {};

    const pbxProject = project.hash.project.objects.PBXProject;
    const projectId = Object.keys(pbxProject).at(0);
    if (!pbxProject[projectId].packageReferences) {
      pbxProject[projectId].packageReferences = [];
    }

    const pbxFrameworkBuildPhase =
      project.hash.project.objects.PBXFrameworksBuildPhase;
    const buildPhaseId = Object.keys(pbxFrameworkBuildPhase).at(0);
    if (!pbxFrameworkBuildPhase[buildPhaseId].files) {
      pbxFrameworkBuildPhase[buildPhaseId].files = [];
    }

    const pbxBuildFile = project.hash.project.objects.PBXBuildFile;

    for (const pkg of packagesToAdd) {
      const packageReferenceUUID = project.generateUuid();
      spmReferences[
        `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`
      ] = {
        isa: "XCRemoteSwiftPackageReference",
        repositoryURL: pkg.url,
        requirement: pkg.requirement,
      };

      const packageUUID = project.generateUuid();
      spmProducts[`${packageUUID} /* ${pkg.productName} */`] = {
        isa: "XCSwiftPackageProductDependency",
        package: `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`,
        productName: pkg.productName,
      };

      pbxProject[projectId].packageReferences = [
        ...pbxProject[projectId].packageReferences,
        `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${pkg.repoName}" */`,
      ];

      const frameworkUUID = project.generateUuid();

      pbxBuildFile[
        `${frameworkUUID}_comment`
      ] = `${pkg.productName} in Frameworks`;
      pbxBuildFile[frameworkUUID] = {
        isa: "PBXBuildFile",
        productRef: packageUUID,
        productRef_comment: pkg.productName,
      };

      pbxFrameworkBuildPhase[buildPhaseId].files = [
        ...pbxFrameworkBuildPhase[buildPhaseId].files,
        `${frameworkUUID} /* ${pkg.productName} in Frameworks */`,
      ];

      addedPackages.push(`${pkg.productName} (${pkg.url})`);
    }

    project.hash.project.objects.XCRemoteSwiftPackageReference = spmReferences;
    project.hash.project.objects.XCSwiftPackageProductDependency = spmProducts;
    project.hash.project.objects.PBXProject = pbxProject;
    project.hash.project.objects.PBXBuildFile = pbxBuildFile;
    project.hash.project.objects.PBXFrameworksBuildPhase =
      pbxFrameworkBuildPhase;

    if (addedPackages.length > 0) {
      console.log(
        "✔ Added Swift Packages:\n  - " + addedPackages.join("\n  - ")
      );
    }

    return inlineConfig;
  });
};

exports.withSwiftPackages = withSwiftPackages;
