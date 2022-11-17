import { Button } from "@mui/material";
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
    <>
      <Button
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          borderWidth: "clamp(0.125rem, 1vw, 0.5rem)",
          "&:hover": {
            borderWidth: "clamp(0.125rem, 1vw, 0.5rem)",
          },
          p: 0,
        }}
        disabled={onRide || loading}
        variant="outlined"
        color="success"
        onClick={onBeginClick}
      >
        <PlayArrowOutlinedIcon sx={{ fontSize: "clamp(1rem, 4vw, 3rem)" }} />
      </Button>
      <Button
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          borderWidth: "clamp(0.125rem, 1vw, 0.5rem)",
          "&:hover": {
            borderWidth: "clamp(0.125rem, 1vw, 0.5rem)",
          },
          p: 0,
        }}
        disabled={!onRide || loading}
        variant="outlined"
        color="error"
        onClick={onFinishClick}
      >
        <FlagOutlinedIcon sx={{ fontSize: "clamp(1rem, 4vw, 3rem)" }} />
      </Button>
    </>
  );
};

export default BeginFinishButtons;
