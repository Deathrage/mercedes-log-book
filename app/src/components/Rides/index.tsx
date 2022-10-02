import {
  Button,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  formatCoordinates,
  formatDateTime,
  formatKilometers,
  formatKilowattHours,
  formatLiters,
  formatPercentage,
} from "src/helpers/formatters";
import { DoubleTableCell } from "../DoubleTableCell";
import RideDialog from "../RideDialog";
import { useApi } from "../../api";
import { useVehicle } from "../../hooks/vehicle";
import { isNumber } from "../../../../api/helpers-shared/predicate";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../../../../api/helpers-shared/propulsion";
import { RideDialogMode, RideDialogModeType } from "../RideDialog/types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { RideActions } from "./RideActions";
import RideData from "../../../../api/model-shared/RideData";

const FromTo: FC<{
  from: string | null | undefined;
  to: string | null | undefined;
}> = ({ from, to }) => (
  <Stack direction="row">
    {from ?? "-"}
    <ArrowRightAltIcon />
    {to ?? "-"}
  </Stack>
);

const pageSize = 10;

const Rides: FC<{
  controlled?: {
    rides: RideData[];
    onDeleted: (rideId: string) => void;
    onEdited: (ride: RideData) => void;
  };
}> = ({ controlled }) => {
  const controlledFromAbove = !!controlled;
  const controlledRides = controlled?.rides;
  const controlledOnEdited = controlled?.onEdited;

  const {
    id: vehicleId,
    propulsion,
    capacity: { gas: gasCapacity, battery: batteryCapacity },
  } = useVehicle();

  const [mode, setMode] = useState<RideDialogMode>({
    type: RideDialogModeType.CLOSED,
  });

  const [page, setPage] = useState(0);

  const {
    data,
    running: loadingGet,
    invoke: invokeGet,
  } = useApi((_) => _.getRides);
  const fetch = useCallback(
    () => invokeGet({ vehicleId, page, pageSize }),
    [invokeGet, page, vehicleId]
  );
  useEffect(() => {
    if (controlledFromAbove) return;
    fetch();
  }, [fetch, controlledFromAbove]);

  const { running: loadingDelete, invoke: invokeDelete } = useApi(
    (_) => _.deleteRide
  );

  const showGas = hasCombustionEngine(propulsion);
  const showBattery = hasElectricEngine(propulsion);

  return (
    <TableContainer>
      {!controlledFromAbove && (
        <Button
          autoFocus
          color="inherit"
          sx={{ ml: "auto", display: "block" }}
          onClick={() => setMode({ type: RideDialogModeType.CREATE })}
        >
          New
        </Button>
      )}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Started</TableCell>
            <TableCell>Ended</TableCell>
            <TableCell>Odometer</TableCell>
            {showGas && <TableCell>Gas</TableCell>}
            {showBattery && <TableCell>Battery</TableCell>}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {!controlledRides && (loadingGet || !data) ? (
            <TableRow>
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : (
            (controlledRides ?? data?.rides)?.map(
              ({
                id,
                departed,
                arrived,
                address,
                coordinates,
                odometer,
                gas,
                battery,
                ...rest
              }) => (
                <TableRow key={id}>
                  <DoubleTableCell
                    first={
                      address.start ??
                      formatCoordinates(coordinates.start) ??
                      "-"
                    }
                    second={formatDateTime(departed)}
                  />
                  <DoubleTableCell
                    first={
                      address.end ?? formatCoordinates(coordinates.end) ?? "-"
                    }
                    second={formatDateTime(arrived)}
                  />
                  <DoubleTableCell
                    first={
                      <FromTo
                        from={formatKilometers(odometer.start)}
                        to={formatKilometers(odometer.end)}
                      />
                    }
                    second={
                      isNumber(odometer.start) && isNumber(odometer.end)
                        ? formatKilometers(odometer.end - odometer.start)
                        : "-"
                    }
                  />
                  {showGas && (
                    <DoubleTableCell
                      first={
                        <FromTo
                          from={formatPercentage(gas.start)}
                          to={formatPercentage(gas.end)}
                        />
                      }
                      second={`Approx. ${
                        isNumber(gasCapacity) &&
                        isNumber(gas.start) &&
                        isNumber(gas.end)
                          ? formatLiters(
                              gas.start * gasCapacity - gas.end * gasCapacity
                            )
                          : "-"
                      }`}
                    />
                  )}
                  {showBattery && (
                    <DoubleTableCell
                      first={
                        <FromTo
                          from={formatPercentage(battery.start)}
                          to={formatPercentage(battery.end)}
                        />
                      }
                      second={`Approx. ${
                        isNumber(batteryCapacity) &&
                        isNumber(battery.start) &&
                        isNumber(battery.end)
                          ? formatKilowattHours(
                              battery.start * batteryCapacity -
                                battery.end * batteryCapacity
                            )
                          : "-"
                      }`}
                    />
                  )}
                  <TableCell align="right">
                    <RideActions
                      loading={loadingDelete}
                      onlyEditOrDelete={controlledFromAbove}
                      ride={{
                        id,
                        departed,
                        arrived,
                        address,
                        coordinates,
                        odometer,
                        gas,
                        battery,
                        ...rest,
                      }}
                      onReturn={() =>
                        setMode({
                          type: RideDialogModeType.RETURN,
                          returnFromId: id!,
                        })
                      }
                      onCopy={() =>
                        setMode({
                          type: RideDialogModeType.CREATE,
                          templateId: id,
                        })
                      }
                      onEdit={() =>
                        setMode({
                          type: RideDialogModeType.EDIT,
                          id: id!,
                        })
                      }
                      onDelete={async () => {
                        await invokeDelete({ id: id!, vehicleId });

                        if (controlled) controlled.onDeleted(id!);
                        else fetch();
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
      {!controlledFromAbove && (
        <TablePagination
          component="div"
          count={-1}
          rowsPerPageOptions={[pageSize]}
          rowsPerPage={pageSize}
          page={pageSize}
          onPageChange={(_, page) => setPage(page)}
        />
      )}
      <RideDialog
        mode={mode}
        onClose={useCallback(
          () => setMode({ type: RideDialogModeType.CLOSED }),
          []
        )}
        onSaved={useCallback(
          (ride: RideData) => {
            setMode({ type: RideDialogModeType.CLOSED });
            if (controlledOnEdited) controlledOnEdited(ride);
            else fetch();
          },
          [controlledOnEdited, fetch]
        )}
      />
    </TableContainer>
  );
};

export default Rides;
