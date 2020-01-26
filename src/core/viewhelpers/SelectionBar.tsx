import React from "react";
import { Select, MenuItem, Typography, Grid } from "@material-ui/core";

type SelectionBarProps = {
    currentSelectedChartType: string
    handleChange: (event: any)=>void
    classes: {paper:any}
}

export const SelectionBar: React.FC<SelectionBarProps> = (props: SelectionBarProps) => {
    let sel = (<Select
      value={props.currentSelectedChartType}
     labelId="demo-simple-select-filled-label"
     id="demo-simple-select-filled"
     onChange={props.handleChange} >
     <MenuItem value={"tree"}>tree</MenuItem>
     <MenuItem value={"sunkey"}>sunkey</MenuItem>
   </Select>);

  return (<Grid item xs={12}>
             <div className={props.classes.paper}>
             <Typography variant="h5"> Select chart type </Typography>
             {sel}
             </div>
         </Grid>)
 }