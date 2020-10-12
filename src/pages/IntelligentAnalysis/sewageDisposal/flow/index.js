/**
 * 功  能：污染物流量分析
 * 创建人：胡孟弟
 * 创建时间：2020.10.10
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message ,Tabs } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { red } from '@ant-design/colors';
const { Option } = Select;
const { TabPane } = Tabs;


const pageUrl = {
    updateState:'flowanalysisModel/updateState',
    GetFlowList :'flowanalysisModel/GetSewageFlowList',
    ExportSewageFlowList:'flowanalysisModel/ExportSewageFlowList'
}
@connect(({ loading , flowanalysisModel}) => ({
    loading:loading.effects["flowanalysisModel/GetSewageFlowList"],
    priseList:flowanalysisModel.priseList,
    FlowList:flowanalysisModel.FlowList
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defalutPollutantType: props.match.params.type,
      pollutantValue: [],
      time: [moment().add(-24, "hour"), moment()],
      dataType: "Hour",
      showType: "chart",
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.props.dispatch({
      //获取企业列表
      type: 'flowanalysisModel/getEntByRegion',
      payload: { RegionCode: '' },
    });
    this.props.dispatch({
        type:pageUrl.GetFlowList,
        payload:{
        }
    })

  };


  // 导出
  exportReport = () => {
    this.props.dispatch({
        type: pageUrl.ExportSewageFlowList,
        payload: {
          EntCode: this.state.pollutantValue,
          BeginTime: moment(this.state.time[0]),
          EndTime: moment(this.state.time[1]),
          DataType: this.state.dataType == 'Hour'?'HourData':'DayData',
        }
      })
  }

  onRef1 = (ref) => {
    this.childrenHand = ref;
  }

   // 获取图表及表格数据
   getChartAndTableData = () => {

    if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
      message.error('请选择污染物');
      return;
    }
    this.props.dispatch({
      type: pageUrl.GetFlowList,
      payload: {
        EntCode: this.state.pollutantValue.toString(),
        BeginTime: moment(this.state.time[0]),
        EndTime: moment(this.state.time[1]),
        DataType: this.state.dataType == 'Hour'?'HourData':'DayData',
      }
    })
  }

  children = () => {
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };
  cardTitle = () => {
    const { pollutantValue, time, dataType, format } = this.state;

    return (
      <>
        <Select
          //mode="multiple"
          style={{ width: 200, marginLeft: 10,marginRight: 10}}
          placeholder="污水处理厂列表"
          maxTagCount={2}
          maxTagTextLength={5}
          maxTagPlaceholder="..."
          onChange={(value) => {
            this.setState({
              pollutantValue: value
            })
          }}>
              {this.children()}
        </Select>

            <Radio.Group defaultValue="Hour" style={{ marginRight: 10 }} onChange={(e) => {
                    this.setState({
                      dataType: e.target.value,
                      time:e.target.value === 'Day' ?[moment().add(-7, "day")]:[moment().add(-24, "hour"), moment()]
                    })
                    e.target.value === "Day" ?this.childrenHand.onPanelChange([moment().add(-7, "day"), moment()]):this.childrenHand.onPanelChange([moment().add(-24, "hour"), moment()]);
                  }}>
                    <Radio.Button value="Hour">小时</Radio.Button>
                    <Radio.Button value="Day">日均</Radio.Button>
                  </Radio.Group>

        <RangePicker_  onRef={this.onRef1} dataType={dataType}  style={{  width: '25%', minWidth: '200px', marginRight: '10px'}} dateValue={time} callback={
            (dates, dataType)=>{
                console.log(dates)
                this.setState({
                    time:dates
                })
            }
        }/>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
        <Button type="primary"  style={{ marginRight: 10 }} onClick={this.exportReport}>导出</Button>
        <span style={{color:'red',marginLeft:20}}>"是否停运"列显示-,表示没有这个检测点</span>
      </>
    )
  }

  
  pageContent =()=>{
    const { showType,dataType } = this.state;
    const {FlowList,loading} = this.props

    console.log(FlowList)


    const hourTime = []
    const importValue = [] //进水口
    const exportValue = [] //出水口
    const backValue = [] //回口

    FlowList.map(item=>{
        if(item.backValue == "-")
        {
            backValue.push(0)
        }
        else
        {
            backValue.push(item.backValue)
        }
        if(item.exportValue == null)
        {
            exportValue.push(0)
        }
        else
        {
            exportValue.push(item.exportValue)
        }
        if(item.importValue == null)
        {
            importValue.push(0)
        }
        else
        {
            importValue.push(item.importValue)
        }
        hourTime.push(item.MonitorTime)
    })

      const option = {
        title: {
            //text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['进水口-流量', '回水口-流量', '出水口-流量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: hourTime
        },
        yAxis: {
            name:'流量(m³)',
            type: 'value'
        },
        series: [
            {
                name: '进水口-流量',
                type: 'line',
                stack: '总量',
                data: importValue
            },
            {
                name: '回水口-流量',
                type: 'line',
                stack: '总量',
                data: backValue
            },
            {
                name: '出水口-流量',
                type: 'line',
                stack: '总量',
                data: exportValue
            }
        ]
      }  

      const fixed = false
      const columns = [
        {
            title: "监测时间",
            width: '15%',
            align: 'center',
            fixed: fixed,
            dataIndex: 'MonitorTime',
            key: 'MonitorTime'
        },
        {
            title: "监测因子",
            width: '15%',
            align: 'center',
            fixed: fixed,
            dataIndex: 'pollutantName',
            key: 'pollutantName'
        },
        {
            title: "进水口",
            //width: '23%',
            align: 'center',
            fixed: fixed,
            children:[
                {
                    title: "流量(m³)",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: '流量',
                    key: 'importValue',
                    dataIndex: 'importValue',
                    render:(text)=>{
                      return  text === null ? '-' :text
                    }
                    
                },
                {
                    title: "是否停运",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: 'importStop',
                    key: 'importStop',
                    render:(text)=>{
                        return text == 0?'否':'是'
                    }
                },
            ]
        },
        {
            title: "回水口",
            //width: '23%',
            align: 'center',
            fixed: fixed,
            children:[
                {
                    title: "流量(m³)",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: '流量',
                    key: 'backValue',
                    dataIndex: 'backValue',
                    render:(text)=>{
                        return  text == '-' ? '-' :text
                    }
                },
                {
                    title: "是否停运",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: 'backStop',
                    key: 'backStop',
                    render:(text)=>{
                        return text == '-'?'否':'是'
                    }
                },
            ]
        },
        {
            title: "出水口",
            //width: '15%',
            align: 'center',
            fixed: fixed,
            children:[
                {
                    title: "流量(m³)",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: '流量',
                    key: 'exportValue',
                    dataIndex: 'exportValue',
                    render:(text)=>{
                        return text == null ? '-' :text
                    }
                },
                {
                    title: "是否停运",
                    width: '12%',
                    align: 'center',
                    fixed: fixed,
                    dataIndex: 'exportStop',
                    key: 'exportStop',
                    render:(text)=>{
                        return text == 0?'否':'是'
                    }
                },
            ]
        },
      ]
      if (loading) {
        return <PageLoading />
      }
        return <>{
            
            <Tabs defaultActiveKey = "1">
                <TabPane tab="变化趋势" key="1">
                    {
                        FlowList.length > 0 ?
                        <ReactEcharts
                          option={option}
                          lazyUpdate={true}
                          style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                          className="echarts-for-echarts"
                          theme="my_theme"
                      />
                      :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </TabPane>
                <TabPane tab="数据详情" key="2">
                    {
                        FlowList.length > 0 ?
                        <SdlTable columns={columns} dataSource={FlowList} pagination={false} />
                        :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </TabPane>
            </Tabs>
          }
          </>
      //
  }
  render() {
    return (
      <>
        <div id="siteParamsPage">
          <BreadcrumbWrapper title="流量对比分析">
            <Card
              title={this.cardTitle()}
              extra={
                <>
                </>
              }
              className="contentContainer"
            >
              {this.pageContent()}
            </Card>

          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;

