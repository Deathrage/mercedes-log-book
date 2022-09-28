import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Skeleton,
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
  formatDateTime,
  formatKilometers,
  formatKilowattHours,
  formatLiters,
  formatPercentage,
} from "src/helpers/formatters";
import { DoubleTableCell } from "./DoubleTableCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RideDialog from "./RideDialog";
import { useApi } from "../api";
import { useVehicle } from "../hooks/vehicle";
import { isNumber } from "src/helpers/predicate";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { RideDialogMode, RideDialogModeType } from "./RideDialog/types";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const pageSize = 10;

const Rides: FC<{
  onlyFirstPage?: true;
  disableCreate?: true;
  disableReturn?: true;
  disableCopy?: true;
  disableEdit?: true;
  disableDelete?: true;
}> = ({
  onlyFirstPage,
  disableCreate,
  disableReturn,
  disableCopy,
  disableEdit,
  disableDelete,
}) => {
  const {
    id: vehicleId,
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

  const { running: loadingDelete, invoke: invokeDelete } = useApi(
    (_) => _.deleteRide
  );

  return (
    <TableContainer>
      {!disableCreate && (
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
            <TableCell align="right">Distance</TableCell>
            <TableCell>Consumption</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingGet || !data ? (
            <TableRow>
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <TableCell>
                <Skeleton />
              </TableCell>
              <DoubleTableCell first={<Skeleton />} second={<Skeleton />} />
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : (
            data.rides.map((ride) => (
              <TableRow key={ride.id}>
                <DoubleTableCell
                  first={ride.startLocation.address || "-"}
                  second={formatDateTime(ride.departed)}
                />
                <DoubleTableCell
                  first={ride.endLocation.address || "-"}
                  second={formatDateTime(ride.arrived)}
                />
                <TableCell align="right">
                  {isNumber(ride.distance)
                    ? formatKilometers(ride.distance)
                    : "-"}
                </TableCell>
                <DoubleTableCell
                  first={`Gas: ${
                    isNumber(ride.consumption.gas)
                      ? formatPercentage(ride.consumption.gas)
                      : "-"
                  } approx. ${
                    isNumber(ride.consumption.gas) && isNumber(gasCapacity)
                      ? formatLiters(gasCapacity * ride.consumption.gas)
                      : "-"
                  }`}
                  second={`Battery: ${
                    isNumber(ride.consumption.battery)
                      ? formatPercentage(ride.consumption.battery)
                      : "-"
                  } approx. ${
                    isNumber(ride.consumption.battery) &&
                    isNumber(batteryCapacity)
                      ? formatKilowattHours(
                          batteryCapacity * ride.consumption.battery
                        )
                      : "-"
                  }`}
                />
                <TableCell>
                  <Box
                    sx={{
                      maxWidth: "10rem",
                      maxHeight: "3rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {ride.reason || "-"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup>
                    {!disableReturn && (
                      <IconButton
                        onClick={() =>
                          setMode({
                            type: RideDialogModeType.RETURN,
                            returnFromId: ride.id,
                          })
                        }
                        disabled={loadingDelete}
                      >
                        <KeyboardReturnIcon />
                      </IconButton>
                    )}
                    {!disableCopy && (
                      <IconButton
                        onClick={() =>
                          setMode({
                            type: RideDialogModeType.CREATE,
                            templateId: ride.id,
                          })
                        }
                        disabled={loadingDelete}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    )}
                    {!disableEdit && (
                      <IconButton
                        onClick={() =>
                          setMode({
                            type: RideDialogModeType.EDIT,
                            id: ride.id,
                          })
                        }
                        disabled={loadingDelete}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {!disableDelete && (
                      <IconButton
                        color="error"
                        onClick={async () => {
                          await invokeDelete({ id: ride.id, vehicleId });
                          fetch();
                        }}
                        disabled={loadingDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
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
};

export default Rides;
