import React from "react";
import { Select, MenuItem, Typography, Grid } from "@material-ui/core";
import { ChartTypes } from "../SharedTypes";

type SelectionBarProps = {
    selectionValues: ChartTypes
    currentSelectedChartType: string
    handleChange: (event: any)=>void
    classes: {paper:any}
}

export const SelectionBar: React.FC<SelectionBarProps> = (props: SelectionBarProps) => {
    let buildMenyItemsBasedOnSelectionValues = (selectionValues: ChartTypes) => {
      var menuItems = [];
      for (const key in selectionValues) {
        menuItems.push(<MenuItem value={key}>{key}</MenuItem>);
      } 
      return menuItems;
    };
    let sel = (<Select
      value={props.currentSelectedChartType}
     labelId="demo-simple-select-filled-label"
     id="demo-simple-select-filled"
     onChange={props.handleChange} >
     {buildMenyItemsBasedOnSelectionValues(props.selectionValues)}
   </Select>);

  return (<Grid item xs={12}>
             <div className={props.classes.paper}>
             <Typography variant="h5"> Select chart type </Typography>
             {sel}
             </div>
         </Grid>)
 }