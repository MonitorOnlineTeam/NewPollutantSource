


import React from 'react';

import { Card, Table, Empty, Form, Row, Col, Button, Spin } from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import PollutantDownSelect from '@/components/PollutantDownSelect'
import DropDownSelect from '@/components/DropDownSelect'


/**
 * 质控核查设置   查询条件组件
 * jab 2020.08.18
 */

@connect(({ loading, qualitySet, qcaCheck }) => ({
  dgimn: qualitySet.dgimn,
  polltype: qualitySet.pollType,
  cycleListParams: qualitySet.cycleListParams,
  pollutantlist: qcaCheck.pollutantList,
  pollutantCode: qcaCheck.pollutantCode,
  pollLoading: loading.effects['qcaCheck/getPollutantListByDgimn'],
}))

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cycleOptions: [{ value: 1, name: "每天" }, { value: 7, name: "周" }, { value: 30, name: "月" }, { value: 90, name: "季" }],
      dgimn: "",
      defaultValue: '',
      defaulltVaule: "",
      pollutantCode: ''
    };
  }
  componentDidMount() {
    const { cycleListParams: { QCAType } } = this.props;
    // this.getTableData(this.props.dgimn)
    if (QCAType == 1026) {
      this.getTableData(this.props.dgimn);
    }
  }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {


    const { cycleListParams: { QCAType } } = this.props;

    if (QCAType == 1026) {  //零点核查
      if (prevProps.dgimn !== this.props.dgimn) {
        this.getTableData(this.props.dgimn);
      }
    } else {
      if (prevProps.pollLoading !== this.props.pollLoading && !this.props.pollLoading) { //先获取污染物列表 获取到污染物 再更新表格数据
        this.getTableData(this.props.dgimn);
      }
    }
  }


  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
    const { cycleListParams: { QCAType } } = this.props;
    let { dispatch, cycleListParams, pollutantlist, polltype } = this.props;

    // setTimeout(()=>{
    const { pollutantCode } = this.props;
    cycleListParams = {
      ...cycleListParams,
      DGIMN: dgimn,
      // PollutantCodeList:polltype == 1 ? QCAType==1026? [] : this.child.state.waterDefault : QCAType==1026? []: polltype == 2 ? this.child.state.gasDefault : []
      PollutantCodeList: QCAType == 1026 ? [] : pollutantCode

    }
    dispatch({
      type: 'qualitySet/updateState',
      payload: { cycleListParams },
    });
    setTimeout(() => { this.queryClick() })
    // },1000)




  }

  childSelect = (ref) => {
    this.child = ref
  }

  pollChange = (data) => {
    let { dispatch, cycleListParams } = this.props;
    cycleListParams = {
      ...cycleListParams,
      PollutantCodeList: data
    }
    dispatch({
      type: 'qualitySet/updateState',
      payload: { cycleListParams },
    });
  }
  queryClick = () => { //查询

    let { dispatch, cycleListParams } = this.props;
    cycleListParams = {
      ...cycleListParams,
    }
    dispatch({
      type: 'qualitySet/getCycleQualityControlList',
      payload: { ...cycleListParams },
    });
  }
  cycleSelect = (value) => {
    let { dispatch, cycleListParams } = this.props;
    cycleListParams = {
      ...cycleListParams,
      Cycle: value
    }
    dispatch({
      type: 'qualitySet/updateState',
      payload: { cycleListParams },
    });
  }
  /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
  getpollutantSelect = () => {
    const { dgimn, polltype, defaulltVal, cycleListParams: { QCAType } } = this.props;
    return dgimn ? <PollutantDownSelect isdefaulltall isqca onRef={this.childSelect} onChange={this.pollChange} dgimn={dgimn} /> : null;
  }
  render() {

    const { addClick, cycleListParams: { QCAType } } = this.props;
    const { cycleOptions, defaultValue } = this.state;
    const GetpollutantSelect = this.getpollutantSelect;
    return (
      <div style={{ marginTop: 10 }}>

        <Form className="search-form-container" layout="inline" onFinish={this.queryClick}>
          {QCAType == 1026 ?
            <Row style={{ flex: 1 }} >
              <Button type="primary" loading={false} onClick={addClick} style={{ marginRight: 5 }}>添加</Button>
            </Row>
            :
            <Row gutter={[8, 8]} style={{ flex: 1 }} >
              <Col xxl={5} xl={8} lg={12} md={24} sm={24} xs={24}>
                <Form.Item label="污染物" className='queryConditionForm'>
                  <GetpollutantSelect />
                </Form.Item>
              </Col>
              <Col xxl={5} xl={8} lg={12} md={24} sm={24} xs={24}>
                <Form.Item label="质控周期" className='queryConditionForm'>
                  <DropDownSelect placeholder='请选择质控周期' optiondatas={cycleOptions} onChange={this.cycleSelect} allowClear />
                </Form.Item>
              </Col>
              <Col xxl={2} xl={2} lg={24} md={24} sm={24} xs={24}>
                <Form.Item className='queryConditionForm'>
                  <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                  <Button type="primary" loading={false} onClick={addClick} style={{ marginRight: 5 }}>添加</Button>
                </Form.Item>
              </Col>
            </Row>
          }
        </Form>
      </div>);
  }
}

export default Index;