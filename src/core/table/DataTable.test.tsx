import {configure, shallow, ShallowWrapper} from "enzyme";
import { create, ReactTestRenderer } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16'

import * as React from "react";
import DataTable, {DataTableProps} from "./DataTable";

let wrapper: ShallowWrapper<DataTableProps>;
let snapshot: ReactTestRenderer;

beforeEach(() => {
    const mockDataTableRows = [{name: "data", value: "value"}];
    const mockElement =<DataTable dataRows={mockDataTableRows}/>;
    wrapper = shallow(mockElement);
    snapshot = create(mockElement);
});

configure({adapter: new Adapter()});

describe('DataTable', () => {
    test('it matches the snapshot', () => {
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});