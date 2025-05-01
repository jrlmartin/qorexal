const fs = require('fs');
const path = require('path');

// Utility function to update manifest version
function updateManifestVersion(manifestPath) {
  const pkgJsonPath = path.join(__dirname, '..', 'package.json');
  
  // Read the version from package.json
  const packageJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const version = packageJson.version || '0.0.0';
  
  // Ensure manifest file exists
  if (!fs.existsSync(manifestPath)) {
    console.error(`Error: manifest.json not found at ${manifestPath}`);
    return false;
  }
  
  // Load manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update manifest version
  manifest.version = version;
  
  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  
  console.log(`Updated manifest.json to version: ${version} at ${manifestPath}`);
  return true;
}

// Webpack plugin implementation
class ManifestVersionPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('ManifestVersionPlugin', (compilation) => {
      const manifestPath = path.join(compiler.options.output.path, 'manifest.json');
      updateManifestVersion(manifestPath);
    });
  }
}

// Check if this file is being run directly as a script
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  let targetDir = args[0] || 'dist';
  
  // If the path is relative (doesn't start with /), assume it's a directory in the project
  if (!path.isAbsolute(targetDir)) {
    const manifestPath = path.join(__dirname, '..', targetDir, 'manifest.json');
    if (!updateManifestVersion(manifestPath)) {
      console.log(`This script should be run after manifest.json has been created in the ${targetDir} directory`);
      process.exit(1);
    }
  } else {
    // Handle absolute path
    if (!updateManifestVersion(targetDir)) {
      console.log(`This script should be run after manifest.json has been created at ${targetDir}`);
      process.exit(1);
    }
  }
}

// Export both the plugin and the update function
module.exports = {
  ManifestVersionPlugin,
  updateManifestVersion
}; 