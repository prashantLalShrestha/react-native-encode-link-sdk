require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "EncodeLinkSdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/prashantLalShrestha/react-native-encode-link-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.exclude_files = ["**/*.xcframework/**/*.h"]
  s.preserve_paths = [
    "**/*.xcframework",
    "**/*.h",
    "**/*.xcframework/**/*.h"
  ]
  s.vendored_frameworks='Frameworks/LinkKit.xcframework'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES' => 'NO',
    'SWIFT_COMPILATION_MODE' => 'wholemodule',
    'APPLICATION_EXTENSION_API_ONLY' => 'YES'
  }
  
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end