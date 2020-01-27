import * as React from "react";
import * as d3 from 'd3'
import {Component} from "react";
import './CollapsibleTree.css';

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

export class CollapsibleTree extends Component<CurveProps, CurveState> {

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

    onMouseOverEv = (e: any, x: number, y: number, threshold: number) => {
        let tooltip: Tooltip = {
            x: x,
            y: y,
            display: "true",
            width: 35,
            value: ""
        };
        this.setState({tooltip: {...tooltip}})
    };

    onMouseOutEv = (e: any) => {
        let tooltip: Tooltip = {
            x: 0,
            y: 0,
            display: "none",
            width: 35,
            value: ""
        };
        this.setState({tooltip: {...tooltip}})
    };

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
    const {width, height} = {width: 1000, height: 500};
    let dy = width / 6;
    let dx = 10;
    let data = {
        name: "flare",
        children: [
            {
                name: "analytics",
                children: [
                    {
                        name: "cluster",
                        children: [
                            {name: "AgglomerativeCluster", value: 3938},
                            {name: "CommunityStructure", value: 3812},
                            {name: "HierarchicalCluster", value: 6714},
                            {name: "MergeEdge", value: 743}
                        ]
                    },
                    {
                        name: "optimization",
                        children: [
                            {name: "AspectRatioBanker", value: 7074}
                        ]
                    }
                ]
            },
        ]
    };

    // @ts-ignore
    let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
    let tree = d3.tree().nodeSize([dx, dy])
    let root: any = d3.hierarchy(data);
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d:any, i:any) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
    });



    let svg = d3.select(targetId)
    // @ts-ignore
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "10px sans-serif")
        .style("user-select", "none");

    let gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    let gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    const  updateSvg = (source: any) => {
        let duration = d3.event && d3.event.altKey ? 2500 : 250;
        let nodes = root.descendants().reverse();
        let links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node:any) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        let height = right.x - left.x + margin.top + margin.bottom;

        let transition = svg.transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            // @ts-ignore
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        let node = gNode.selectAll("g")
            .data(nodes, (d: any) => d.id);

        // Enter any new nodes at the parent's previous position.
        let nodeEnter = node.enter().append("g")
            .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (d: any) => {
                d.children = d.children ? null : d._children;
                updateSvg(d);
            });

        nodeEnter.append("circle")
            .attr("r", 2.5)
            .attr("fill", (d: any) => d._children ? "#555" : "#999")
            .attr("stroke-width", 10);

        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", (d: any) => d._children ? -6 : 6)
            .attr("text-anchor", (d: any) => d._children ? "end" : "start")
            .text((d: any) => d.data.name)
            .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

        // Transition nodes to their new position.
        let nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        let nodeExit = node.exit().transition(transition).remove()
            .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        let link = gLink.selectAll("path")
            .data(links, (d: any) => d.target.id);

        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().append("path")
            .attr("d", (d: any) => {
                let o = {x: source.x0, y: source.y0};
                // @ts-ignore
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", (d: any) => {
                let o = {x: source.x, y: source.y};
                // @ts-ignore
                return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };

    updateSvg(root);
    return svg.node()
};