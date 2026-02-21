const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// package.json "exports" 조건에서 "import"(ESM)를 제외하고 CJS를 우선 사용
// zustand 등의 패키지가 import.meta를 포함한 .mjs를 로드하는 것을 방지
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
