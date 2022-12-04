import {
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
import { DoubleTableCell } from "../../../components/DoubleTableCell";
import RideDialog from "../../../components/RideDialog";
import { useLazyApi } from "../../../api";
import { useVehicleId } from "../../../hooks/vehicle";
import {
  RideDialogMode,
  RideDialogModeType,
} from "../../../components/RideDialog/types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { RideActions } from "./RideActions";
import { hasCombustionEngine, hasElectricEngine } from "@shared/helpers";
import useOnMount from "../../../hooks/useOnMount";

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

const Rides: FC = () => {
  const vehicleId = useVehicleId();

  const { data: vehicle, invoke } = useLazyApi((_) => _.vehicle, {
    defaultRunning: true,
  });
  useOnMount(() => void invoke(vehicleId));
  const gasCapacity = vehicle?.capacity.gas;
  const batteryCapacity = vehicle?.capacity.battery;

  const [mode, setMode] = useState<RideDialogMode>({
    type: RideDialogModeType.CLOSED,
  });

  const [page, setPage] = useState(0);

  const { data, invoke: invokeGet } = useLazyApi((_) => _.rides);
  const fetch = useCallback(
    () => invokeGet({ vehicleId, page, pageSize }),
    [invokeGet, page, vehicleId]
  );
  useEffect(() => {
    fetch();
  }, [fetch]);

  const { running: loadingDelete, invoke: invokeDelete } = useLazyApi(
    (_) => _.deleteRide
  );

  const showGas = vehicle && hasCombustionEngine(vehicle.propulsion);
  const showBattery = vehicle && hasElectricEngine(vehicle.propulsion);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Started</TableCell>
            <TableCell>Ended</TableCell>
            <TableCell>Odometer</TableCell>
            {showGas && <TableCell>Gas</TableCell>}
            {showBattery && <TableCell>Battery</TableCell>}
            <TableCell sx={{ width: "8rem" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!data ? (
            <TableRow>
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              {showGas && (
                <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              )}
              {showBattery && (
                <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              )}
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : (
            data.rides.map(
              ({
                id,
                departed,
                arrived,
                address,
                coordinates,
                odometer,
                gas,
                battery,
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
                      typeof odometer.start === "number" &&
                      typeof odometer.end === "number"
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
                        typeof gasCapacity === "number" &&
                        typeof gas.start === "number" &&
                        typeof gas.end === "number"
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
                        typeof batteryCapacity === "number" &&
                        typeof battery.start === "number" &&
                        typeof battery.end === "number"
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
                      ride={{
                        id,
                        address,
                        coordinates,
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
                        fetch();
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={-1}
        rowsPerPageOptions={[pageSize]}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, page) => setPage(page)}
      />
      <RideDialog
        mode={mode}
        onClose={useCallback(
          () => setMode({ type: RideDialogModeType.CLOSED }),
          []
        )}
        onSaved={useCallback(() => {
          setMode({ type: RideDialogModeType.CLOSED });
          fetch();
        }, [fetch])}
      />
    </TableContainer>
  );
};

export default Rides;
