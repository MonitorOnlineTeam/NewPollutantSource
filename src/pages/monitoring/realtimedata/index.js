import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import DataQuery from '../dataquery/components/DataQuery'

/**
 * 数据查询页面
 * xpy 2019.07.26
 */

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    changeDgimn=dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        return (
            <div id="dataquery">
                <PageHeaderWrapper>
            fdsfsdfsdf
                </PageHeaderWrapper>
                <NavigationTree domId="#dataquery" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default index;
