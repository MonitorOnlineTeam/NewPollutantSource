


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
                  <img src='/entSearch.png'/>
                 <Search  loading={loading} placeholder="请输入你要检索的字段" size="large" enterButton="检索一下" allowClear  onSearch={(value)=>this.searchChange(value)} />
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
       sessionStorage.setItem("oneEntName",item.EntNames)
  } 


  selectSty = (name,type)=>{
    const { searchValue } = this.state;
    const index = name&&name.indexOf(searchValue);
    const beforeStr = name&&name.substr(0, index);
    const afterStr = name&&name.substr(index + (searchValue? searchValue.length : 0));

    return  index > -1 && name ? (
       <div>
         {beforeStr}
         <div  style={{display:'inline-block'}} className={type==='point'? 'textOverflow'&&styles["site-search-value"] : styles["site-search-value"] }>{searchValue}</div>
        {afterStr}
       </div>
     ) : (
       <div style={{display:'inline-block'}} title={type==='point'&&name } className={type==='point'&&'textOverflow'} >{name&&name}</div>
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
    const  PointName = this.selectSty(item.PointName,'point')

    return { EntName,CorporationName,CorporationCode,MobilePhone,EntAddress,PointName,EntCode:item.EntCode,EntNames:item.EntName};
   });
   

  }


  render() {
    const {loading,dataSource,total} = this.props;
    const  QueryCriteria = this.queryCriteria;
    


    return (<div id="entList" className='entList' style={{height:'100%'}}>
        <Card title={<QueryCriteria />} style={{height:'100%'}}>
        <List
          itemLayout="vertical"
          split={false}
          dataSource={this.loop(dataSource)}
          pagination={total<10? false:{
            onChange: page => {
              console.log(page);
            },
            // pageSize: 6,
            // defaultPageSize:20,
            total: dataSource.length,
            showQuickJumper:true
          }}
          style={{paddingLeft:124}}
          renderItem={item => (
           <List.Item>
               <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
            <Row align='middle'> <img src='/ent.png' style={{height:18,paddingRight:6}}/> <span className={styles.titleHover} onClick={()=>this.itemClick(item)} style={{fontSize:16,fontFamily:'SimHei',color:'#3888ff',fontWeight:'bold',cursor:'pointer',lineHeight:'24px'}}>{item.EntName}</span> </Row>    
         <div className='listContent'>
        <div style={{paddingLeft:24}}>
        <Row>
          <Col> 
          <span>法人姓名：</span> <span className={styles.itemContent}>{item.CorporationName}</span>
          <span style={{padding:'0 10px'}}>|</span>
          <span>法人编号：</span> <span className={styles.itemContent}>{item.CorporationCode}</span>
          <span style={{padding:'0 10px'}}>|</span>
          <span>法人电话：</span> <span className={styles.itemContent}>{item.MobilePhone}</span>
          </Col>
        </Row> 
        <Row>
         <Col> <span>公司地址：</span> <span className={styles.itemContent}>{item.EntAddress}</span></Col>
        </Row>
        <Row>
         <span>排口名称：</span> <span className={styles.itemContent} style={{width:'calc(100% - 80px)'}}>{item.PointName}</span>
        </Row>
        </div> 
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