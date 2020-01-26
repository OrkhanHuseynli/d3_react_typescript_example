import {configure, shallow, ShallowWrapper} from "enzyme";
import { create, ReactTestRenderer } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16'

import * as React from "react";
import {DropZone, DropZoneProps, FileData} from "./DropZone";

let wrapper: ShallowWrapper<DropZoneProps>;
let snapshot: ReactTestRenderer ;

beforeEach(() => {
    const mockGetUploadStatus = (status: boolean, data: FileData): void => {console.info("DropZone Test");}
    const mockElement = <DropZone getUploadStatus={mockGetUploadStatus}/>
    wrapper = shallow(mockElement);
    snapshot = create(mockElement);
});

configure({adapter: new Adapter()});

describe('DropZone', () => {
    test('it matches the snapshot', () => {
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});