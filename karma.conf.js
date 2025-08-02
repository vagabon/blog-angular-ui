// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const os = require("os");

module.exports = function (config) {
  config.set({
    basePath: "./",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
    ],
    hostname: "localhost",
    port: 9878,
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      subdir: ".",
      reporters: [{ type: "lcov" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    browsers: ["Chrome, CustomChromeHeadless"],
    customLaunchers: {
      CustomChromeHeadless: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--headless", "--disable-gpu"],
      },
    },
    restartOnFileChange: true,
  });
};
