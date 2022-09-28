import { useCallback, useMemo } from "react";
import { useApi } from "../../api";
import { mapToReturnValues, mapToValues } from "./helpers";
import { RideDialogMode, RideDialogModeType, RideFormValues } from "./types";
import { mapToRideData } from "./helpers";
import { turnEmptyValuesToUndefined } from "../../helpers/form";
import { useVehicleId } from "../../hooks/vehicle";
import { FormApi } from "final-form";

export const useInitialValues = ({ type }: RideDialogMode) => {
  const { data, running, invoke, reset } = useApi((_) => _.getRide);

  const initialValues = useMemo<RideFormValues | undefined>(() => {
    if (type === RideDialogModeType.CLOSED) return undefined;
    if (running || !data) return undefined;

    if (type === RideDialogModeType.RETURN) return mapToReturnValues(data);

    return mapToValues(data);
  }, [data, type, running]);

  return {
    loading: running,
    initialValues,
    reset,
    load: invoke,
  };
};

export const useOnSubmit = (mode: RideDialogMode, onSaved: () => void) => {
  const vehicleId = useVehicleId();

  const id = mode.type === RideDialogModeType.EDIT ? mode.id : undefined;

  const { invoke: invokePost } = useApi((_) => _.postRide);
  const onSubmit = useCallback(
    async (state: RideFormValues, formApi: FormApi<RideFormValues>) => {
      const request = mapToRideData(
        id,
        vehicleId,
        turnEmptyValuesToUndefined(state)
      );

      await invokePost(request);

      onSaved();
      formApi.restart();
    },
    [id, vehicleId, invokePost, onSaved]
  );

  return onSubmit;
};
