import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AlarmverifyRecord from './components/AlarmverifyRecord'

/**
 * 核查记录
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="dataquery">
                <PageHeaderWrapper>
                 <AlarmverifyRecord configId="ExceptionVerify" />
                </PageHeaderWrapper>
            </div>
        );
    }
}
export default Index;
