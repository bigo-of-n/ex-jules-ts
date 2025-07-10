// Export utility function
export * from './lib/utils';

// Export components
export * from './lib/components/button';
export * from './lib/components/card';

// It's not conventional to export CSS directly via JS for library consumption in this manner.
// Instead, applications using this library should import the CSS file directly.
// For example, in the app's main CSS file or global layout:
// import '@my-workspace/base-ui/src/lib/globals.css';
// However, if direct JS export is desired for some reason, it would typically involve
// more complex bundler configurations to handle CSS modules or emit CSS files.
// For now, I will remove the direct CSS export from here and ensure the consuming app (web)
// imports it correctly in its global CSS or layout.
