


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,Spin} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import PollutantDownSelect from '@/components/PollutantDownSelect'
import DropDownSelect from '@/components/DropDownSelect'


/**
 * 质控核查设置   查询条件组件
 * jab 2020.08.18
 */

@connect(({loading,qualitySet }) => ({
    pollLoading: loading.effects['pollutantListData/getPollutantList'],
    dgimn:qualitySet.dgimn,
    pollType:qualitySet.pollType
}))

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          cycleOptions:[{value:"0",name:"1天"},{value:"1",name:"7天"},{value:"2",name:"30天"},{value:"3",name:"季度"}],
          dgimn:"",
          defaultValue:"0"
        };
    }
    // static getDerivedStateFromProps(props, state) {
    //   if (props.dgimn !== state.dgimn) {
    //     return {
    //       dgimn: props.dgimn
    //     };
    //   }
    // }
    componentDidMount(){
      this.pollChange();
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
    // componentDidUpdate(prevProps) {
    //   if(prevProps.dgimn !==  this.props.dgimn) {
    //     console.log(prevProps.dgimn)
    //     console.log("---------")
    //     console.log(this.props.dgimn)
    //   //  this.changeDgimn(this.props.dgimn);
    // }
    // }
    /** 切换排口 */
  //   changeDgimns = () => {
  //       this.getpollutantSelect();
  
  // }

  defaulltVal=(data)=>{
      console.log(data)
  }

  pollChange=(data)=>{
     console.log(data)
  }
/** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
 getpollutantSelect = () => {
    const { dgimn,pollType } = this.props;
    return  dgimn&&pollType ? <PollutantDownSelect  onChange={this.pollChange} dgimn={dgimn} polltype={pollType} defaulltval ={this.defaulltVal} /> :  null ; 
  }
  render() {

    const {queryClick,addClick} = this.props;
    const { cycleOptions,defaultValue } = this.state;
    const GetpollutantSelect = this.getpollutantSelect;
    return (
<div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={queryClick}>
          <Row gutter={[8,8]} style={{flex:1}} > 
            <Col xxl={5} xl={8}  lg={12}  md={24} sm={24} xs={24}>
              <Form.Item label="污染物" className='queryConditionForm'>
               <GetpollutantSelect />
              </Form.Item>
            </Col>
            <Col xxl={5} xl={8}   lg={12} md={24} sm={24} xs={24}>
              <Form.Item label="质控周期" className='queryConditionForm'>
               <DropDownSelect  optiondatas={cycleOptions}  defaultValue= {defaultValue}/>
              </Form.Item>
            </Col>
            <Col xxl={2} xl={2}   lg={24} md={24} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={addClick} style={{ marginRight: 5 }}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>);
  }
}

export default Index;