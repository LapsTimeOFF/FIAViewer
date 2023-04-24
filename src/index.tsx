import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./samples/node-api";
import "./style/index.scss";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: red["A700"],
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
