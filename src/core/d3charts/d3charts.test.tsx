import {configure, shallow, ShallowWrapper} from "enzyme";
import { create, ReactTestRenderer } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16'

import * as React from "react";
import {CurveProps, CollapsibleTree} from "./CollapsibleTree";
import {ConfusionMatrix, RocPointList} from "../MainContainer";

let wrapper: ShallowWrapper<CurveProps>;
let snapshot: ReactTestRenderer;

beforeEach(() => {
    const mockRocPointList: RocPointList = [{a: 0.3, b:0.5}];
    const mockConfMatrixObjList: Array<ConfusionMatrix> = [{FN: 2, FP:3, TN:0, TP:8}];
    const mockThresholdList = [0.2];
    const width = 30, height = 30;
    const mockLineChart = <CollapsibleTree rocPointList={mockRocPointList} confMatrixObjList={mockConfMatrixObjList} thresholdList={mockThresholdList} width={width} height={height}/>;

    wrapper = shallow(mockLineChart);
    snapshot = create(mockLineChart);
});

configure({adapter: new Adapter()});

describe('d3charts', () => {
    test('it matches the snapshot', () => {
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});