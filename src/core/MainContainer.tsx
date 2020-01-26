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
    rocPointList: RocPointList,
    confMatrixObjList: ConfusionMatrixObjectList
    thresholdList: number[],
    selectedChartType: string
}
export type RocPoint = { a: number, b: number }
export type RocPointList = Array<RocPoint>
type RocList = Array<[number, number]>
export type ConfusionMatrix = {
    TP: number
    TN: number
    FP: number
    FN: number
}
export type ConfusionMatrixObjectList = Array<ConfusionMatrix>

type ConfusionMatrixList = Array<[[number, number], [number, number]]>
type RocData = {
    rocList: RocList
    confMatrixList: ConfusionMatrixList,
    thresholdList: number[]
}

const createData = (name: string, value: string) => {
    return {name, value};
};

const transformToRocPointList = (rocList: RocList): RocPointList => {
    console.info("transformToRocPointList");
    let rocPointList: RocPointList = [];
    rocList.forEach(rocPointArray => {
        rocPointList.push({a: rocPointArray[0], b: rocPointArray[1]});
    });
    return rocPointList;
};

const transformToConfusionMatrixObjectList = (confList: ConfusionMatrixList): ConfusionMatrixObjectList => {
    console.info("transformToConfusionMatrixObjectList");
    let confMatrixObjectList: ConfusionMatrixObjectList = [];
    confList.forEach(arr => {
        let tp = arr[0][0];
        let fp = arr[0][1];
        let tn = arr[1][0];
        let fn = arr[1][1];
        let confMatrix: ConfusionMatrix = {TP: tp, FP: fp, TN: tn, FN: fn};
        confMatrixObjectList.push(confMatrix);
    });
    return confMatrixObjectList;
};

export default class MainContainer extends Component<{ classes: any }, MainContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            uploadStatus: false,
            regressionStatus: false,
            fileData: {fileName: "", dataSize: "", inputParamsCount: "", outputParamsCount: ""},
            rocPointList: [],
            confMatrixObjList: [],
            thresholdList: [], 
            selectedChartType: "tree"
        };
        this.getUploadStatus = this.getUploadStatus.bind(this);
        this.displayDataPreviewSection = this.displayDataPreviewSection.bind(this);
        this.displayTrainModelSection = this.displayTrainModelSection.bind(this);
        this.displayCollapsableTree = this.displayCollapsableTree.bind(this);
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


    displayTrainModelSection = (): JSX.Element => {
        return (
            <div>
                <Button variant="contained" color="primary" className={this.props.classes.button}
                        disabled={!this.state.uploadStatus} onClick={this.onStartClick}>Start</Button>
            </div>)
    };

    onStartClick = (): void => {
        console.log("START TRAINING");
        this.queryRocData();
    };

    handleChange = (event:any) => {
        this.setState({selectedChartType:event.target.value});
      };

    displaySelectionBar = (): JSX.Element => {
     return (<SelectionBar currentSelectedChartType={this.state.selectedChartType} 
        handleChange={this.handleChange} classes={this.props.classes} />)
    }

    displaySelection = (chartType: string): JSX.Element => {
        if (chartType === "tree") {
            return (<Grid item xs={12} direction="row">
                        {this.displayCollapsableTree("subTree")}
                    </Grid> )
        } else {
            return (<Grid item xs={12} direction="row">
                         {this.displaySankeyDiagram("sankey")}
                        </Grid>)
        }
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

    async queryRocData() {
        let rocData: RocData = {rocList: [], confMatrixList: [], thresholdList: []};
        let promoise: Promise<AxiosResponse<RocData>> = RestClient.post(`http://localhost:8888${RestClient.ENDPOINT_TRAIN}`, {},
            {headers: {'Content-Type': 'application/json'}, params: {filename: this.state.fileData.fileName}});
        await promoise.then((res: AxiosResponse<RocData>) => {
            console.info("ROC: getting roc points");
            rocData.rocList = res.data.rocList;
            rocData.confMatrixList = res.data.confMatrixList;
            rocData.thresholdList = res.data.thresholdList
        });
        let rocPointList: RocPointList = transformToRocPointList(rocData.rocList);
        let confMatrixObjList: ConfusionMatrixObjectList = transformToConfusionMatrixObjectList(rocData.confMatrixList);
        this.setState({
            regressionStatus: rocData.rocList.length > 0,
            rocPointList: rocPointList,
            confMatrixObjList: confMatrixObjList,
            thresholdList: rocData.thresholdList
        })
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