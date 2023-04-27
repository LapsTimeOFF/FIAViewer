import { Card, Chip, Typography } from "@mui/material";
import { JSONTree } from "react-json-tree";
import React from "react";

const GpBanner = ({ data }: { data: any }) => {
  return (
    <Card sx={{ m: 3, p: 1, borderRadius: 5 }} elevation={5}>
      <Typography variant="h2">
        <b>{data.retrieveItems.resultObj.containers[0].metadata.emfAttributes.Circuit_Location.toUpperCase()}</b>
      </Typography>
      <Typography variant="h6" color={"text.secondary"}>
        {data.retrieveItems.resultObj.containers[0].metadata.emfAttributes.Meeting_Official_Name}
      </Typography>
      <Chip label={data.retrieveItems.resultObj.containers[0].metadata.emfAttributes.Meeting_Display_Date}/>
    </Card>
  );
};

export default GpBanner;
