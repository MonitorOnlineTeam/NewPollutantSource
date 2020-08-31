


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
    defaultValue:paramsfil.defaultValue,
    ispollut:paramsfil.ispollut
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
         setTimeout(()=>{this.getpointpollutants(dgimn)}) 
  
      }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
      const {dispatch} = this.props;
       dispatch({
          type: 'paramsfil/getParaPollutantCodeList',
          payload: { DGIMN : dgimn  },
          callback: () => {
              this.getParaCodeList()
             
          }
      });
  }
  getParaCodeList=()=>{ //参数名称
    let {dispatch,pollutantlist} = this.props;
     dispatch({
        type: 'paramsfil/getParaCodeList',
        payload: {PollutantCode:pollutantlist[0].code},
        callback:()=>{
          this.queryClick();
        }
    });
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

  pollutChange =(value)=>{
    let {dispatch,instruListParams} = this.props;
    instruListParams = {
      ...instruListParams,
      PollutantCodeList:value
    }
     dispatch({
        type: 'paramsfil/updateState',
        payload: { instruListParams  },
    });
  }
/** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
getpollutantSelect = () => {
  const { pollutantlist } = this.props;
    const pollDefaultSelect = pollutantlist.map((item,index)=>{
      return  item.code
     });
    return (<DropDownSelect
      iscode = {1}
      mode = "multiple"
      optiondatas={pollutantlist}
      defaultValue={pollDefaultSelect}
      style={{minWidth:125,marginRight:5}}
      onChange={this.pollutChange} //父组件事件回调子组件的值
  /> );
}


  render() {

    const {addClick,pollutantlist,defaultValue,keepRecordClick,ispollut} = this.props;
    const GetpollutantSelect = this.getpollutantSelect;
    return (
<div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.queryClick}>
          <Row gutter={[0,8]} style={{flex:1}} justify="space-between"> 
          
           <Col xxl={18} xl={24}  lg={24}  md={24} sm={24} xs={24}>
           <Row  gutter={[4,8]} style={{flex:1}}> 
            <Col  xxl={8} xl={10}  lg={12}  md={24} sm={24} xs={24}>
              <Form.Item label="污染物" className='queryConditionForm' >
              { ispollut?  <GetpollutantSelect /> : <Spin size="small" />    }
              </Form.Item>
            </Col>
            <Col xxl={12} xl={12}   lg={24} md={24} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={addClick} style={{ marginRight: 5 }}>添加</Button>
              </Form.Item>
            </Col>
            </Row>
            </Col>

            <Row gutter={[4,8]} style={{flex:1}} style={{justifyContent:"flex-end"}}> 
              {/* <Col  gutter={[0,8]} xxl={4} xl={4}   lg={24} md={24} sm={24} xs={24}> */}
              <Form.Item  className='queryConditionForm' style={{marginRight:0}}> 
                <Button type="primary" loading={false} onClick={keepRecordClick} >备案</Button>
              </Form.Item>
            {/* </Col>   */}
            </Row>
          </Row>
        </Form>
      </div>);
  }
}

export default Index;