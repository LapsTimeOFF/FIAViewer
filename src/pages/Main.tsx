import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import "../style/Main.scss";

const Main = () => {
  useEffect(() => {
    const checkExpired = async () => {
      if (
        (await window.f1tv.auth.getPayload()) === undefined ||
        (await window.f1tv.auth.checkExpired())
      )
        location.hash = "/login";
    };

    setTimeout(() => {
      checkExpired();
    }, 1000);
  }, []);

  return (
    <Container>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress thickness={5} sx={{ ml: 2 }} />
          <Typography
            sx={{
              color: "text.primary",
              mt: 2,
            }}
          >
            Loading...
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Main;
