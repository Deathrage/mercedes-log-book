import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { FC } from "react";
import {
  formatDateTime,
  formatKilometers,
  formatKilowattHours,
  formatLiters,
  formatPercentage,
} from "src/helpers/formaters";
import { DoubleTableCell } from "./DoubleTableCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Rides: FC<{ onlyFirstPage?: true }> = ({ onlyFirstPage }) => {
  return (
    <TableContainer>
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
          <TableRow>
            <DoubleTableCell
              first="J. Novak 86, Brno"
              second={formatDateTime(new Date())}
            />
            <DoubleTableCell
              first="J. Novak 86, Praha"
              second={formatDateTime(new Date())}
            />
            <TableCell align="right">{formatKilometers(12.52)}</TableCell>
            <DoubleTableCell
              first={`Gas: ${formatPercentage(0.15)} approx. ${formatLiters(
                10
              )}`}
              second={`Battery: ${formatPercentage(
                0.55
              )} approx. ${formatKilowattHours(25)}`}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                lectus augue, molestie non lectus non, volutpat tristique lacus.
                Nunc egestas ante maximus eros gravida, nec bibendum nisl
                aliquam.
              </Box>
            </TableCell>
            <TableCell align="right">
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {!onlyFirstPage && (
        <TablePagination
          component="div"
          count={15}
          rowsPerPageOptions={[10]}
          rowsPerPage={10}
          page={0}
          onPageChange={console.log}
        />
      )}
    </TableContainer>
  );
};

export default Rides;
