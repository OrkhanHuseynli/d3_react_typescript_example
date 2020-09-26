import * as React from "react";
import * as d3 from 'd3'
import { Component } from "react";
import './Triangle.css';

export type CurveProps = {
    idName: string
    width: any
    height: any
}
type CurveState = {
    tooltip: Tooltip
}

type Tooltip = {
    x: number
    y: number
    display: string
    width: number
    value: string
}

export class Triangle extends Component<CurveProps, CurveState> {

    constructor(props: CurveProps) {
        super(props);
        this.state = {
            tooltip: {
                x: 0,
                y: 0,
                display: "none",
                width: 35,
                value: ""
            }
        }
    }


    componentDidMount() {
        buildSvg("#" + this.props.idName);
        //Do svg stuff
    }

    render() {
        return (
            <div>
                <svg id={this.props.idName}></svg>
            </div>
        )
    }
}

let buildSvg = (targetId: string) => {
    // const d3 = require("d3@5"
    const margin = ({ top: 10, right: 120, bottom: 10, left: 40 });
    const { width, height } = { width: 1000, height: 1000 };
    let dy = width / 6;
    let dx = 10;
    let svg = d3.select(targetId)
        // @ts-ignore
        .attr("viewBox", [-margin.left, -margin.top, width, height])
       .style("font", "10px sans-serif")
        .style("user-select", "none");

    let xScale = d3.scaleLinear().domain([0, 100]).range([0, 800]);
    let yScale = d3.scaleLinear().domain([0, 100]).range([800, 0]);
    let data = [[0, 50], [100, 80], [200, 40], [300, 60], [400, 30]];
    let lineGenerator = d3.line()
                        .x((data)=> {return xScale(data[0]);})
                        .y((data) => {return yScale(data[1]);});
    //@ts-ignore
    svg.append('path').attr('d', lineGenerator(data));
    return svg.node();
};