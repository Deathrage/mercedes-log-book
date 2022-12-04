import PropulsionType from "../model/PropulsionType";

export const hasCombustionEngine = (propulsion: PropulsionType) =>
  [PropulsionType.COMBUSTION, PropulsionType.PLUGIN_HYBRID].includes(
    propulsion
  );

export const hasElectricEngine = (propulsion: PropulsionType) =>
  [PropulsionType.ELECTRICITY, PropulsionType.PLUGIN_HYBRID].includes(
    propulsion
  );
