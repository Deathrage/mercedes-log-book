import { ValidationErrors } from "final-form";
import {
  numberIsGreaterOrEqual,
  numberIsLessOrEqual,
  numberIsMultiple,
} from "../../helpers/form";
import { RideFormValues } from "./types";

const validate = (values: RideFormValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  numberIsGreaterOrEqual(values, "startOdometer", errors).to(0);
  numberIsGreaterOrEqual(values, "startGas", errors).to(0);
  numberIsGreaterOrEqual(values, "startBattery", errors).to(0);

  numberIsLessOrEqual(values, "startGas", errors).to(1, 100, true);
  numberIsLessOrEqual(values, "startBattery", errors).to(1, 100, true);

  numberIsGreaterOrEqual(values, "endOdometer", errors).to(0);
  numberIsGreaterOrEqual(values, "endGas", errors).to(0);
  numberIsGreaterOrEqual(values, "endBattery", errors).to(0);

  numberIsLessOrEqual(values, "endGas", errors).to(1, 100, true);
  numberIsLessOrEqual(values, "endBattery", errors).to(1, 100, true);

  numberIsMultiple(values, "startOdometer", errors).of(1);
  numberIsMultiple(values, "startGas", errors).of(0.01, 100, true);
  numberIsMultiple(values, "startBattery", errors).of(0.01, 100, true);

  numberIsMultiple(values, "endOdometer", errors).of(1);
  numberIsMultiple(values, "endGas", errors).of(0.01, 100, true);
  numberIsMultiple(values, "endBattery", errors).of(0.01, 100, true);

  return errors;
};

export default validate;
