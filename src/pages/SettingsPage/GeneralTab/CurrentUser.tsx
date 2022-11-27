import React, { FC } from "react";
import { useCurrentUserContext } from "src/components/currentUser/hooks";
import InfoField from "src/components/InfoField";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Grid } from "@mui/material";

const CurrentUser: FC = () => {
  const { id, mercedesBenzPaired } = useCurrentUserContext();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <InfoField label="Identification/E-mail">{id}</InfoField>
      </Grid>
      <Grid item xs={12} lg={6}>
        <InfoField label="Mercedes Benz connected" noBorder>
          {mercedesBenzPaired ? <CheckIcon /> : <CloseIcon />}
        </InfoField>
      </Grid>
    </Grid>
  );
};

export default CurrentUser;
