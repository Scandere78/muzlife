const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration personnalisée pour Metro
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

module.exports = config;