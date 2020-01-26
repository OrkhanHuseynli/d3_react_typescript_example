import {configure, shallow, ShallowWrapper} from "enzyme";
import { create, ReactTestRenderer } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16'

import * as React from "react";
import {CurveProps, CollapsibleTree} from "./CollapsibleTree";

let wrapper: ShallowWrapper<CurveProps>;
let snapshot: ReactTestRenderer;

beforeEach(() => {
    const width = 30, height = 30;
    const mockLineChart = <CollapsibleTree idName={"sample"} width={width} height={height}/>;

    wrapper = shallow(mockLineChart);
    snapshot = create(mockLineChart);
});

configure({adapter: new Adapter()});

describe('CollapsibleTree', () => {
    test('it matches the snapshot', () => {
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});