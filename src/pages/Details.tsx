import React from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { JSONTree } from "react-json-tree";
import { Box, Card, CardActionArea, Chip, Typography } from "@mui/material";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Teams =
  | "Red Bull Racing"
  | "Williams"
  | "McLaren"
  | "Alpine"
  | "Aston Martin"
  | "Ferrari"
  | "Haas F1 Team"
  | "AlphaTauri"
  | "Alfa Romeo"
  | "Mercedes";

interface Stream {
  racingNumber: number;
  teamName: Teams;
  type: "additional" | "obc";
  playbackUrl: string;
  driverImg: string;
  teamImg: string;
  channelId: number;
  title: string;
  reportingName: string;
  default: boolean;
  identifier: string;

  driverFirstName?: string;
  driverLastName?: string;
  constructorName?: string;
  hex?: string;
}

const order: { [K in Teams]: number } = {
  "Red Bull Racing": 0,
  Ferrari: 1,
  Mercedes: 2,
  "Aston Martin": 3,
  Alpine: 4,
  McLaren: 5,
  Williams: 6,
  "Haas F1 Team": 7,
  AlphaTauri: 8,
  "Alfa Romeo": 9,
};

const Details = () => {
  const { contentId, videoSlug } = useParams();

  const { data, isLoading } = useSWR(
    `https://f1tv.formula1.com/3.0/R/ENG/WEB_DASH/ALL/CONTENT/VIDEO/${contentId}/F1_TV_Pro_Annual/1?contentId=${contentId}&entitlement=F1_TV_Pro_Annual`,
    fetcher
  );

  const [driverStreams, setDriverStreams] = React.useState<Stream[]>([]);
  const [nonDriverStreams, setNonDriverStreams] = React.useState<Stream[]>([]);
  const [sortedDriverStreams, setSortedDriverStreams] = React.useState<
    Stream[]
  >([]);

  React.useEffect((): any => {
    if (!data) return;

    if (!data.resultObj.containers[0].metadata.additionalStreams) {
      window.fiaviewer.f1tv.player.open(
        "/player/" + contentId + "/null"
      );
      return window.history.back();
    }

    setDriverStreams(
      data.resultObj.containers[0].metadata.additionalStreams.filter(
        (r: Stream) => r.type === "obc"
      )
    );
    setNonDriverStreams(
      data.resultObj.containers[0].metadata.additionalStreams.filter(
        (r: Stream) => r.type === "additional"
      )
    );

    setSortedDriverStreams(
      data.resultObj.containers[0].metadata.additionalStreams.filter(
        (r: Stream) => r.type === "obc"
      ).sort((a: Stream, b: Stream) => order[a.teamName] - order[b.teamName])
    );
  }, [data, isLoading]);

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        {data && (
          <>
            <Card
              sx={{ m: 2, p: 1, borderRadius: 5, width: "100%" }}
              elevation={5}
            >
              <Typography variant="h2">
                <b>
                  {
                    data.resultObj.containers[0].metadata.emfAttributes.Global_Title.split(
                      " - "
                    )[0]
                  }
                </b>
              </Typography>
              <Typography variant="h5" color={"text.secondary"}>
                {data.resultObj.containers[0].metadata.longDescription}
              </Typography>
              <Chip
                color={"success"}
                sx={{ opacity: 0.8, mt: 1, mx: 0.3 }}
                label={data.resultObj.containers[0].metadata.uiDuration}
              />
              <Chip
                sx={{ opacity: 0.8, mt: 1, mx: 0.3 }}
                color={
                  data.resultObj.containers[0].metadata.entitlement === "Access"
                  ? "info"
                  : "error"
                }
                label={data.resultObj.containers[0].metadata.entitlement}
              />
            </Card>
            <JSONTree data={data} />
            {nonDriverStreams.map((stream: Stream) => (
              <Card
                key={stream.channelId}
                sx={{ m: 2, borderRadius: 5, width: "50%" }}
                elevation={5}
              >
                <CardActionArea sx={{p: 1}} onClick={() => {
                  window.fiaviewer.f1tv.player.open(`/player/${contentId}/${stream.reportingName === 'WIF' ? 'null' : stream.channelId.toString()}`);
                }}>
                  <Typography variant="h5">
                    <b>{stream.title}</b>
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
            {sortedDriverStreams.map((stream: Stream) => (
              <Card
                key={stream.channelId}
                sx={{ m: 2, borderRadius: 5, width: "50%" }}
                elevation={5}
              >
                <CardActionArea sx={{p: 1}} onClick={() => {
                  window.fiaviewer.f1tv.player.open(`/player/${contentId}/${stream.channelId}`);
                }}>
                <Typography variant="h5">
                  <b>
                    {stream.racingNumber} |{" "}
                    {stream.driverLastName?.toUpperCase()}{" "}
                    {stream.driverFirstName}
                  </b>
                </Typography>
                <Chip
                  sx={{
                    opacity: 0.8,
                    mt: 1,
                    mx: 0.3,
                    backgroundColor: stream.hex,
                  }}
                  label={stream.constructorName}
                />
                </CardActionArea>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Details;
