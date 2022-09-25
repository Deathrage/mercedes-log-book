const path = require("path");
const fs = require("fs-extra");
const OpenApi = require("openapi-typescript-codegen");
const { merge, isErrorResult } = require("openapi-merge");
const { load } = require("js-yaml");

const spec = path.resolve(__dirname, "spec");
const mercedesServices = path.resolve(
  __dirname,
  "services-mercedes/__generated__"
);

const work = async () => {
  // Process all openapi spec YAMLs to objects
  const openIdSpecs = await fs
    .readdir(spec)
    .then((yamls) => yamls.filter((file) => file.endsWith(".yaml")))
    .then((yamls) =>
      Promise.all(yamls.map((yaml) => fs.readFile(path.resolve(spec, yaml))))
    )
    .then((buffers) => buffers.map((buffer) => buffer.toString()))
    .then((strings) => strings.map((string) => load(string)));

  // Produce single openapi spec
  const result = merge(
    openIdSpecs.map((spec, index) => ({
      oas: spec,
      operationSelection: {
        // We take resources path only from the first document as it is in every one
        excludeTags: index === 0 ? undefined : ["Resources"],
      },
    }))
  );
  if (isErrorResult(result)) throw new Error(result.message);

  await OpenApi.generate({
    indent: "2",
    useUnionTypes: true,
    output: mercedesServices,
    httpClient: "axios",
    exportCore: true,
    exportModels: true,
    exportServices: true,
    exportSchemas: false,
    postfix: "Service",
    clientName: "MercedesBenzClient",
    // Generate types form unified openapi spec
    input: result.output,
  });
};

work().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
