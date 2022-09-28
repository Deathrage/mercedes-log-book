import { useCallback, useMemo } from "react";
import { useApi } from "../../api";
import { mapToValues } from "./helpers";
import { RideFormValues } from "./types";
import { mapToRideData } from "./helpers";
import { turnEmptyValuesToUndefined } from "../../helpers/form";
import useVehicleId from "../../hooks/useVehicle";
import { FormApi } from "final-form";

export const useInitialValues = (id: string | undefined) => {
  const { data, running, invoke, reset } = useApi((_) => _.getRide);

  const initialValues = useMemo<RideFormValues | undefined>(() => {
    if (!id || running || !data) return undefined;
    return mapToValues(data);
  }, [data, id, running]);

  return {
    loading: id ? running : false,
    initialValues,
    reset,
    load: invoke,
  };
};

export const useOnSubmit = (id: string | undefined, onSaved: () => void) => {
  const vehicleId = useVehicleId();

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
    [id, vehicleId, onSaved, invokePost]
  );

  return onSubmit;
};
