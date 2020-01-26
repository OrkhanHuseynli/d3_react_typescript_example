import * as React from "react";
import * as d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import {Component} from "react";
import './CollapsibleTree.css';
import {ConfusionMatrix} from "../MainContainer";
import {SankeyGraph} from "d3-sankey";
import { sankeyData } from "./sankeyData";

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
    threshold: number
    confusionMatrix: ConfusionMatrix
}


// const edgeColor: any = Object.assign(`<select>
//   <option value=input>Color by input
//   <option value=output>Color by output
//   <option value=path selected>Color by input-output
//   <option value=none>No color
// </select>`, {
//     value: new URLSearchParams(`<a href>` + `.search`).get("color") || "path"
// });

const edgeColor: any = "output";

// const align = Object.assign(`<select>
//   <option value=left>Left-aligned
//   <option value=right>Right-aligned
//   <option value=center>Centered
//   <option value=justify selected>Justified
// </select>`, {
//     value: new URLSearchParams(`<a href>` +`.search`).get("align") || "justify"
// });
const align = d3sankey.sankeyLeft;

export class SankeyDiagram extends Component<CurveProps, CurveState> {

    constructor(props: CurveProps) {
        super(props);
        this.state = {
            tooltip: {
                x: 0,
                y: 0,
                display: "none",
                width: 35,
                threshold: 0,
                confusionMatrix: {TP: 0, TN: 0, FP: 0, FN: 0}
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


const scaleColor = d3.scaleOrdinal(d3.schemeCategory10);

const color = (name: string) => {
    let str = name.substring(0,name.indexOf(" "));
    return scaleColor(str);
};

const format = () => {
    const f = d3.format(",.0f");
    return (d: any) => `${f(d)} TWh`;
};

const sankeyAnom = (obj: SankeyGraph<any, any>, width:number, height:number): SankeyGraph<{}, {}> => {
    console.info("sankeyAnom called");
    // @ts-ignore
    const sankey = d3sankey.sankey()
        .nodeId((d: any) => {
            return d.index
        })
        // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
        // @ts-ignore
        // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
        .nodeAlign(align)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

    console.info(sankey);

    return sankey({
        nodes: obj.nodes.map((d: any) => Object.assign({}, d)),
        links: obj.links.map((d: any) => Object.assign({}, d))
    });
};

const buildSvg = (targetId: string) => {
    const margin = ({top: 10, right: 120, bottom: 10, left: 40});
    const {width, height} = {width: 954, height: 600};

    let data = sankeyData;


    let chart = () => {
        let svg = d3.select(targetId)
        // @ts-ignore
            .attr("viewBox", [0, 0, width, height]);

        const {nodes, links} = sankeyAnom(data, width, height);

        svg.append("g")
            .attr("stroke", "#000")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
            .attr("x", (d: any) => d.x0)
            .attr("y", (d: any) => d.y0)
            .attr("height", (d: any) => d.y1 - d.y0)
            .attr("width", (d: any) => d.x1 - d.x0)
            .attr("fill", (d: any) => {
                // console.log(d);
                // console.log(color()(d.name));
                return color(d.name);
            })
            .append("title")
            .text((d: any) => `${d.name}\n${format()(d.value)}`);

        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
            .selectAll("g")
            .data(links)
            .join("g")
            .style("mix-blend-mode", "multiply");

        if (edgeColor === "path") {
            const gradient = link.append("linearGradient")
            // .attr("id", (d: any) => (d.uid = DOM.uid("link")).id)
                .attr("id", (d: any) => (d.uid = document.getElementsByTagName("link")[0].id))
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", (d: any) => d.source.x1)
                .attr("x2", (d: any) => d.target.x0);

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", (d: any) => {
                    // console.log(color()(d.source.name));
                    return color(d.source.name);
                });

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", (d: any) => color(d.target.name));
        }

        link.append("path")
            .attr("d", d3sankey.sankeyLinkHorizontal())
            .attr("stroke", (d: any) => edgeColor === "none" ? "#aaa"
                : edgeColor === "path" ? d.uid
                    : edgeColor === "input" ? color(d.source.name)
                        : color(d.target.name))
            .attr("stroke-width", (d: any) => Math.max(1, d.width));

        link.append("title")
            .text((d: any) => `${d.source.name} → ${d.target.name}\n${format()(d.value)}`);

        svg.append("g")
            .style("font", "10px sans-serif")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", (d: any) => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", (d: any) => d.x0 < width / 2 ? "start" : "end")
            .text((d: any) => d.name);

        return svg.node();
    }
    return chart();

};