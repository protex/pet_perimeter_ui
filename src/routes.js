/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LocationOn from "@material-ui/icons/LocationOn";
// core components/views for Admin layout
import PerimeterMap from "views/Maps/PerimeterMap.js";
import HeatMap from "views/Maps/HeatMap.js";

const dashboardRoutes = [
  {
    path: "/heatmap",
    name: "Heatmap",
    icon: Dashboard,
    component: HeatMap,
    layout: "/admin"
  },
  {
    path: "/perimetermap",
    name: "Perimeter Map",
    icon: LocationOn,
    component: PerimeterMap,
    layout: "/admin"
  },
];

export default dashboardRoutes;
