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
  parser: (value: Resource | undefined) => Timestamped<Value>
) => {
  const response = responses.find((r) => Reflect.has(r, key));
  return parser(response);
};

export const parseBoolean = (
  value: Resource | undefined
): Timestamped<boolean> => {
  if (value?.value === undefined)
    return { value: undefined, timestamp: undefined };
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
  value: Resource | undefined
): Timestamped<LightSwitchPosition> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
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
  value: Resource | undefined
): Timestamped<RooftopStatus> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
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
  value: Resource | undefined
): Timestamped<SunroofStatus> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
  return {
    value: sunroofStatusMap[value.value],
    timestamp: value?.timestamp,
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
  value: Resource | undefined
): Timestamped<WindowsStatus> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
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
  value: Resource | undefined
): Timestamped<DoorLockStatus> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
  return {
    value: doorLockStatusMap[value.value],
    timestamp: value?.timestamp,
  };
};

export const parseNumber = (
  value: Resource | undefined
): Timestamped<number> => {
  if (value?.value == undefined)
    return { value: undefined, timestamp: undefined };
  return {
    value: Number(value.value),
    timestamp: value.timestamp,
  };
};
