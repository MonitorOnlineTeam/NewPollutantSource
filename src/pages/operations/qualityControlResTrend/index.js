import React, { useState,useEffect } from 'react';
import { connect } from 'dva'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Table, Input, InputNumber, Popconfirm, Form,Spin,Tabs, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import NavigationTree from '@/components/NavigationTree';
import moment from 'moment'
import styles from './index.less';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const namespace = 'operations'
const dvaPropsData =  ({ loading,operations,global }) => ({
  tableDatas:operations.tableDatas,
  tableLoading:operations.tableLoading,
  tableTotal:operations.tableTotal,
  loadingQualityPollutantList: loading.effects[`${namespace}/getQualityPollutantList`],
  loadingQualityRecordList:loading.effects[`${namespace}/getQualityRecordList`],
  loadingQualityTypeList:loading.effects[`${namespace}/getQualityTypeList`],
  qualityTypeList:operations.qualityTypeList,
  qualityPollutantList:operations.qualityPollutantList,
  qualityRecordList:operations.qualityRecordList,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getQualityRecordList:(payload)=>{ //列表 获取质控结果信息  
      dispatch({
        type: `${namespace}/getQualityRecordList`,
        payload:payload,
      })
    },
    getQualityPollutantList:(payload,callback)=>{ //获取质控污染物信息  
      dispatch({
        type: `${namespace}/getQualityPollutantList`,
        payload:payload,
        callback:callback
      })
    },   
    getQualityTypeList:(payload,callback)=>{ //获取质控类型信息  
      dispatch({
        type: `${namespace}/getQualityTypeList`,
        payload:payload,
        callback:callback
      })
    },    
  }
}

