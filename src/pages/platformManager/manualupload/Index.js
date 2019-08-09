import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { Table, Card, Button, Modal, message, Divider, Icon, Row, Col, Tooltip, Popconfirm, Form } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import ContentList from './components/ContentList'

const { confirm } = Modal;
@connect(({ loading, hkvideo }) => ({
    ...loading,
    videoListParameters: hkvideo.videoListParameters,
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: null,
        };
    }

    componentDidMount() {
        debugger

    }
    changeDgimn = dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        return (
            <div id="manualupload">
                <PageHeaderWrapper>
                <ContentList PollutantType={upLoadParameters.pollutantTypes}  DGIMN={upLoadParameters.manualUploaddataOne} />
                    {/* <AlarmRecord DGIMN={this.state.dgimn} /> */}
                </PageHeaderWrapper>
                <NavigationTree domId="#manualupload" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value[0].key)
                    }
                }} />
            </div>
        )


    }
}
export default Index;
