import { Button, Divider, Stack, Typography } from "@mui/material";import { Link } from "react-router-dom";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout = ({ children }: { children: JSX.Element }) => {
  const {
    data: tabs,
    error,
    isLoading,
  } = useSWR(
    "https://f1tv.formula1.com/2.0/R/FRA/WEB_DASH/ALL/MENU/F1_TV_Pro_Annual/1",
    fetcher
  );

  console.log(tabs);

  return (
    <>
      <Typography variant="h2" textAlign={"center"}>
        FIAViewer
      </Typography>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error {error}</div>}

      <Stack direction={"row"}>
        <Stack spacing={0} direction={"column"} width={160}>
          {tabs &&
            tabs.resultObj.containers.map((container: any) =>
              container.actions[0].href !== "/search" ? (
                <Button component={Link} to={container.actions[0].href === "/" ? "/home" : container.actions[0].href} key={container.metadata.label}>
                  {container.metadata.label}
                </Button>
              ) : (
                ""
              )
            )}
        </Stack>
        <Divider light={true} />
        <div>{children}</div>
      </Stack>
    </>
  );
};

export default Layout;
