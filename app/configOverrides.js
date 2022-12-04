const path = require("path");

const api = path.resolve(__dirname, "../api");
const sharedModel = path.resolve(api, "./shared/model.ts");
const sharedHelpers = path.resolve(api, "./shared/helpers.ts");
const sharedContracts = path.resolve(api, "./shared/contracts.ts");

module.exports = (webpackConfig) => {
  // Alias shared assets
  webpackConfig.resolve.alias["@shared/model"] = sharedModel;
  webpackConfig.resolve.alias["@shared/helpers"] = sharedHelpers;
  webpackConfig.resolve.alias["@shared/contracts"] = sharedContracts;

  // Allow ModuleScopePlugin to import from shared assets
  const plugin = webpackConfig.resolve.plugins.find(
    (plugin) => plugin.constructor.name === "ModuleScopePlugin"
  );
  if (plugin)
    plugin.allowedPaths.push(sharedModel, sharedHelpers, sharedContracts);

  // Allow Babel Loader to transpiler files in api (as shared assets are re-exports)
  const rule = webpackConfig.module.rules
    .find((rule) => "oneOf" in rule)
    .oneOf.find((rule) => rule.include);
  if (rule) rule.include = [rule.include, api];

  return webpackConfig;
};
