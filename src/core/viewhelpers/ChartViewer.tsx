import React from "react";
import { Select, MenuItem, Typography, Grid } from "@material-ui/core";
import { CollapsibleTree } from "../d3charts/CollapsibleTree";
import { Triangle } from "../d3charts/Triangle";
import { SankeyDiagram } from "../d3charts/SankeyDiagram";
import { ChartTypes } from "../SharedTypes";

type Dimensions = {
    height: number
    width: number
}

type CharViewerProps = {
    selectionValues: ChartTypes
    getCurrentSelectedChartType: ()=> string
    classes: {paper:any}
    dimensions: Dimensions
}

export const ChartViewer: React.FC<CharViewerProps> = (props: CharViewerProps) => {
    let {height, width} = props.dimensions;
    let chartTypes = props.selectionValues;
    let displaySelection = (chartType: string): JSX.Element => {
        let chart: JSX.Element;
        switch(chartType) {
            case chartTypes.collapsibleTree : 
                chart = displayD3Object(<CollapsibleTree idName={chartTypes.collapsibleTree} width={width} height={height}/>);
                break;
            case chartTypes.triangle:
                chart =  displayD3Object(<Triangle idName={chartTypes.triangle} width={width} height={height}/>);
                break;
            case chartTypes.sankey:
                chart =  displayD3Object(<SankeyDiagram idName={chartTypes.sankey} width={width} height={height}/>);
                break;
            default:
                chart = displayD3Object(<SankeyDiagram idName={chartTypes.sankey} width={width} height={height}/>);
        }
        return (<Grid item xs={12} direction="row">{chart}</Grid>);
    };

    let displayD3Object = (d3ReactEncapsulation: JSX.Element): JSX.Element => {
        return (<div className={props.classes.paper}>
               {d3ReactEncapsulation}
        </div>);
    };

  return (<div>{displaySelection(props.getCurrentSelectedChartType())}</div>)
 }