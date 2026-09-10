const { withProjectBuildGradle } = require("@expo/config-plugins");

/**
 * Custom Expo Config Plugin to inject Notifee's local Maven repository 
 * into android/build.gradle automatically during prebuild.
 */
module.exports = function withNotifeeMaven(config) {
    return withProjectBuildGradle(config, (gradleConfig) => {
        const mavenLine = 'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';

        // Check if the maven repository is already added to prevent duplicates
        if (!gradleConfig.modResults.contents.includes(mavenLine)) {
            gradleConfig.modResults.contents = gradleConfig.modResults.contents.replace(
                /allprojects\s*\{[\s\S]*?repositories\s*\{/,
                (match) => `${match}\n        ${mavenLine}`
            );
        }

        return gradleConfig;
    });
};