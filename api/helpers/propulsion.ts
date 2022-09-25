import PropulsionType from "../model-shared/PropulsionType";

export const hasCombustionEngine = (propulsion: PropulsionType) =>
  [PropulsionType.COMBUSTION, PropulsionType.PLUGIN_HYBRID].includes(
    propulsion
  );

export const hasElectricEngine = (propulsion: PropulsionType) =>
  [PropulsionType.ELECTRICITY, PropulsionType.PLUGIN_HYBRID].includes(
    propulsion
  );
