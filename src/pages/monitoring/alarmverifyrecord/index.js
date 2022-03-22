import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
                <BreadcrumbWrapper>
                 <AlarmverifyRecord configId="ExceptionVerify" />
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
