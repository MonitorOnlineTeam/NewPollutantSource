


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import DropDownSelect from '@/components/DropDownSelect'
/**
 * 质控核查设置   查询条件组件
 * jab 2020.08.18
 */

@connect(({loading,pollutantListData,qualitySet }) => ({
    pollLoading: loading.effects['pollutantListData/getPollutantList'],
    dgimn:qualitySet.dgimn,
    pollutantlist:pollutantListData.pollutantlist,
}))

class QueryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          cycleOptions:[{value:"0",name:"日"},{value:"0",name:"周"},{value:"0",name:"月"},{value:"0",name:"季"}]
        };
    }
    // static getDerivedStateFromProps(props, state) {

    // }
    componentDidMount(){
      this.props.initLoadData && this.changeDgimn(this.props.dgimn)
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {

}
    /** 切换排口 */
    changeDgimn = (dgimn) => {
        this.setState({
            dgimn
        })
        this.getpointpollutants(dgimn);
  
    }
      /** 根据排口dgimn获取它下面的所有污染物 */
      getpointpollutants = dgimn => {
        const {dispatch} = this.props;
         dispatch({
            type: 'pollutantListData/getPollutantList',
            payload: { DGIMNs : dgimn  },
            callback: () => {
                // this.initData();
            }
        });
  }
/** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
 getpollutantSelect = () => {
    const { pollLoading,pollutantlist } = this.props;
      const pollDefaultSelect = pollutantlist.map((item,index)=>{
        return  item.PollutantCode
       });
      return ( pollLoading ?  <Spin size="small" /> :<DropDownSelect
        optionDatas={pollutantlist}
        defaultValue={pollDefaultSelect}
        onChange={this.handlePollutantChange} //父组件事件回调子组件的值
    /> );
  }
  render() {

    const {onFinish} = this.props;
    const { cycleOptions } = this.state;
    const GetpollutantSelect = this.getpollutantSelect;
    return (
<div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[8,8]} style={{flex:1}} > 
            <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="污染物" className='queryConditionForm'>
               <GetpollutantSelect />
              </Form.Item>
            </Col>
            <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="质控周期" className='queryConditionForm'>
               <DropDownSelect isPollutant={false} optionDatas={cycleOptions}/>
              </Form.Item>
            </Col>
            <Col xxl={4} xl={4} lg={4}  md={3} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={() => { this.exportData() }} style={{ marginRight: 5 }}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>);
  }
}

export default QueryForm;