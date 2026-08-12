module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // This is required for Vision Camera and Inspire Face worklets to compile!
            ['react-native-worklets-core/plugin'],
        ],
    };
};