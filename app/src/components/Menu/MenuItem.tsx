import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItem: FC<{
  action: string | (() => void);
  icon: ReactNode;
  title: string;
}> = ({ action, icon, title }) => {
  const { pathname } = useLocation();

  const content = (
    <>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </>
  );

  if (typeof action === "function")
    return <ListItemButton onClick={action}>{content}</ListItemButton>;

  return (
    <ListItemButton<typeof Link>
      selected={pathname === action}
      to={action}
      component={Link}
    >
      {content}
    </ListItemButton>
  );
};

export default MenuItem;
