import { Button, Paper } from "@mui/material";
import React, { FC } from "react";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

const BeginFinishButtons: FC<{
  loading: boolean;
  onRide: boolean;
  onBeginClick: () => void;
  onFinishClick: () => void;
}> = ({ loading, onRide, onBeginClick, onFinishClick }) => {
  return (
    <Paper sx={{ p: 2, width: "100%", height: "100%" }}>
      <Button
        sx={{
          width: "50%",
          aspectRatio: "1/1",
          borderWidth: "clamp(0.125rem, 1vw, 0.75rem)",
        }}
        disabled={onRide || loading}
        variant="outlined"
        color="success"
        onClick={onBeginClick}
      >
        <PlayArrowOutlinedIcon sx={{ fontSize: "clamp(2rem, 4vw, 5rem)" }} />
      </Button>
      <Button
        sx={{
          width: "50%",
          aspectRatio: "1/1",
          borderWidth: "clamp(0.125rem, 1vw, 0.75rem)",
        }}
        disabled={!onRide || loading}
        variant="outlined"
        color="error"
        onClick={onFinishClick}
      >
        <FlagOutlinedIcon sx={{ fontSize: "clamp(2rem, 4vw, 5rem)" }} />
      </Button>
    </Paper>
  );
};

export default BeginFinishButtons;
