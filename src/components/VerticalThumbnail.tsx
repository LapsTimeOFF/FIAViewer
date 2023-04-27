import {
  Card,
  CardActionArea,
  CardMedia,
  Grid,
} from "@mui/material";

const VerticalThumbnail = ({ data, page }: { data: any; page: string }) => {
  // console.log(data.metadata.longDescription, data.metadata.title, data.metadata.emfAttributes?.Meeting_Country_Name)

  return (
    <Grid item>
      <Card sx={{ minWidth: 256, minHeight: 100 }} elevation={1}>
        <CardActionArea onClick={() => {
            location.hash = data.actions[0].href
        }}>
          <CardMedia
            sx={{ height: "539px", width: "384px" }}
            image={`https://f1tv.formula1.com/image-resizer/image/${data.metadata.pictureUrl}?w=384&h=539&q=HI&o=L`}
          />
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default VerticalThumbnail;
