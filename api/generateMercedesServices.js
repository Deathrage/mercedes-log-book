const path = require("path");
const fs = require("fs-extra");
const OpenApi = require("openapi-typescript-codegen");

const spec = path.resolve(__dirname, "spec");
const temp = path.resolve(__dirname, "__temp__");
const mercedesServices = path.resolve(__dirname, "services/mercedes");

/** @type {import('openapi-typescript-codegen').Options} */
const options = {
  indent: "2",
  useOptions: true,
  useUnionTypes: true,
  output: temp,
  httpClient: "node",
  exportCore: true,
  exportModels: true,
  exportServices: true,
  exportSchemas: false,
  postfix: "Service",
};

const work = async () => {
  if (await fs.pathExists(mercedesServices))
    await fs.rm(mercedesServices, { recursive: true });

  let yamls = await fs
    .readdir(spec)
    .then((yamls) => yamls.filter((file) => file.endsWith(".yaml")));

  for (const yaml of yamls) {
    await OpenApi.generate({
      ...options,
      input: path.resolve(spec, yaml),
    });

    await fs.copy(temp, mercedesServices, { recursive: true, overwrite: true });
  }

  if (await fs.pathExists(temp)) await fs.rm(temp, { recursive: true });
};

work().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
