import {
  Box,
  Button,
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
import React, { FC, useCallback, useState } from "react";
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
import useVehicleId from "../hooks/useVehicle";
import useOnMount from "src/hooks/useOnMount";
import { isNumber } from "src/helpers/predicate";

const CREATE = Symbol("Creating rides");

const pageSize = 10;

const Rides: FC<{ onlyFirstPage?: true; allowCreate?: true }> = ({
  onlyFirstPage,
  allowCreate,
}) => {
  const vehicleId = useVehicleId();

  const [id, setId] = useState<string | typeof CREATE | null>(null);

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
  useOnMount(() => {
    fetch();
  });

  const { running: loadingDelete, invoke: invokeDelete } = useApi(
    (_) => _.deleteRide
  );

  return (
    <TableContainer>
      {allowCreate && (
        <Button
          autoFocus
          color="inherit"
          sx={{ ml: "auto", display: "block" }}
          onClick={() => setId(CREATE)}
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
                    isNumber(ride.consumption.gas?.relative)
                      ? formatPercentage(ride.consumption.gas!.relative)
                      : "-"
                  } approx. ${
                    isNumber(ride.consumption.gas?.absolute)
                      ? formatLiters(ride.consumption.gas!.absolute)
                      : "-"
                  }`}
                  second={`Battery: ${
                    isNumber(ride.consumption.battery?.relative)
                      ? formatPercentage(ride.consumption.battery!.relative)
                      : "-"
                  } approx. ${
                    isNumber(ride.consumption.battery?.absolute)
                      ? formatKilowattHours(ride.consumption.battery!.absolute)
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
                  <IconButton
                    onClick={() => setId(ride.id)}
                    disabled={loadingDelete}
                  >
                    <EditIcon />
                  </IconButton>
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
        open={!!id}
        rideId={typeof id === "string" ? id : undefined}
        onClose={useCallback(() => setId(null), [])}
        onSaved={useCallback(() => {
          setId(null);
          fetch();
        }, [fetch])}
      />
    </TableContainer>
  );
};

export default Rides;
