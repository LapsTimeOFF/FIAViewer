import { Grid, Typography, styled } from "@mui/material";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import HorizontalThumbnail from "@/components/HorizontalThumbnail";
import GpBanner from "@/components/GpBanner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatString(input: string) {
  const words = input.split(" ");
  const formattedWords = words.map((word) => {
    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
  });
  return formattedWords.join(" ");
}

const Page = () => {
  const { id, pagename } = useParams();
  console.log(id, pagename);

  const { data, error, isLoading } = useSWR(
    `https://f1tv.formula1.com/2.0/R/ENG/WEB_DASH/ALL/PAGE/${id}/F1_TV_Pro_Annual/1`,
    fetcher
  );

  console.log(data, error, isLoading);

  return (
    <Layout>
      <>
        {data &&
          data.resultObj.containers.map((container: any) => {
            console.log(container.layout);
            switch (container.layout) {
            case "hero":
            case "title":
              return (
                <Typography variant="h2">
                  {formatString(container.title ?? '')}
                </Typography>
              );

            case "subtitle":
              return (
                <Typography variant="h6" color={"text.secondary"}>
                  {formatString(container.title ?? '')}
                </Typography>
              );

            case "gp_banner":
              return (
                <GpBanner data={container} />
              );

              // default:
              //   return container.layout;
            }
          })}
          
        <Grid container spacing={2}>
          {data &&
            data.resultObj.containers
              .filter(
                (container: any) => container.layout === "horizontal_thumbnail"
              )
              .map((container: any) => {
                return container.retrieveItems.resultObj.containers.map((container: any) => {
                  return <HorizontalThumbnail data={container} page={pagename ?? ""} />;
                });
              })}
        </Grid>
      </>
    </Layout>
  );
};

export default Page;
