import { FC, PropsWithChildren } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Layout from "./Layout";
import React from "react";
import Routes from "./consts/Routes";
import RidesPage from "./pages/RidesPage";
import NewRidePage from "./pages/NewRidePage";
import SettingsPage from "./pages/SettingsPage";

const RoutesComponent: FC<PropsWithChildren<{}>> = ({ children }) => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: Routes.RIDES,
          element: <RidesPage />,
        },
        {
          path: Routes.NEW_RIDE,
          element: <NewRidePage />,
        },
        {
          path: Routes.SETTINGS,
          element: <SettingsPage />,
        },
      ],
    },
  ]);

  return routes;
};

const Router: FC<PropsWithChildren<{}>> = ({ children }) => (
  <BrowserRouter>
    <RoutesComponent />
  </BrowserRouter>
);

export default Router;
