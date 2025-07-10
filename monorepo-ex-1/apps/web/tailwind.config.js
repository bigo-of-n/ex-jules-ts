const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/base-ui/tailwind.config.js')], // Inherit presets from base-ui
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    // Explicitly include base-ui for Tailwind processing
    join(__dirname, '../../packages/base-ui/src/**/*!(*.stories|*.spec).{ts,tsx,html}')
  ],
  theme: {
    extend: {}, // App-specific extensions can go here
  },
  plugins: [],
};