const Index = (props) => {
  const [form] = Form.useForm();

  const [ DGIMN,setDGIMN ] = useState();
  
  const [legendTypeList,setLegendTypeList] = useState([])

  const { qualityRecordList } = props;


  useEffect(() => {
    if(DGIMN)
    props.getQualityPollutantList({},(data)=>{ //获取质控类型信息
      if(data){
        const pollutantCodeDefaultData = data.map(item=>{
          return item.ChildID
        })
        form.setFieldsValue({pollutantCode: pollutantCodeDefaultData})
        setLegendTypeList(data)
        setCurrentPollutant(data[0]?data[0].ChildID : null)
      }

      props.getQualityTypeList({},(res)=>{
        const defaultTypeID = res&&res[0]?res[0].ChildID : null
        setTabkey(defaultTypeID)
        onFinish(defaultTypeID)
      }) 
    }) //获取质控污染物信息
  },[DGIMN]);


  const getOption = () => {
    let data = []
    if(qualityRecordList[0]){
      qualityRecordList.map(item=>{
        if(item.QualityItem == currentPollutant){
          data.push(item)
        }
      })
    }
    return {
      title: {
        text: "24小时零点漂移历史数据",
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params, ticket, callback) => {
          let param = params[0]
          let format = `${param.name}<br />${param.marker}${param.value}%`
          return format
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          saveAsImage: {}
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '80px',
        top: "80px",
        containLabel: true,   
      },
      xAxis: {
        type: 'category',
        data: data[0]? data.map(item=>item.QualityTime) : []
      },
      yAxis: {
        name: '(%)',
        type: 'value',      
      },
      series: [
        {
          data: data[0]? data.map(item=>item.RelativeError) : [],
          type: 'line',
          symbol: 'triangle',
          symbolSize: 20,
          lineStyle: {
            color: '#5470C6',
            width: 4,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 3,
            color: function (params,index) {
              let color;
              const isQualified = data[0]? data.map(item=>item.IsQualified)[params.dataIndex] .toString() == 1 :true;
              if (isQualified) {
                 color = "#248000"
              } else {
                color = "#ff0000"
              }
              return color;
            }
          }
        }
      ]
    };
  }
  const onFinish  = async (typeID) =>{  //查询

    try {
      const values = await form.validateFields();
      props.getQualityRecordList({
        beginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
        pollutantCode:values.pollutantCode&&values.pollutantCode[0]? values.pollutantCode.toString() : '',
        typeID: typeID && !(typeID instanceof Object) ? typeID : tabKey,
        DGIMN:DGIMN,
      })


        if(typeID instanceof Object){ //非初始化加载的时候
        let data = []  //图例
        qualityPollutantList.map(item=>{
          values.pollutantCode.map(code=>{
            if(item.ChildID === code){
              data.push(item)
            } 
          })
        })
        setLegendTypeList([...data])
        setCurrentPollutant(data[0]?data[0].ChildID : null)
        }


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'pollutantCode'){
    }
  }

  const SearchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    layout='inline'
    onFinish={onFinish}
    initialValues={{
      time:[moment(new Date()).add(-30, 'day').startOf('day'), moment(new Date()).add(-1, 'day').endOf('day')]
    }}
    onValuesChange={onValuesChange}
  > 
  <Form.Item name='time' label='开始/结束时间' style={{paddingBottom:5}}>
          <RangePicker   style={{width:'100%'}} 
                        allowClear={false}
                        showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
           />
     </Form.Item>
      <Form.Item label = '污染物' name='pollutantCode' style={{paddingBottom:5}}>
        {props.loadingQualityPollutantList?<Spin size='small'/> : <Select maxTagCount={4}   style={{width:260}} mode='multiple' placeholder='请选择'>
           {qualityPollutantList.map(item=> <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)}
            </Select>}
        </Form.Item>
        <Form.Item>
     <Button  type="primary" htmlType='submit' loading={props.loadingQualityRecordList}>
          查询
     </Button>
     {/* <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
            导出
     </Button>  */}
     
     </Form.Item>
  </Form>
  }
  const  [tabKey,setTabkey] =useState()
  const tabChange = (key) =>{
    setTabkey(key)
    onFinish(key)
  }

   const { qualityTypeList,qualityPollutantList } = props;
 
   
   const [currentPollutant,setCurrentPollutant] = useState(null)
  
  return (<div id='qualityControlResTrend'>

    <NavigationTree  runState='1'   domId="#record" choice={false}  onItemClick={value => {
      if (value.length > 0 && !value[0].IsEnt) {
        setDGIMN(value[0].key)
      }
    }}
  />
      <BreadcrumbWrapper>

         <Card title={<SearchComponents />} >
         {props.loadingQualityTypeList? <PageLoading /> :<Tabs defaultActiveKey={tabKey} type="card" onChange={tabChange}>    
        :<>
          {qualityTypeList.map(item=>{
            return  <TabPane tab={item.Name} key={item.ChildID}>
            {props.loadingQualityRecordList?
             <PageLoading />
             :
             <div style={{ position: "relative" }}>
                     <div className={styles.legendContainer}>
          {
            legendTypeList.map(item => {
              return <div key={item.ChildID} className={styles.legendItem} onClick={() => {
                setCurrentPollutant(item.ChildID)

                // qualityRecordList[0]&&qualityRecordList.map(code=>{
                //   if(code.QualityItem == item.ChildID){
                //   props.updateState({ qualityRecordList: code })
                //   }
                // })
              }}>
                <i className={currentPollutant === item.ChildID ? styles.active : ""}></i>
                {item.Name}
              </div>
            })
          }

            </div>
             <ReactEcharts
             option={getOption()}
             style={{ height: "calc(100vh - 270px)" }}
             className="echarts-for-echarts"
             theme="my_theme"
           /> 

           <div className={styles.bottomLegendContainer}>
           <div className={styles.legendItem}>
             <i className={styles.sanjiao}></i>
             合格
             </div>
           <div className={styles.legendItem}>
             <i className={`${styles.sanjiao} ${styles.bhg}`}></i>
             不合格
             </div>
         </div>
         </div>
            }
          </TabPane>
          })} 

        </>
        </Tabs>}
 
        </Card>
      </BreadcrumbWrapper>
      </div>
  );
}
export default connect(dvaPropsData,dvaDispatch)(Index);
