
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Tabs, Icon, Modal } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { routerRedux } from 'dva/router';
import style from '@/pages/dataSearch/tableClass.less'
import ExceedDataAlarm from '@/pages/dataSearch/exceedDataAlarmRecord/exceedDataAlarmModal'
import ExceedData from '@/pages/dataSearch/exceedData/exceedDataModal'
import FlowModal from '@/pages/IntelligentAnalysis/sewageDisposal/flow/flowModal'
import TransmissionefficiencyModal from '@/pages/IntelligentAnalysis/newTransmissionefficiency/entIndexModal'
import OverVerifyLstModal from '@/pages/IntelligentAnalysis/dataAlarm/overVerifyRate/components/OverVerifyLstModal'
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ loading }) => ({
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

        alarmVisible:false,
        alarmType:'1',
        exceedVisible:false,
        dateTime:[moment().add(-48, "hour"), moment()],
        exceedType:'',
        exceedDataType:'Hour',
        exceedPollutant:'zs01',  //101  zs01
        exceedTime:[moment().add(-7, "day"), moment()],
        flowVisible:false,
        flowTime:[moment().add(-30, "day"), moment()],
        flowEntCode:'00557cc5-53d5-4bd2-81d5-1b81deba7018',
        pollutantType:'1',
        TBeginTime:moment().add(-7, "day"),
        TEndTime:moment(),
        OverVisible:false,
    };
  }

  getChartAndTableData = () => {
    this.setState({
      alarmVisible: true,
    })
  }

  water = () => {
    this.setState({
      exceedVisible: true,
      exceedType: '1'
    })
  }
  gas = () => {
    this.setState({
      exceedVisible: true,
      exceedType: '2'
    })
  }
  flow = () => {
    this.setState({
      flowVisible: true,
    })
  }
  Tra = () => {
    this.setState({
      TVisible: true,
    })
  }
  Over = () => {
    this.setState({
      OverVisible: true,
    })
  }
  cardTitle = () => {

    return (
      <>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>实时报警</Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.water}>七日超标废水</Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.gas}>七日超标废气</Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.flow}>流量对比分析</Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.Tra}>有效传输率</Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={this.Over}>超标报警核实率</Button>
      </>
    )
  }
  onCancelChange = () => {
    this.setState({
      alarmVisible: false
    })
  }
  render() {
    const { alarmVisible, dateTime, exceedVisible,exceedDataType,exceedPollutant, exceedType, exceedTime, flowVisible, flowTime, flowEntCode, TVisible,pollutantType,TBeginTime,TEndTime,OverVisible,alarmType } = this.state
    return (
      <>
        <div id="siteParamsPage" className={style.cardTitle}>
          <Card
            extra={
              <>
                {this.cardTitle()}
              </>
            }
            className="contentContainer"
          >
            {/* 实时数据

                参数:
                dateTime  时间参数
                alarmType 企业类型    '1'是废水  '2' 是废气
              */}
                {alarmVisible? <ExceedDataAlarm dateTime={dateTime} alarmType={alarmType}  alarmVisible={alarmVisible} alarmCancle={()=>{
                    this.setState({alarmVisible:false});
                }}/>:null}
            {/* 超标废水监测点  和  超标废气监测点
                参数:
                exceedTime  时间参数  默认是7天
                exceedType  企业类型  '1'是废水  '2' 是废气
                exceedDataType  数据类型   小时/日均
                exceedPollutant 监测因子
              */}
            {exceedVisible ? <ExceedData exceedTime={exceedTime} exceedDataType ={exceedDataType} exceedPollutant={exceedPollutant} exceedVisible={exceedVisible} exceedType={exceedType} exceedCancle={() => {
              this.setState({ exceedVisible: false });
            }} /> : null}


            {/* 流量对比分析
                参数:
                flowTime  时间参数  默认是30天
                flowEntCode  污水处理厂编码EntCode

              */}
            {flowVisible ? <FlowModal flowTime={flowTime} flowEntCode={flowEntCode} flowVisible={flowVisible} flowCancle={() => {
              this.setState({ flowVisible: false });
            }} /> : null}

            {/* 有效传输有效率
                参数:
                pollutantType  污染物类型  
                beginTime  开始时间
                endTime 结束时间

              */}
            {
              TVisible ?
                <TransmissionefficiencyModal 
                 beginTime={TBeginTime}
                 endTime={TEndTime}
                 TVisible={TVisible} 
                 TCancle={() => {
                  this.setState({ TVisible: false });
                }} 
                pollutantType={pollutantType}
                /> : null}
                {/* 超标报警核实率
                参数:
                beginTime  开始时间
                endTime 结束时间

              */}
            {
              OverVisible ?
                <OverVerifyLstModal 
                 beginTime={TBeginTime}
                 endTime={TEndTime}
                 TVisible={OverVisible} 
                 TCancle={() => {
                  this.setState({ OverVisible: false });
                }} 
                /> : null}
            
          </Card>
        </div>
      </>
    );
  }
}

export default index;

