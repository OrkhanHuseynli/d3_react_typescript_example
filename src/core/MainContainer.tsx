import React from 'react';
import {Component} from "react";
import {Button, Grid, Typography, Select} from "@material-ui/core";
import {DropZone, FileData} from "./file_upload/DropZone";
import DataTable from "./table/DataTable";
import {CollapsibleTree} from "./d3charts/CollapsibleTree";
import RestClient from "./utils/RestClient";
import {AxiosResponse} from 'axios';
import {SankeyDiagram} from "./d3charts/SankeyDiagram";
import { SelectionBar } from './viewhelpers/SelectionBar';


const width = 500, height = 350;

type MainContainerState = {
    uploadStatus: boolean
    fileData: FileData
    regressionStatus: boolean
    selectedChartType: string
}
type ValueType = string
type ExpectedData = {
    valueType: ValueType
    values: number[]
}

const createData = (name: string, value: string) => {
    return {name, value};
};

export default class MainContainer extends Component<{ classes: any }, MainContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            uploadStatus: false,
            regressionStatus: false,
            fileData: {fileName: "", dataSize: "", inputParamsCount: "", outputParamsCount: ""},
            selectedChartType: "tree"
        };
        this.getUploadStatus = this.getUploadStatus.bind(this);
        this.displayDataPreviewSection = this.displayDataPreviewSection.bind(this);
        this.onStartClick = this.onStartClick.bind(this);
    }

    getUploadStatus = (status: boolean, data: FileData): void => {
        console.debug("Upload status: " + this.state.uploadStatus)
        this.setState({uploadStatus: status, fileData: {...data}})
        if (!status) {
            this.setState({regressionStatus: status});
        }
    };

    displayDataPreviewSection = (): JSX.Element => {
        if (this.state.uploadStatus) {
            let tableRows = [
                createData('File name', this.state.fileData.fileName),
                createData('Data size', this.state.fileData.dataSize),
            ];

            return <DataTable dataRows={tableRows}/>
        }
        return <div className={this.props.classes.dataPreview}><Typography color={"textSecondary"}>No data
            provided</Typography></div>
    };

    onStartClick = (): void => {
        console.log("Getting the chart data");
        this.queryData();
    };

    handleChange = (event:any) => {
        this.setState({selectedChartType:event.target.value});
      };

    displaySelectionBar = (): JSX.Element => {
     return (<SelectionBar currentSelectedChartType={this.state.selectedChartType}
        handleChange={this.handleChange} classes={this.props.classes} />)
    }

    displaySelection = (chartType: string): JSX.Element => {
        let chart: JSX.Element;
        if (chartType === "tree") {
            chart =  this.displayCollapsableTree("subTree");
        } else {
            chart = this.displaySankeyDiagram("sankey");
        }
        return (<Grid item xs={12} direction="row">{chart}</Grid>)
    }
    displayCollapsableTree = (idName: string): JSX.Element => {
        return (<div className={this.props.classes.paper}>
            <CollapsibleTree idName={idName} width={width} height={height}/>
        </div>);
    };

    displaySankeyDiagram = (idName: string): JSX.Element => {
        return (<div className={this.props.classes.paper}>
            <SankeyDiagram idName={idName} width={width} height={height}/>
        </div>);
    };

    async queryData() {
        let expectedData: ExpectedData = {valueType: "", values: []};
        let promise: Promise<AxiosResponse<ExpectedData>> = RestClient.post(`http://localhost:8888${RestClient.QUERY_ENDPOINT}`, {},
            {headers: {'Content-Type': 'application/json'}, params: {filename: this.state.fileData.fileName}});
        await promise.then((res: AxiosResponse<ExpectedData>) => {
            console.info("Receiving data");
            expectedData.valueType = res.data.valueType;
            expectedData.values = res.data.values
        });

        this.setState({
            regressionStatus: expectedData.valueType.length > 0,
        });
    };

    render() {
        return (
            <Grid>
                {this.displaySelectionBar()}
                {this.displaySelection(this.state.selectedChartType)}
            </Grid>
        )
    }
}