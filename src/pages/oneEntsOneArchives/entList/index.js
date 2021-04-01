


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,message,List,Input,Skeleton} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { green } from '@ant-design/colors';
import styles from './style.less'
const { Search } = Input;
/**
 * 企业列表
 * jab 2021.03.16
 */

@connect(({ entList }) => ({
    dataSource:entList.dataSource,
    total: entList.total,
    loading:entList.loading,
    standardParams:entList.standardParams,
}))

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        searchValue:''
        };
    }
    componentDidMount(){
      this.getData()     
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
}



      


  getData = (value)=>{
    let {dispatch,queryParams} = this.props;
     dispatch({
        type: 'entList/getEntsList',
        payload: { indexStr:value? value : ''  },
        callback:()=>{
          this.setState({searchValue:value})
        }
    });
  }

  searchChange = (value)=>{
     
    const { dispatch } = this.props
    this.getData(value)
  }

  // onChange=(value)=>{
  //   const { dispatch } = this.props
  //    dispatch({
  //     type: 'entList/updateState',
  //     payload: { ...queryParams  },
  //   });
  // }


      //查询条件
  queryCriteria = () => {
      const { loading } = this.props
    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline">
          <Row  style={{flex:1,margin:'10px 0'}} > 
            <Col xxl={8} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="" className='queryConditionForm'>
                  <Search  loading={loading} placeholder="请输入你要查找的字段" size="large" enterButton="查询一下" allowClear  onSearch={(value)=>this.searchChange(value)} />
              </Form.Item>
            </Col>
            {/* <Col xxl={4} xl={4} lg={4}  md={3} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </div>
    </div>
  }
  itemClick=(item)=>{
       router.push(`/oneEntsOneArchives/essentialInfo/entInfoDetail`);   
       sessionStorage.setItem("oneEntCode",item.EntCode)
       sessionStorage.setItem("oneEntName",item.EntName.props.children)
  } 


  selectSty = (name)=>{
    const { searchValue } = this.state;
    const index = name&&name.indexOf(searchValue);
    const beforeStr = name&&name.substr(0, index);
    const afterStr = name&&name.substr(index + (searchValue? searchValue.length : 0));
    return  index > -1 && name ? (
       <>
         {beforeStr}
         <div  style={{display:'inline-block'}} className={styles["site-search-value"]}>{searchValue}</div>
         {afterStr}
       </>
     ) : (
       <div style={{display:'inline-block'}} >{name&&name}</div>
     );
  }
  loop = (data)=>{
    const { searchValue } = this.state;
    return  data.map(item => {
    const  EntName = this.selectSty(item.EntName)
    const  CorporationName = this.selectSty(item.CorporationName)
    const  CorporationCode = this.selectSty(item.CorporationCode)
    const  MobilePhone = this.selectSty(item.MobilePhone)
    const  EntAddress = this.selectSty(item.EntAddress)
    const  PointName = this.selectSty(item.PointName)

    return { EntName,CorporationName,CorporationCode,MobilePhone,EntAddress,PointName,EntCode:item.EntCode};
   });
   

  }


  render() {
    const {loading,dataSource} = this.props;
    const  QueryCriteria = this.queryCriteria;
    


    return (<div id="entList" className='entList' style={{height:'100%'}}>
        <Card title={<QueryCriteria />} style={{height:'100%'}}>
        <List
          itemLayout="vertical"
          dataSource={this.loop(dataSource)}
          pagination={dataSource.length<6? false:{
            onChange: page => {
              console.log(page);
            },
            pageSize: 6,
            total:loading? 6 : dataSource.length
          }}
          renderItem={item => (
           <List.Item onClick={()=>this.itemClick(item)}>
               <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
            <Row> <h3>{item.EntName}</h3> </Row>    
         <div className='listContent'>
        <Row>
          <Col xxl={3} xl={4}   lg={6} md={6} sm={24} xs={24}> <span>法人姓名：</span> <span>{item.CorporationName}</span></Col>
        <Col><span>法人编号：</span> <span>{item.CorporationCode}</span></Col>

        </Row> 
        <Row>
         <Col xxl={3} xl={4}   lg={6} md={6} sm={24} xs={24}> <span>法人电话：</span> <span>{item.MobilePhone}</span></Col>
         <Col> <span>公司地址：</span> <span>{item.EntAddress}</span></Col>
        </Row>
        <Row>
         <span>排口名称：</span> <span>{item.PointName}</span>
        </Row>
        </div> 
        </Skeleton>
      </List.Item>
    )}
  />
        </Card>
     </div>);
  }
}

export default Index;