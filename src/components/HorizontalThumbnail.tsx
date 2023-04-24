import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const HorizontalThumbnail = ({ data, page }: { data: any; page: string }) => {
  // console.log(data.metadata.longDescription, data.metadata.title, data.metadata.emfAttributes?.Meeting_Country_Name)

  return (
    <Grid item>
      <Card sx={{ width: 345, minHeight: 100 }} elevation={1}>
        <CardMedia
          sx={{ height: 140 }}
          image={`https://f1tv.formula1.com/image-resizer/image/${data.metadata.pictureUrl}?w=262&h=147&q=HI&o=L`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <b>
              {(() => {
                switch (true) {
                  case page.endsWith("-season"):
                    return data.metadata.emfAttributes?.Meeting_Country_Name;
                  case page.endsWith("documentaries"):
                  case page.endsWith("shows"):
                    return data.metadata.title;

                  default:
                    return "";
                }
              })()}
            </b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(() => {
              switch (true) {
                case page.endsWith("-season"):
                  return data.metadata.emfAttributes?.Meeting_Official_Name;
                case page.endsWith("documentaries"):
                case page.endsWith("archive"):
                case page.endsWith("shows"):
                  return data.metadata.shortDescription;

                default:
                  return "";
              }
            })()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default HorizontalThumbnail;
