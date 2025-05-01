require('dotenv').config(); // Load local .env into process.env
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { ManifestVersionPlugin } = require('./manifest-version-updater');

module.exports = (config, options) => {
  const defineEnv = {
    'process.env.NG_APP_PRODUCTION': JSON.stringify(process.env.NG_APP_PRODUCTION || ''),
    'process.env.NG_APP_AUTH0_DOMAIN': JSON.stringify(process.env.NG_APP_AUTH0_DOMAIN || ''),
    'process.env.NG_APP_AUTH0_CLIENT_ID': JSON.stringify(process.env.NG_APP_AUTH0_CLIENT_ID || ''),
    'process.env.NG_APP_AUTH0_AUDIENCE': JSON.stringify(process.env.NG_APP_AUTH0_AUDIENCE || ''),
    'process.env.NG_APP_AUTH0_CONNECTION': JSON.stringify(process.env.NG_APP_AUTH0_CONNECTION || ''),
    'process.env.NG_APP_ORGS_ACCESS_TOKEN': JSON.stringify(process.env.NG_APP_ORGS_ACCESS_TOKEN || ''),
    'process.env.NG_APP_SONAR_BASE_DOMAIN': JSON.stringify(process.env.NG_APP_SONAR_BASE_DOMAIN || ''),
    'process.env.NG_APP_BOLD_BASE_DOMAIN': JSON.stringify(process.env.NG_APP_BOLD_BASE_DOMAIN || ''),
    'process.env.NG_APP_ORGS_API': JSON.stringify(process.env.NG_APP_ORGS_API || ''),
  };

  return merge(config, {
    plugins: [
      new webpack.DefinePlugin(defineEnv),
      new ManifestVersionPlugin()
    ],
  });
};