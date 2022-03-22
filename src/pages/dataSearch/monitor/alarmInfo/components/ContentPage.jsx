


import React from 'react';

import { Card, Table, Empty, Form, Row, Col, Button, TreeSelect, Spin, Tooltip, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { blue, green, gold } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'
const { SHOW_PARENT } = TreeSelect
/**
 * 报警信息
 * jab 2020.09.4
 */



@connect(({ alarmInfoData, common }) => ({
  tableDatas: alarmInfoData.tableDatas,
  total: alarmInfoData.total,
  tablewidth: alarmInfoData.tablewidth,
  tableLoading: alarmInfoData.tableLoading,
  queryParams: alarmInfoData.queryParams,
  alarmTypeList: alarmInfoData.alarmTypeList,
  defaultAlarmType: alarmInfoData.defaultAlarmType,
  alarmTypeLoading: alarmInfoData.alarmTypeLoading,
  entAndPointList: common.entAndPointList,
}))

class TableData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dateValue: [moment(new Date()).add(-1, 'month'), moment(new Date())],
    };
    this.columns = [
      {
        title: '企业排口',
        align: 'center',
        dataIndex: 'ParentName',
        render: (text, record) => {
          return `${text}-${record.PointName}`
        },
        width: 230
      },

      {
        title: '报警时间',
        align: 'center',
        dataIndex: 'AlarmTime',
        render: (text, record) => {
          return text ? <span>{text}</span> : "-"
        },
        width: 200
      },
      {
        title: '报警类型',
        align: 'center',
        dataIndex: 'AlarmTypeName',
        // render: (text, record) => {
        // switch (text) {
        //   case "5":
        //     return <span> 超标报警</span>
        //   case "0":
        //     return  <span> 数据异常报警</span>
        // case "2":
        //   return  <span> 超上限</span>
        // case "3":
        //   return  <span> 参数不符</span>
        // case "3":
        //   return  <span> 参数不符</span>
        //     default:
        //       return "-"
        // }

        // },
        width: 200
      },
      {
        title: '描述',
        dataIndex: 'AlarmMsg',
        render: (text, record, index) => {
          return <div>
            {this.desc(text, record, index)}
          </div>

        },

        width: 400
      },
    ]
  }





  tooltipText = (value) => {
    return <div style={{ color: 'rgba(0, 0, 0, 0.65)', wordWrap: 'break-word' }}>{value}</div>
  }

  desc = (text, record, index) => {
    const date = record.FirstTime;

    const code = [ ...new Set(record.PollutantCode.split(","))].join()
    const startTime = moment(date).format("YYYY-MM-DD 00:00:00")
    // const endTime = date;
    const endTime = record.AlarmTime;
    const check={
      "3101":`/dataSearch/qca/zeroCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`,
      '3102':`/dataSearch/qca/rangeCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`,
      '3105':`/dataSearch/qca/blindCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`,
      '3104':`/dataSearch/qca/linearCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`,
      '3103':`/dataSearch/qca/resTimeCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`,
      '3106':`/dataSearch/qca/errorValueCheck?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}`
    }
    if (record.AlarmType == 13) {  //质控核查报警

      return  <div style={{textAlign: 'left',}}>
       { record.AlarmMsg.split(";").map((item,index)=>{

              let see = record.PollutantCode.split(",")[index];
               return  <>
                 <span style={{  paddingRight: 5, }}  >
                  {item}
               </span>
                {see?  <Link style={{  paddingRight: 8, }} to={`${check[see.split("@")[1]]}&code=${see.split("@")[0]}`} >查看</Link> : null}
                </>
      })
    }
      </div>

    } else {
        const dataType = record.DataDtype.split(",").length>1? '' : record.DataDtype;

      return <div style={{ overflow: "hidden" }}>
        <Tooltip title={this.tooltipText.bind(this,text)} color={"#fff"} overlayStyle={{ maxWidth: 550}}  >
          <span style={{ textAlign: 'left', '-webkit-box-orient': 'vertical', width: 'auto', paddingRight: 5,float:"left" }} className="line-clamp-3"  >
               {text}
          </span>

        </Tooltip>
        <span style={{float:"left"}}>
          {record.AlarmType === "2" ? // 数据超标
            <Link to={`/dataSearch/monitor/alarm/overrecord?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&dataType=${dataType}&title=${`${record.ParentName.replace(/\#/g,"%23")}-${record.PointName.replace(/\#/g,"%23")}`}&code=${code}`} >查看</Link> :
            record.AlarmType === "0" ? //数据异常
              <Link to={`/dataSearch/monitor/alarm/exceptionRecord?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&dataType=${dataType}&title=${`${record.ParentName.replace(/\#/g,"%23")}-${record.PointName.replace(/\#/g,"%23")}`}&code=${code}`} >查看</Link> :
              record.AlarmType === "12" ? //备案不符
                <Link to={`/dataSearch/monitor/historyparameDetail?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName.replace(/\#/g,"%23")}-${record.PointName.replace(/\#/g,"%23")}`}&code=${code}`} >查看</Link> :
                 <></>

          }
        </span>
      </div>


    }


  }
  componentDidMount() {

    this.props.initLoadData && this.getAlarmTypeList();
    this.getEntAndPointList();


  }
  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: { "Status": [], "RunState": "1", "PollutantTypes": "1,2" }
    })
  }
  //获取报警类型
  getAlarmTypeList = () => {
    this.props.dispatch({
      type: "alarmInfoData/getAlarmType",
      payload: {},
      callback: () => {
        this.getTableData()
      }
    })
  }




  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
    let { dispatch, queryParams } = this.props;
    dispatch({
      type: 'alarmInfoData/getAlarmDataList',
      payload: { ...queryParams },
    });

  }

  /**
 * 回调获取时间并重新请求数据
 */
  dateCallback = (dates, dataType) => { //更新日期
    let { queryParams, dispatch } = this.props;
    this.setState({ dateValue: dates })
    queryParams = {
      ...queryParams,
      beginTime: dates[0].format('YYYY-MM-DD 00:00:00'),
      endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    }
    dispatch({
      type: 'alarmInfoData/updateState',
      payload: { queryParams },
    })
  }
  onFinish = () => {

    let { dispatch, queryParams } = this.props;
    dispatch({
      type: 'alarmInfoData/getAlarmDataList',
      payload: { ...queryParams },
    });
  }


  alarmSelect = (value, label, extra) => {
    let { queryParams, dispatch } = this.props;
    queryParams = {
      ...queryParams,
      alarmType: value
    }
    dispatch({
      type: 'alarmInfoData/updateState',
      payload: { queryParams },
    })

  }


  treeChange = (value) => {
    let { queryParams, dispatch } = this.props;
    dispatch({
      type: 'alarmInfoData/updateState',
      payload: { queryParams: { ...queryParams, mnList: value } },
    })
  }

  //导出数据
  exportData = () => {
   let {dispatch,queryParams} = this.props;
     dispatch({
        type: 'alarmInfoData/exportDatas',
        payload: {...queryParams },
    });

  }

  //查询条件
  queryCriteria = () => {
    const { dateValue, alarmOptions, defaultValue } = this.state;

    const { entAndPointList, alarmTypeList, alarmTypeLoading, defaultAlarmType } = this.props;
    const tProps = {
      treeData: entAndPointList,
      treeDefaultExpandAll: true,
      treeCheckable: true,
      treeNodeFilterProp: "title",
      placeholder: '请选择企业排口',
      allowClear: true,
      // value:'62020131jhdp03',
      maxTagCount:2,
      maxTagTextLength:4,//单个选择项文本长度 超出则是省略号显示
      style: {
        width: '100%',
      },
    };

    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline" onFinish={this.onFinish}>
          <Row gutter={[8, 8]} style={{ flex: 1 }} >

            <Col xxl={6} xl={10} lg={14} md={16} sm={24} xs={24}>

              <Form.Item label="报警时间" className='queryConditionForm'>
                <RangePicker_
                  format={"YYYY-MM-DD"}
                  showTime={false}
                  onRef={this.onRef1}
                  dateValue={dateValue}
                  isVerification={true}
                  callback={(dates, dataType) => this.dateCallback(dates, dataType)} //父组件事件回调子组件的值
                  allowClear={false} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={10} lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="企业排口" className='queryConditionForm'>
                <TreeSelect {...tProps} onChange={this.treeChange} />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={10} lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="报警类型" className='queryConditionForm'>
                {!alarmTypeLoading ? <DropDownSelect  placeholder='请选择报警类型' iscode={1} mode='multiple'  optiondatas={alarmTypeList} defaultValue={defaultAlarmType} onChange={this.alarmSelect} /> : <Spin size='small' />}
               </Form.Item>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={3} sm={24} xs={24}>
              <Form.Item className='queryConditionForm'>
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={() => { this.exportData() }} style={{ marginRight: 5 }}>导出</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }



  render() {

    const { tableLoading, tableDatas, total } = this.props;
    const QueryCriteria = this.queryCriteria;

    return (

      <div id="alarmInfoData">
        <Card title={<QueryCriteria />} >
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={tableDatas}
            columns={this.columns}
            resizable
            defaultWidth={80}
            scroll={{ y: this.props.tableHeight || undefined }}
            loading={tableLoading}
            pagination={{ showSizeChanger: true, showQuickJumper: true, defaultPageSize: 20 }}
          />
        </Card>
      </div>);
  }
}

export default TableData;
