import DoorLockStatus from "../model/DoorLockStatus";
import LightSwitchPosition from "../model/LightSwitchPosition";
import RooftopStatus from "../model/RooftopStatus";
import SunroofStatus from "../model/SunroofStatus";
import Timestamped from "../model/Timestamped";
import WindowsStatus from "../model/WindowsStatus";
import { Resource } from "./__generated__";

export const findResource = <Response extends object, Value>(
  responses: Response[],
  key: keyof Response,
  parser: (value: Resource) => Timestamped<Value> | undefined
) => {
  const response = responses.find((r) => Reflect.has(r, key));
  if (!response) return undefined;
  return parser(Reflect.get(response, key));
};

export const parseBoolean = (
  value: Resource
): Timestamped<boolean> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: value === "true" ? true : false,
    timestamp: value.timestamp,
  };
};

const lightSwitchPositionMap: Record<string, LightSwitchPosition> = {
  "0": LightSwitchPosition.AUTO,
  "1": LightSwitchPosition.HEADLIGHTS,
  "2": LightSwitchPosition.SIDELIGHT_LEFT,
  "3": LightSwitchPosition.SIDELIGHT_RIGHT,
  "4": LightSwitchPosition.PARKING,
};

export const parseLightSwitchPosition = (
  value: Resource
): Timestamped<LightSwitchPosition> | undefined => {
  if (!value.value || !value.timestamp) return undefined;
  return {
    value: lightSwitchPositionMap[value.value],
    timestamp: value.timestamp,
  };
};

const rooftopStatusMap: Record<string, RooftopStatus> = {
  "0": RooftopStatus.UNLOCKED,
  "1": RooftopStatus.OPEN_LOCKED,
  "2": RooftopStatus.CLOSED_LOCKED,
};

export const parseRooftopStatus = (
  value: Resource
): Timestamped<RooftopStatus> | undefined => {
  if (!value.value || !value.timestamp) return undefined;
  return {
    value: rooftopStatusMap[value.value],
    timestamp: value?.timestamp,
  };
};

const sunroofStatusMap: Record<string, SunroofStatus> = {
  "0": SunroofStatus.CLOSED,
  "1": SunroofStatus.OPEN,
  "2": SunroofStatus.LIFTING_OPEN,
  "3": SunroofStatus.RUNNING,
  "4": SunroofStatus.ANTI_BLOOMING,
  "5": SunroofStatus.INTERMEDIATE,
  "6": SunroofStatus.LIFTING_INTERMEDIATE,
};

export const parseSunroofStatus = (
  value: Resource
): Timestamped<SunroofStatus> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: sunroofStatusMap[value.value],
    timestamp: value.timestamp,
  };
};

const windowsStatusMap: Record<string, WindowsStatus> = {
  "0": WindowsStatus.INTERMEDIATE,
  "1": WindowsStatus.OPEN,
  "2": WindowsStatus.CLOSED,
  "3": WindowsStatus.AIRING,
  "4": WindowsStatus.INTERMEDIATE_AIRING,
  "5": WindowsStatus.RUNNING,
};

export const parseWindowsStatus = (
  value: Resource
): Timestamped<WindowsStatus> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: windowsStatusMap[value.value],
    timestamp: value?.timestamp,
  };
};

const doorLockStatusMap: Record<string, DoorLockStatus> = {
  "0": DoorLockStatus.UNLOCKED,
  "1": DoorLockStatus.INTERNAL_LOCKED,
  "2": DoorLockStatus.EXTERNAL_LOCKED,
  "3": DoorLockStatus.SELECTIVE_UNLOCKED,
};

export const parseDoorLockStatus = (
  value: Resource
): Timestamped<DoorLockStatus> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: doorLockStatusMap[value.value],
    timestamp: value?.timestamp,
  };
};

export const parseNumber = (
  value: Resource
): Timestamped<number> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: Number(value.value),
    timestamp: value.timestamp,
  };
};

export const parsePercentNumber = (value: Resource) => {
  const parsed = parseNumber(value);
  if (parsed) parsed.value = parsed.value / 100;
  return parsed;
};
