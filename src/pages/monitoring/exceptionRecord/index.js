import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tooltip,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, Empty, Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import NavigationTree from '../../../components/NavigationTree'
import RecordEchartTable from '../../../components/recordEchartTable'


// @connect(({ loading, exceptionrecord }) => ({
   
// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /** 初始化加载 */
    componentDidMount() {
     
    }

    componentWillReceiveProps(nextProps) {
        
    }
    render() {
      

        return (
            <div id="record">
                <PageHeaderWrapper>
                    <RecordEchartTable  />
                </PageHeaderWrapper>
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    // if (value.length > 0 && !value[0].IsEnt) {
                    //     this.changeDgimn(value[0].key)
                    // }
                }} />
            </div>
        );
    }
}
export default Index;
