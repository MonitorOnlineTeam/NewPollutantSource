import React, { Component } from 'react';
import {
    Table,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import OperationRecord from '@/components/OperationRecord'


@connect()

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: "",
            type: ""
        };
    }
    render() {
        console.log('type=', this.state.type)
        return (
            <div id="record">
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn: value[0].key,
                            type: value[0].Type
                        })
                    }
                }} />
                <PageHeaderWrapper>
                    {this.state.dgimn && <OperationRecord DGIMN={this.state.dgimn} PollutantType={this.state.type} />}
                </PageHeaderWrapper>

            </div>
        );
    }
}
export default Index;
