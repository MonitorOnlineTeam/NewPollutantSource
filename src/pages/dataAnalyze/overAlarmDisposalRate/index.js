import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Form,
  Input,
  Button,
  Icon,
  Card,
  Spin,
  Row,
  Col,
  Table,
  Modal,
  Checkbox,
  TreeSelect,
  message,
  Divider,
  Popconfirm,
  Tooltip,
  Transfer,
  Switch,
  Tag,
  Select,
  Pagination,
  Empty,
} from 'antd';
const { Option } = Select;

import SdlCascader from '../../AutoFormManager/SdlCascader';

@connect(({ overAlarmDisposalRate }) => ({
  //   priseList: defectData.priseList,
  //   exloading: defectData.exloading,
  //   loading: loading.effects[pageUrl.getData],
  //   total: defectData.total,
  //   tableDatas: defectData.tableDatas,
  //   queryPar: defectData.queryPar,
  //   regionList: autoForm.regionList,
  //   attentionList: defectData.attentionList,
  //   atmoStationList: common.atmoStationList,

  queryPar: overAlarmDisposalRate.queryPar,
  attentionList: overAlarmDisposalRate.attentionList,
}))
@Form.create()
export default class OverAlarmDisposalRate extends PureComponent {
  componentDidMount() {
    this.initData();
  }

  initData = () => {
    console.log('initData');
    const { dispatch, location, Atmosphere } = this.props;
    this.updateQueryState({
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere: Atmosphere,
    });
    dispatch({ type: 'autoForm/getRegions', payload: { RegionCode: '', PointMark: '2' } }); //获取行政区列表

    //获取企业列表 or  大气站列表

    Atmosphere
      ? dispatch({ type: 'common/getStationByRegion', payload: { RegionCode: '' } })
      : dispatch({ type: 'overAlarmDisposalRate/getEntByRegion', payload: { RegionCode: '' } });

    dispatch({ type: 'overAlarmDisposalRate/getAttentionDegreeList', payload: { RegionCode: '' } }); //获取关注列表

    setTimeout(() => {
      this.getTableData();
    });
  };

  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    // dispatch({
    //   type: pageUrl.updateState,
    //   payload: { queryPar: { ...queryPar, ...payload } },
    // });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    // dispatch({
    //   type: pageUrl.getData,
    //   payload: { ...queryPar },
    // });
  };

  attentchildren = () => {
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
      attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  render() {
    const {
      queryPar: { beginTime, endTime, EntCode, RegionCode, AttentionCode, dataType, PollutantType },
    } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card bordered={false} style={{ width: '100%' }}>
          <Row>
            <Col span={3}>
              <SdlCascader
                style={{ width: '100%' }}
                changeOnSelect
                placeholder="请选择行政区"
                data={this.props.regionList}
                allowClear
                onChange={val => {
                  console.log('行政区 = ', val);
                }}
              />
            </Col>
            <Form.Item label="关注程度">
              <Select
                placeholder="关注程度"
                onChange={this.changeAttent}
                value={AttentionCode}
                style={{ width: 170 }}
              >
                <Option value="">全部</Option>
                {this.attentchildren()}
              </Select>
            </Form.Item>
          </Row>
          <div>123</div>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
