#!/usr/bin/env node

const dotenv = require('dotenv');
const path = require('path');

// Load .env (adjust path if your file is elsewhere)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const envVarPlugin = {
  name: 'env-plugin',
  setup(build) {
    // Define environment variable keys used in your app
    const keys = [
      'NG_APP_PRODUCTION',
      'NG_APP_AUTH0_DOMAIN',
      'NG_APP_AUTH0_CLIENT_ID',
      'NG_APP_AUTH0_AUDIENCE',
      'NG_APP_AUTH0_CONNECTION',
      'NG_APP_ORGS_ACCESS_TOKEN',
      'NG_APP_SONAR_BASE_DOMAIN',
      'NG_APP_BOLD_BASE_DOMAIN',
      'NG_APP_ORGS_API',
    ];

    const define = {};

    // For each key, use the existing process.env value if available;
    // otherwise fall back to whatever is in .env.
    for (const key of keys) {
      define[`process.env.${key}`] = JSON.stringify(
        process.env[key] || ''
      );
    }

    build.initialOptions.define = {
      ...build.initialOptions.define,
      ...define,
    };
  },
};

module.exports = envVarPlugin;
