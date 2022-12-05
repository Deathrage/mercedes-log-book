import { ColInfo, WorkSheet } from "xlsx-js-style/types";
import { range } from "../../helpers/array";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../../helpers/propulsion";
import { extractNotNumbers, extractNumber } from "../../helpers/string";
import Ride from "../../model/entities/Ride";
import Vehicle from "../../model/entities/Vehicle";

export const toRows = (
  vehicle: Vehicle,
  rides: Ride[]
): Record<string, unknown>[] => {
  const vehicleValue = vehicle.license ?? vehicle.id;

  return rides.map(
    ({ departed, arrived, address, battery, gas, odometer, reason, note }) => {
      // Order in object matters as it is order of cols exported
      const row: Record<string, unknown> = {};

      row["Vehicle"] = vehicleValue;
      row["Departed"] = departed ?? null;
      row["Arrived"] = arrived ?? null;
      row["Starting point"] = address.start ?? null;
      row["Destination"] = address.end ?? null;
      row["Odometer (km) - start"] = odometer.start ?? null;
      row["Odometer (km) - end"] = odometer.end ?? null;

      if (hasCombustionEngine(vehicle.propulsion)) {
        row["Gas (%) - start"] = gas.start ?? null;
        row["Gas (%) - end"] = gas.end ?? null;
      }

      if (hasElectricEngine(vehicle.propulsion)) {
        row["Battery (%) - start"] = battery.start ?? null;
        row["Battery (%) - end"] = battery.end ?? null;
      }

      row["Reason"] = reason;
      row["Note"] = note;

      return row;
    }
  );
};

const getWorksheetRanges = (sheet: WorkSheet) => {
  const [firstCell, lastCell] = sheet["!ref"]!.split(":");

  const firstCol = extractNotNumbers(firstCell);
  const firstRowRaw = extractNumber(firstCell);

  const lastCol = extractNotNumbers(lastCell);
  const lastRowRaw = extractNumber(lastCell);

  const firstRow = Number(firstRowRaw);
  const lastRow = Number(lastRowRaw);

  const rows = range(firstRow, lastRow);

  const cols = range(
    firstCol.charCodeAt(0),
    lastCol.charCodeAt(0),
    String.fromCharCode
  );

  return {
    col: {
      min: firstCol,
      max: lastCol,
    },
    row: {
      min: firstRow,
      max: lastRow,
    },
    rows,
    cols,
  };
};

export const autosizeColumns = (sheet: WorkSheet) => {
  const { rows, cols } = getWorksheetRanges(sheet);

  const colInfos = cols.map<ColInfo>((col) => {
    let biggest: number = -1;

    for (const row of rows) {
      const value = sheet[`${col}${row}`];
      const size = typeof value?.v === "string" ? value.v.length : -1;
      if (size > biggest) biggest = size;
    }

    return {
      // Default width of column is 20
      width: biggest > 20 ? biggest : 20,
    };
  });

  sheet["!cols"] = colInfos;
};

export const styleHeader = (sheet: WorkSheet) => {
  const { rows, cols } = getWorksheetRanges(sheet);
  const firstRow = rows[0];

  for (const col of cols) {
    const cellCode = `${col}${firstRow}`;
    const cell = sheet[cellCode];
    if (!cell) continue;

    cell.s = {
      fill: {
        fgColor: {
          rgb: "000000",
        },
      },
      font: {
        bold: true,
        color: {
          rgb: "FFFFFF",
        },
      },
    };
  }
};
