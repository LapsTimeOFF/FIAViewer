import { Container, Button, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import React from "react";

const Login = () => {
  return (
    <Container sx={{ backgroundColor: "#121212" }}>
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          paddingX: 4,
          paddingY: 1.5,
        }}
        size={"large"}
        onClick={() => {
          window.f1tv.auth.signIn();
        }}
      >
        <Typography>Sign in using F1TV Account </Typography>
        <ArrowRightAltIcon />
      </Button>
    </Container>
  );
};

export default Login;
