/*
 * @desc: 原始数据包
 * @Author: JianWei
 * @Date: 2019.07.31
 */

import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Tooltip,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  Empty,
  Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SdlTable from '@/components/SdlTable';
import styles from './index.less';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'

@connect(({ loading, originalData }) => ({
  loading: loading.effects['originalData/getOriginalData'],
  tableDatas: originalData.tableDatas,
  total: originalData.total,
  pageIndex: originalData.pageIndex,
  pageSize: originalData.pageSize,
  dgimn: originalData.dgimn,
  dataType: originalData.dataType,
}))

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeDate: [moment().startOf('day'), moment(new Date())],
      format: 'YYYY-MM-DD HH:mm:ss',
      dataType: [],
      disabledFourDataTypes: false,
      disabledOthers: false,
    };
    this.onTableChange = this.onTableChange.bind(this);
  }




  /** 切换时间 */
  _handleDateChange = (date, dateString) => {
    if (date) {
      this.props.dispatch({
        type: 'originalData/updateState',
        payload: {
          beginTime: date[0] ? date[0].format('YYYY-MM-DD HH:mm:ss') : null,
          endTime: date[1] ? date[1].format('YYYY-MM-DD HH:mm:ss') : null,
        },
      });
      this.setState({
        rangeDate: date,
      });
      if (this.props.dgimn || this.props.DGIMN) {
        setTimeout(() => {
          this.reloaddatalist();
        }, 0);
      }
    }
  };

  /** 后台请求数据 */
  reloaddatalist = e => {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'originalData/getOriginalData',
      payload: {
        dgimn: this.props.DGIMN
      },
    });
  }
  // 下拉数据类型事件
  SelectHandleChange = value => {
    const { dispatch } = this.props;
    const { disabledFourDataTypes, disabledOthers } = this.state;
    let disDisabledFourDataTypes = false;
    let disDisabledOthers = false;
    if (value.length !== 0) {
      if (value.indexOf('other') !== -1) {
        disDisabledFourDataTypes = true;
      } else {
        disDisabledOthers = true;
      }
    }
    this.setState({
      dataType: value,
      disabledFourDataTypes: disDisabledFourDataTypes,
      disabledOthers: disDisabledOthers,
    })
    let dataTypeList = '';
    if (value) {
      value.map(item => {
        const code = item;
        if (code) {
          dataTypeList += `${code},`
        }
      })
      dataTypeList = dataTypeList.substr(0, dataTypeList.length - 1);
      dispatch({
        type: 'originalData/updateState',
        payload: {
          dataType: dataTypeList,
        },
      });
    }
    setTimeout(() => {
      this.reloaddatalist();
    }, 0);
  }

  // 分页页数change
  onTableChange(current, pageSize) {
    this.props.dispatch({
      type: 'originalData/updateState',
      payload: {
        pageIndex: current,
        pageSize,
      },
    });
    setTimeout(() => {
      this.reloaddatalist();
    }, 0);
  }
  /** 渲染数据展示 */

  loaddata = () => {
    const { loading, tableDatas, total, pageSize, pageIndex } = this.props;

    const columns = [
      {
        title: '发送时间',
        dataIndex: 'SendTime',
        key: 'SendTime',
        width: 200,
        align: 'center',
      },
      {
        title: '原始数据包值',
        dataIndex: 'OriginalValue',
        key: 'OriginalValue',
        width: 800,
        align: 'left',
      },
    ];

    return (<SdlTable
      rowKey={(record, index) => `complete${index}`}
      dataSource={tableDatas}
      columns={columns}
      loading={loading}
      //    scroll={{ y: 'calc(100vh - 410px)' }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize,
        current: pageIndex,
        onChange: this.onTableChange,
        onShowSizeChange: this.onTableChange,
        pageSizeOptions: ['10', '20', '30', '40'],
        total,
      }}
    />);
  }

  render() {
    console.log('this.props=', this.props)
    const { dataType, disabledFourDataTypes, disabledOthers } = this.state;
    return (
      <Card
        extra={
          <div>
            <Select
              mode="multiple"
              style={{ width: 280 }}
              placeholder="请选择数据类型"
              filterOption
              allowClear
              maxTagCount={2}
              maxTagTextLength={5}
              maxTagPlaceholder="..."
              onChange={this.SelectHandleChange}
              defaultValue={dataType}
            >
              <Option value="2011" disabled={disabledFourDataTypes}>实时数据</Option>
              <Option value="2051" disabled={disabledFourDataTypes}>分钟数据</Option>
              <Option value="2061" disabled={disabledFourDataTypes}>小时数据</Option>
              <Option value="2031" disabled={disabledFourDataTypes}>日数据</Option>
              <Option value="other" disabled={disabledOthers}>其它</Option>
            </Select>

            <RangePicker_ style={{ marginRight: 10, marginLeft: 10 }}
              dateValue={this.state.rangeDate} format={this.state.format}
              callback={this._handleDateChange}
              //    onChange={this._handleDateChange}
              showTime={this.state.format} />
          </div>
        }
        className="contentContainer"
        style={{ width: '100%' }}
      >
        {this.loaddata()}
      </Card>
    );
  }
}
export default Index;
