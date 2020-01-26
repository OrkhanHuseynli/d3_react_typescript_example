import * as React from "react";
import * as d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import {Component} from "react";
import './CollapsibleTree.css';
import {ConfusionMatrix} from "../MainContainer";
import {SankeyGraph} from "d3-sankey";
import {SankeyLayout} from "d3-sankey";

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

let buildSvg = (targetId: string) => {
    // const d3 = require("d3@5"
    const margin = ({top: 10, right: 120, bottom: 10, left: 40});
    const {width, height} = {width: 954, height: 600};

    let format = () => {
        const f = d3.format(",.0f");
        return (d: any) => `${f(d)} TWh`;
    };


    let sankeyAnom = (obj: SankeyGraph<any, any>): SankeyGraph<{}, {}> => {
        console.info("sankeyAnom called");
        // @ts-ignore
        const sankey = d3sankey.sankey()
            .nodeId((d: any) => {
                return d.index
            })
            // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
            // @ts-ignore
            // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
            .nodeAlign(d3sankey.sankeyLeft)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        console.info(sankey);

        return sankey({
            nodes: obj.nodes.map((d: any) => Object.assign({}, d)),
            links: obj.links.map((d: any) => Object.assign({}, d))
        });
    };

    let data = {
        "nodes": [{"name": "Agricultural 'waste'"}, {"name": "Bio-conversion"}, {"name": "Liquid"}, {"name": "Losses"}, {"name": "Solid"}, {"name": "Gas"}, {"name": "Biofuel imports"}, {"name": "Biomass imports"}, {"name": "Coal imports"}, {"name": "Coal"}, {"name": "Coal reserves"}, {"name": "District heating"}, {"name": "Industry"}, {"name": "Heating and cooling - commercial"}, {"name": "Heating and cooling - homes"}, {"name": "Electricity grid"}, {"name": "Over generation / exports"}, {"name": "H2 conversion"}, {"name": "Road transport"}, {"name": "Agriculture"}, {"name": "Rail transport"}, {"name": "Lighting & appliances - commercial"}, {"name": "Lighting & appliances - homes"}, {"name": "Gas imports"}, {"name": "Ngas"}, {"name": "Gas reserves"}, {"name": "Thermal generation"}, {"name": "Geothermal"}, {"name": "H2"}, {"name": "Hydro"}, {"name": "International shipping"}, {"name": "Domestic aviation"}, {"name": "International aviation"}, {"name": "National navigation"}, {"name": "Marine algae"}, {"name": "Nuclear"}, {"name": "Oil imports"}, {"name": "Oil"}, {"name": "Oil reserves"}, {"name": "Other waste"}, {"name": "Pumped heat"}, {"name": "Solar PV"}, {"name": "Solar Thermal"}, {"name": "Solar"}, {"name": "Tidal"}, {"name": "UK land based bioenergy"}, {"name": "Wave"}, {"name": "Wind"}],
        "links": [{"source": 0, "target": 1, "value": 124.729}, {
            "source": 1,
            "target": 2,
            "value": 0.597
        }, {"source": 1, "target": 3, "value": 26.862}, {"source": 1, "target": 4, "value": 280.322}, {
            "source": 1,
            "target": 5,
            "value": 81.144
        }, {"source": 6, "target": 2, "value": 35}, {"source": 7, "target": 4, "value": 35}, {
            "source": 8,
            "target": 9,
            "value": 11.606
        }, {"source": 10, "target": 9, "value": 63.965}, {"source": 9, "target": 4, "value": 75.571}, {
            "source": 11,
            "target": 12,
            "value": 10.639
        }, {"source": 11, "target": 13, "value": 22.505}, {"source": 11, "target": 14, "value": 46.184}, {
            "source": 15,
            "target": 16,
            "value": 104.453
        }, {"source": 15, "target": 14, "value": 113.726}, {"source": 15, "target": 17, "value": 27.14}, {
            "source": 15,
            "target": 12,
            "value": 342.165
        }, {"source": 15, "target": 18, "value": 37.797}, {"source": 15, "target": 19, "value": 4.412}, {
            "source": 15,
            "target": 13,
            "value": 40.858
        }, {"source": 15, "target": 3, "value": 56.691}, {"source": 15, "target": 20, "value": 7.863}, {
            "source": 15,
            "target": 21,
            "value": 90.008
        }, {"source": 15, "target": 22, "value": 93.494}, {"source": 23, "target": 24, "value": 40.719}, {
            "source": 25,
            "target": 24,
            "value": 82.233
        }, {"source": 5, "target": 13, "value": 0.129}, {"source": 5, "target": 3, "value": 1.401}, {
            "source": 5,
            "target": 26,
            "value": 151.891
        }, {"source": 5, "target": 19, "value": 2.096}, {"source": 5, "target": 12, "value": 48.58}, {
            "source": 27,
            "target": 15,
            "value": 7.013
        }, {"source": 17, "target": 28, "value": 20.897}, {"source": 17, "target": 3, "value": 6.242}, {
            "source": 28,
            "target": 18,
            "value": 20.897
        }, {"source": 29, "target": 15, "value": 6.995}, {"source": 2, "target": 12, "value": 121.066}, {
            "source": 2,
            "target": 30,
            "value": 128.69
        }, {"source": 2, "target": 18, "value": 135.835}, {"source": 2, "target": 31, "value": 14.458}, {
            "source": 2,
            "target": 32,
            "value": 206.267
        }, {"source": 2, "target": 19, "value": 3.64}, {"source": 2, "target": 33, "value": 33.218}, {
            "source": 2,
            "target": 20,
            "value": 4.413
        }, {"source": 34, "target": 1, "value": 4.375}, {"source": 24, "target": 5, "value": 122.952}, {
            "source": 35,
            "target": 26,
            "value": 839.978
        }, {"source": 36, "target": 37, "value": 504.287}, {
            "source": 38,
            "target": 37,
            "value": 107.703
        }, {"source": 37, "target": 2, "value": 611.99}, {"source": 39, "target": 4, "value": 56.587}, {
            "source": 39,
            "target": 1,
            "value": 77.81
        }, {"source": 40, "target": 14, "value": 193.026}, {"source": 40, "target": 13, "value": 70.672}, {
            "source": 41,
            "target": 15,
            "value": 59.901
        }, {"source": 42, "target": 14, "value": 19.263}, {"source": 43, "target": 42, "value": 19.263}, {
            "source": 43,
            "target": 41,
            "value": 59.901
        }, {"source": 4, "target": 19, "value": 0.882}, {"source": 4, "target": 26, "value": 400.12}, {
            "source": 4,
            "target": 12,
            "value": 46.477
        }, {"source": 26, "target": 15, "value": 525.531}, {"source": 26, "target": 3, "value": 787.129}, {
            "source": 26,
            "target": 11,
            "value": 79.329
        }, {"source": 44, "target": 15, "value": 9.452}, {"source": 45, "target": 1, "value": 182.01}, {
            "source": 46,
            "target": 15,
            "value": 19.013
        }, {"source": 47, "target": 15, "value": 289.366}]
    };


    let chart = () => {
        console.info("chart called");
        let svg = d3.select(targetId)
        // @ts-ignore
            .attr("viewBox", [0, 0, width, height]);

        const {nodes, links} = sankeyAnom(data);

        let color = (name: string) => {
            let scaleColor = d3.scaleOrdinal(d3.schemeCategory10);
            console.log(name);
            let str = name.substring(0,name.indexOf(" "));
            // let str = name.replace(/ .*/, "");
            console.log(str);
            console.log(scaleColor(str));
            return scaleColor(str);
        };

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