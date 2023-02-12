import { Container, Button, Typography, Box } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import React from "react";

const Login = () => {
  window.fiaviewer.f1tv.events.handleAuthLogged(() => {
    location.hash = "";
  });

  return (
    <Container sx={{ backgroundColor: "#121212", color: "text.primary" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h1" sx={{ my: 4 }}>
          FIAViewer
        </Typography>
        <Button
          variant="contained"
          sx={{
            paddingX: 4,
            paddingY: 1.5,
          }}
          size={"large"}
          onClick={() => {
            window.fiaviewer.f1tv.auth.signIn();
          }}
        >
          <Typography>Sign in using F1TV Account </Typography>
          <ArrowRightAltIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
