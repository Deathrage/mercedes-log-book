const path = require("path");

const sharedModels = path.resolve(__dirname, "../api/model-shared");

module.exports = (webpackConfig) => {
  // Allow models in scope plugin
  const plugin = webpackConfig.resolve.plugins.find(
    (plugin) => plugin.constructor.name === "ModuleScopePlugin"
  );
  if (plugin) plugin.allowedPaths.push(sharedModels);
  // Remove rule for TS-Loader to allow transpiling other files
  const rule = webpackConfig.module.rules
    .find((rule) => "oneOf" in rule)
    .oneOf.find((rule) => rule.include);
  if (rule) rule.include = [rule.include, path.resolve(sharedModels)];

  return webpackConfig;
};