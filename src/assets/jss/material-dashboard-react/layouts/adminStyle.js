import {
  drawerWidth,
  transition,
  container
} from "assets/jss/material-dashboard-react.js";

const appStyle = theme => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100vh",
    width: "100%",
    overflowScrolling: "touch"
  },
  content: {
    minHeight: "calc(100vh - 123px)"
  },
  container,
});

export default appStyle;
