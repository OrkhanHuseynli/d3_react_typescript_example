import React from 'react';
import {Component} from "react";
import {Grid, Typography} from "@material-ui/core";
import { SelectionBar } from './viewhelpers/SelectionBar';
import { ChartViewer } from './viewhelpers/ChartViewer';
import { ChartTypes } from './SharedTypes';


const width = 500, height = 350;

type MainContainerState = {
    selectedChartType: string
}

const chartTypes: ChartTypes= {
    triangle: "triangle",
    collapsibleTree: "collapsibleTree",
    sankey: "sankey"
};

export default class MainContainer extends Component<{ classes: any }, MainContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedChartType: chartTypes.sankey,
        };
    }

    handleChange = (event:any) => {
        this.setState({selectedChartType:event.target.value});
      };

    displaySelectionBar = (): JSX.Element => {
     return (<SelectionBar selectionValues={chartTypes} currentSelectedChartType={this.state.selectedChartType}
        handleChange={this.handleChange} classes={this.props.classes} />)
    }

    render() {
        return (
            <Grid>
                {this.displaySelectionBar()}
               <ChartViewer dimensions={{height: height, width: width}} selectionValues={chartTypes} getCurrentSelectedChartType={()=>{ return this.state.selectedChartType}} classes={this.props.classes} />
            </Grid>
        )
    }
}