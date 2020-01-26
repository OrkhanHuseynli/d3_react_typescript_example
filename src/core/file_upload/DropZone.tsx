import React, {Component} from 'react';
import  Dropzone from 'react-dropzone';
import RestClient from "../utils/RestClient";
import {Typography} from '@material-ui/core';

export type FileData = {
    fileName: string
    dataSize: string
    inputParamsCount: string
    outputParamsCount: string
}

type DropZoneState = {
    dropAreaMessage: any
}
export type DropZoneProps = {
    getUploadStatus: (status: boolean,  data: FileData) => void
}

type SuccessFullDropResponse = {
    status: number
    data: FileData
}

export class DropZone extends Component<DropZoneProps, DropZoneState> {

    constructor(props: any) {
        super(props);
        this.getDropAreaMessage = this.getDropAreaMessage.bind(this);
        this.onDropRejected = this.onDropRejected.bind(this);
        this.onDropAccepted = this.onDropAccepted.bind(this);
        this.setState = this.setState.bind(this);
        this.state = {
            dropAreaMessage: ""
        }
    }

    onDrop = <T extends File>(acceptedFiles: T[]): void => {
        if (acceptedFiles.length === 0){
            console.error(`${DropZone.name} : Failed to load file!`);
            return;
        }
        let formData = new FormData();
        let fileName =  acceptedFiles[0].name;
        formData.set('filearg', acceptedFiles[0], fileName);
        let promise = RestClient.sendFormData(`http://localhost:8888${RestClient.ENDPOINT_UPLOAD}`, formData,  new Headers());
        promise.then((res:SuccessFullDropResponse)=>{
            if (res.status !== 200){
                console.error("Upload has failed");
                console.debug(res);
                this.onDropRejected()
            } else {
                console.info(`Successful upload of ${fileName}`);
                this.onDropAccepted(fileName, res.data)
            }
        })
    };

    getDropAreaMessage(){
        return this.state.dropAreaMessage
    }

    onDropAccepted(fileName:string, data: FileData): void{
        this.setState({dropAreaMessage:  <Typography color="primary">The file upload was successful : {fileName}</Typography>});
        this.props.getUploadStatus(true, data);
    };

    onDropRejected(): void{
        this.setState({dropAreaMessage:  <Typography color="error">The file upload was unsuccessful</Typography>});
        this.props.getUploadStatus(false,  {fileName: "", dataSize: "", inputParamsCount: "", outputParamsCount: ""});
    };

    render(){
        return(
            <div>
                <Dropzone accept=".csv" onDrop={this.onDrop} onDropRejected={this.onDropRejected}>
                    {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
                        <section style={{backgroundColor: "#e0e0e0", width: "500px", height: "150px", margin: "0 auto"}}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {!isDragActive &&  <div style={{padding: '50px 0'}}><Typography color="textSecondary"  align={"center"}>Click here or drop a file to upload!</Typography></div>}
                                {isDragActive &&  <div style={{padding: '50px 0'}}><Typography color="textSecondary"  align={"center"}>Drop it like it's hot!</Typography></div>}
                            </div>
                        </section>
                    )}
                </Dropzone>
                <div>
                    {this.getDropAreaMessage()}
                </div>
            </div>
        );
    }
}


