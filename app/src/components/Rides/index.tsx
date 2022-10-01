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
import React, {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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

export interface RidesHandler {
  refetch: () => void;
}

const Rides = forwardRef<
  RidesHandler,
  {
    onlyFirstPage?: true;
    disableActions?: boolean;
  }
>(({ onlyFirstPage, disableActions }, ref) => {
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
    fetch();
  }, [fetch]);

  useImperativeHandle(
    ref,
    () => ({
      refetch: fetch,
    }),
    [fetch]
  );

  const { running: loadingDelete, invoke: invokeDelete } = useApi(
    (_) => _.deleteRide
  );

  const showGas = hasCombustionEngine(propulsion);
  const showBattery = hasElectricEngine(propulsion);

  const maxWidth = disableActions ? "20rem" : "15rem";

  return (
    <TableContainer>
      {!disableActions && (
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
            <TableCell sx={{ maxWidth }}>Started</TableCell>
            <TableCell sx={{ maxWidth }}>Ended</TableCell>
            <TableCell>Odometer</TableCell>
            {showGas && <TableCell>Gas</TableCell>}
            {showBattery && <TableCell>Battery</TableCell>}
            {!disableActions && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingGet || !data ? (
            <TableRow>
              <DoubleTableCell
                sx={{ maxWidth }}
                first={<Skeleton />}
                second={<Skeleton />}
              />
              <DoubleTableCell
                sx={{ maxWidth }}
                first={<Skeleton />}
                second={<Skeleton />}
              />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              {disableActions && (
                <TableCell>
                  <Skeleton />
                </TableCell>
              )}
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
                    sx={{ maxWidth }}
                  />
                  <DoubleTableCell
                    first={
                      address.end ?? formatCoordinates(coordinates.end) ?? "-"
                    }
                    second={formatDateTime(arrived)}
                    sx={{ maxWidth }}
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
                  {!disableActions && (
                    <TableCell align="right">
                      <RideActions
                        loading={loadingDelete}
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
                          fetch();
                        }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
      {!onlyFirstPage && (
        <TablePagination
          component="div"
          count={-1}
          rowsPerPageOptions={[pageSize]}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(_, page) => setPage(page)}
        />
      )}
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
});

export default Rides;
