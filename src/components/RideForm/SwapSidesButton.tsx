import { Button } from "@mui/material";
import React, { FC, useCallback } from "react";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useForm } from "react-final-form";
import { RideFormValues } from "./types";

const SwapSidesButton: FC = () => {
  const form = useForm<RideFormValues>();

  const swap = useCallback(() => {
    const { values } = form.getState();
    const renamedStartValue = Object.entries(values)
      .filter(([key]) => key.startsWith("start"))
      .map(([key, value]) => [key.replace(/^start/, "end"), value]) as [
      keyof RideFormValues,
      unknown
    ][];

    const renamedEndValue = Object.entries(values)
      .filter(([key]) => key.startsWith("end"))
      .map(([key, value]) => [key.replace(/^end/, "start"), value]) as [
      keyof RideFormValues,
      unknown
    ][];

    const renamedDeparted: [keyof RideFormValues, unknown] = [
      "arrived",
      values["departed"],
    ];
    const renamedArrived: [keyof RideFormValues, unknown] = [
      "departed",
      values["arrived"],
    ];

    const feed = renamedStartValue.concat(
      renamedEndValue,
      renamedEndValue,
      [renamedDeparted],
      [renamedArrived]
    );

    for (const [fieldName, value] of feed) form.change(fieldName, value as any);
  }, [form]);

  return (
    <Button
      variant="outlined"
      sx={{ display: "flex", margin: "0 auto" }}
      onClick={swap}
    >
      <SwapHorizIcon sx={{ marginRight: "0.5rem" }} />
      Swap sides
    </Button>
  );
};

export default SwapSidesButton;
