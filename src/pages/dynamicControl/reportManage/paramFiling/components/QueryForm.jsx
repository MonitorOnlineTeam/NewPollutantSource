


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

@connect(({loading,paramsfil }) => ({
    dgimn:paramsfil.dgimn,
    instruListParams:paramsfil.instruListParams,
    pollutantlist:paramsfil.pollutantlist,
    defaultValue:paramsfil.defaultValue
}))

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          dgimn:"",
        };
    }
    componentDidMount(){
      this.getTableData(this.props.dgimn)
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
   if(prevProps.dgimn !==  this.props.dgimn) {
        this.getTableData(this.props.dgimn);
    }

}

  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
          let {dispatch,instruListParams} = this.props;
          instruListParams = {
            ...instruListParams,
            DGIMN:dgimn,
          }
           dispatch({
              type: 'paramsfil/updateState',
              payload: { instruListParams  },
          });
         setTimeout(()=>{this.queryClick()}) 
  
      }


  queryClick = () =>{ //查询

    let {dispatch,instruListParams} = this.props;
    instruListParams = {
      ...instruListParams,
    }
     dispatch({
        type: 'paramsfil/getParameterFilingList',
        payload: { ...instruListParams  },
    });
  }
  instruChange =(value)=>{
    let {dispatch,instruListParams} = this.props;
    instruListParams = {
      ...instruListParams,
      PollutantCodeList:data
    }
     dispatch({
        type: 'paramsfil/updateState',
        payload: { instruListParams  },
    });
  }

  render() {

    const {addClick,pollutantlist,defaultValue} = this.props;
    const GetpollutantSelect = this.getpollutantSelect;
    return (
<div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.queryClick}>
          <Row gutter={[8,8]} style={{flex:1}} > 
            <Col xxl={5} xl={8}  lg={12}  md={24} sm={24} xs={24}>
              <Form.Item label="污染物" className='queryConditionForm'>
              <DropDownSelect  mode="multiple"  optiondatas={pollutantlist}  defaultValue= {defaultValue}  onChange={this.instruChange}/>
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