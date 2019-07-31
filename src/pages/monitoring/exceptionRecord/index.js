import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Table,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import NavigationTree from '../../../components/NavigationTree'
import RecordEchartTable from '../../../components/recordEchartTable'

const data = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];
// @connect(({ loading, exceptionrecord }) => ({
   
// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn:""
        };
    }
    render() {
        return (
            <div id="record">
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn:value[0].key
                        })
                    }
                }} />
                <PageHeaderWrapper>
                    <RecordEchartTable  DGIMN={this.state.dgimn}  />
                </PageHeaderWrapper>
                
            </div>
            // <Table
            // columns={columns}
            // dataSource={data}
            // />
        );
    }
}
export default Index;
