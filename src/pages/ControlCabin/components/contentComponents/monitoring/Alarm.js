import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import ReactSeamlessScroll from 'react-seamless-scroll';
import ContentItemWrapper from '../../ContentItemWrapper'
import { Button } from 'antd';
import MyButton from '../../Button'

const warningInfoList = [
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-22 15:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/22 15:00:00 氧含量发生[超量程异常],当前值为：20.79，量程范围为：[0.00-2.00],异常次数：1,首次异常时间：2022/6/22 15:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-22 11:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/22 14:00:00 氧含量发生[超量程异常],当前值为：20.8，量程范围为：[0.00-2.00],异常次数：4,首次异常时间：2022/6/22 11:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-22 01:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/22 10:00:00 氧含量发生[超量程异常],当前值为：20.8，量程范围为：[0.00-2.00],异常次数：10,首次异常时间：2022/6/22 1:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-21 10:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/22 0:00:00 氧含量发生[超量程异常],当前值为：20.81，量程范围为：[0.00-2.00],异常次数：15,首次异常时间：2022/6/21 10:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-21 09:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/21 9:00:00 氧含量发生[超量程异常],当前值为：10.16，量程范围为：[0.00-2.00],异常次数：1,首次异常时间：2022/6/21 9:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-21 01:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/21 8:00:00 氧含量发生[超量程异常],当前值为：20.79，量程范围为：[0.00-2.00],异常次数：8,首次异常时间：2022/6/21 1:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-20 15:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/21 0:00:00 氧含量发生[超量程异常],当前值为：20.75，量程范围为：[0.00-2.00],异常次数：10,首次异常时间：2022/6/20 15:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-20 11:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/20 14:00:00 氧含量发生[超量程异常],当前值为：20.73，量程范围为：[0.00-2.00],异常次数：4,首次异常时间：2022/6/20 11:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-20 10:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/20 10:00:00 氧含量发生[超量程异常],当前值为：6.99，量程范围为：[0.00-2.00],异常次数：1,首次异常时间：2022/6/20 10:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-20 09:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/20 9:00:00 氧含量发生[超量程异常],当前值为：14.63，量程范围为：[0.00-2.00],异常次数：1,首次异常时间：2022/6/20 9:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  },
  {
    "TaskId": "",
    "AlarmId": null,
    "DGIMN": "62030231rdep10",
    "PointName": "二号炉除尘后",
    "EntCode": "02901245648",
    "EntName": "XX水泥企业",
    "RegionCode": "110000000",
    "RegionName": "北京市",
    "CountEnt": 0,
    "CountPoint": 0,
    "ExceptionType": "2",
    "FirstTime": "2022-06-20 01:00:00",
    "OperationName": "",
    "CompleteTime": "",
    "ResponseStatus": "0",
    "DataType": "小时",
    "AlarmMsg": "[XX水泥企业-二号炉除尘后]在2022/6/20 8:00:00 氧含量发生[超量程异常],当前值为：20.84，量程范围为：[0.00-2.00],异常次数：8,首次异常时间：2022/6/20 1:00:00。",
    "AlarmCount": 0,
    "ResponseStatusName": "待响应",
    "LingAlarmCount": 0,
    "LingResponsedCount": 0,
    "LingNoResponseCount": 0,
    "ChaoAlarmCount": 0,
    "ChaoResponsedCount": 0,
    "ChaoNoResponseCount": 0,
    "AllRate": null,
    "LingRate": null,
    "ChaoRate": null
  }
]

@connect(({ loading, home }) => ({
  // warningInfoList: home.warningInfoList,
}))
class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode);
    }
  }

  getData = (entCode) => {
    const { dispatch } = this.props;
    // 获取报警信息
    dispatch({
      type: "home/getWarningInfo",
      payload: {
        entCode: entCode
      }
    })
  }

  render() {
    // const { warningInfoList } = this.props;
    return (
      <ContentItemWrapper
        title="报警情况"
        extra={
          <MyButton>查看详情</MyButton>
          // <Button size="small"></Button>
        }
      >
        <div className={styles.alarmContainer}>
          <ReactSeamlessScroll speed={20} style={{ width: '100%', height: '100%' }}>
            {
              warningInfoList.length ? warningInfoList.map(item => {
                return <div className={styles.itemMsg}>
                  <img src="/ControlCabin/alarm.png" />
                  <p>{item.AlarmMsg}</p>
                </div>
              }) : <div className={styles.notData}>
                <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
              </div>
            }
          </ReactSeamlessScroll>
        </div>
      </ContentItemWrapper>
    );
  }
}

export default Alarm;