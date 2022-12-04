import { useCallback, useMemo } from "react";
import { useLazyApi } from "../../api";
import { mapToReturnValues, mapToValues } from "./helpers";
import { RideDialogMode, RideDialogModeType } from "./types";
import { useVehicleId } from "../../hooks/vehicle";
import { RideFormValues } from "../RideForm/types";
import { mapToCreatePayload, mapToUpdatePayload } from "../RideForm/helpers";

export const useInitialValues = ({ type }: RideDialogMode) => {
  const { data, running, invoke, reset } = useLazyApi((_) => _.ride);

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

  const { invoke: create } = useLazyApi((_) => _.createRide);
  const { invoke: update } = useLazyApi((_) => _.updateRide);

  const onSubmit = useCallback(
    async (state: RideFormValues) => {
      if (id) await update(mapToUpdatePayload(id, vehicleId, state));
      else await create(mapToCreatePayload(vehicleId, state));

      onSaved();
    },
    [id, vehicleId, update, create, onSaved]
  );

  return onSubmit;
};
