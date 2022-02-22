import React, { useState,useEffect } from 'react';
import { connect } from 'dva'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Table, Input, InputNumber, Popconfirm, Form,Spin,Tabs, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
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

  const { qualityPollutantList } = props;


  useEffect(() => {
    props.getQualityPollutantList({},(data)=>{ //获取质控类型信息
      if(data){
        const pollutantCodeDefaultData = data.map(item=>{
          return item.ChildID
        })
        form.setFieldsValue({pollutantCode: pollutantCodeDefaultData})
      }

      props.getQualityTypeList({},(res)=>{
        setTabkey(res&&res[0]?res[0].ChildID : null)
        onFinish()
      }) 
    }) //获取质控污染物信息

  },[]);


  const getOption = () => {
    const { zeroChartData } = props;

    const valueMax = _.max(zeroChartData.dataList) ? _.max(zeroChartData.dataList) : 0;
    const standardMax = _.max([zeroChartData.standard.top, zeroChartData.standard.lower]) ? _.max([zeroChartData.standard.top, zeroChartData.standard.lower]) : 0
    let max = _.max([valueMin, valueMax]) + 5


    const valueMin = _.min(zeroChartData.dataList) ? _.min(zeroChartData.dataList) : 0;
    const standardMin = _.min([zeroChartData.standard.top, zeroChartData.standard.lower]) ? _.min([zeroChartData.standard.top, zeroChartData.standard.lower]) : 0
    let min = _.min([valueMin, standardMin]) + -5


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
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // data: zeroChartData.timeList
      },
      yAxis: {
        name: '(%)',
        type: 'value',
        // max: Math.ceil(max),
        // min: Math.ceil(min)
      },
      visualMap: [{
        show: false,
        pieces: [{
          gt: 0,
          lte: zeroChartData.standard.top,
          color: '#248000'
        }, {
          gt: zeroChartData.standard.lower,
          lte: 0,
          color: '#248000'
        }, {
          gt: zeroChartData.standard.top,
          lte: Math.ceil(max),
          color: '#ff0000'
        }, {
          gt: Math.ceil(min),
          lte: zeroChartData.standard.lower,
          color: '#ff0000'
        }],
        seriesIndex: 0
      }],
      series: [{
        name: "相对误差",
        data: zeroChartData.dataList,
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: zeroChartData.standard.top,
              label: {
                normal: {
                  formatter: `标准要求${zeroChartData.standard.top}%` // 基线名称
                }
              }
            },
            {
              yAxis: zeroChartData.standard.lower,
              label: {
                normal: {
                  formatter: `标准要求${zeroChartData.standard.lower}%` // 基线名称
                }
              }
            }
          ]
        },
        itemStyle: {
          borderWidth: 3,
          // borderColor: 'yellow',
          color: function (params) {
            let color;
            if (params.data > zeroChartData.standard.top || params.data < zeroChartData.standard.lower) {
              color = "#ff0000"
            } else {
              color = "#248000"
            }
            return color;
          }
        }
      }]
    };
  }
  const onFinish  = async () =>{  //查询
    try {
      const values = await form.validateFields();
      props.getQualityRecordList({
        beginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
        pollutantCode:values.pollutantCode&&values.pollutantCode[0]? values.pollutantCode.toString() : '',
        typeID:tabKey
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
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
  > 
  <Form.Item name='time' label='开始/结束时间'>
          <RangePicker   style={{width:'100%'}} 
                        allowClear={false}
                        showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
           />
     </Form.Item>
      <Form.Item label = '污染物' name='pollutantCode' style={{padding:'0 8px'}}>
        {props.loadingQualityPollutantList?<Spin size='small'/> : <Select maxTagCount={4} style={{width:260}} mode='multiple' placeholder='请选择'>
           {qualityPollutantList.map(item=> <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)}
            </Select>}
        </Form.Item>
        <Form.Item>
     <Button  type="primary" htmlType='submit' >
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
  }
  return (
      <BreadcrumbWrapper id="zeroCheck">
         <Card title={<SearchComponents />}>
         {props.loadingQualityTypeList? <PageLoading /> :<Tabs defaultActiveKey={tabKey} type="card" onChange={tabChange}>    
        :<>
          {props.qualityTypeList.map(item=>{
            return  <TabPane tab={item.Name} key={item.ChildID}>
            Content of card tab 1
          </TabPane>
          })} 

        </>
        </Tabs>}
       {/* <ReactEcharts
          option={getOption()}
          style={{ height: "calc(100vh - 270px)" }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> */}
        {/* <div className={styles.bottomLegendContainer}>
          <div className={styles.legendItem}>
            <i className={styles.sanjiao}></i>
            合格
            </div>
          <div className={styles.legendItem}>
            <i className={`${styles.sanjiao} ${styles.bhg}`}></i>
            不合格
            </div>
        </div> */}
        </Card>
      </BreadcrumbWrapper>
  );
}
export default connect(dvaPropsData,dvaDispatch)(Index);
