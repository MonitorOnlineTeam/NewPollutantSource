/*
 * @Author: JiaQi 
 * @Date: 2022-11-24 17:12:44 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-28 10:23:11
 * @Description: 报警记录查询页面
 */
import React, { PureComponent } from 'react'
import { Card, Tabs, Spin, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag, Tooltip } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SelectPollutantType from '@/components/SelectPollutantType'
import _ from "lodash"

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const Option = Select.Option;
const AlarmTypeList = [
  {
    label: '超标报警', value: '2'
  },
  {
    label: '异常报警', value: '0'
  },
]

@connect(({ alarm, common, loading }) => ({
  alarmRecordDataList: alarm.alarmRecordDataList,
  pollutantTypelist: common.pollutantTypelist,
  loading: loading.effects['alarm/getAlarmRecord'],
}))
class AlarmRecord extends PureComponent {
  formRef = React.createRef();
  state = {
    // entName: "",
    // DGIMN: "",
    pollutantCodes: [],
  }
  _SELF_ = {
    columns: [
      // {
      //   title: "行政区",
      //   width: 100,
      //   align: 'center',
      //   dataIndex: 'regionName',
      //   key: 'regionName',
      // },
      {
        title: "企业名称",
        width: 100,
        align: 'center',
        dataIndex: 'entName',
        key: 'entName',
      },
      {
        title: "报警点位",
        width: 100,
        align: 'center',
        dataIndex: 'pointName',
        key: 'pointName',
      },
      {
        title: "报警类型",
        width: 100,
        align: 'center',
        dataIndex: 'AlarmType',
        key: 'AlarmType',
        render: (text, record) => {
          let current = AlarmTypeList.find(item => item.value === text) || {};
          if (current.value === '0') {
            // 异常
            return <Tag color="warning">{current.label}</Tag>
          } else {
            // 超标
            return <Tag color="error">{current.label}</Tag>
          }
        }
      },
      {
        title: "首次报警时间",
        width: 100,
        align: 'center',
        dataIndex: 'firstTime',
        key: 'firstTime',
      },
      {
        title: "污染物类型",
        width: 90,
        align: 'center',
        dataIndex: 'pollutantType',
        key: 'pollutantType',
        render: (text, record) => {
          let current = this.props.pollutantTypelist.find(item => item.pollutantTypeCode == text) || {};
          return current.pollutantTypeName
        }
      },
      {
        title: "报警因子",
        width: 90,
        align: 'center',
        dataIndex: 'pollutantName',
        key: 'pollutantName',
      },
      {
        title: "报警信息描述",
        width: 200,
        align: 'left',
        dataIndex: 'message',
        key: 'message',
      },
    ]
  }

  componentDidMount() {
    this.getTableDataSource();
  }

  // 获取表格数据
  getTableDataSource = () => {
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "alarm/getAlarmRecord",
      payload: {
        "PollutantType": fieldsValue.PollutantType,
        "DataType": "HourData",
        BeginTime: moment(fieldsValue.time[0]).format("YYYY-MM-DD HH:00:00"),
        EndTime: moment(fieldsValue.time[1]).format("YYYY-MM-DD HH:59:59"),
        "AlarmType": fieldsValue.AlarmType,
      }
      // payload: {
      //   "RegionCode": "",
      //   "attentionCode": "", "PollutantType": "", "DataType": "HourData",
      //   "BeginTime": "2021-11-20 10:00:00", "EndTime": "2022-11-24 23:59:59", "PollutantCode": "", "Status": "", "EntCode": "", "VerifyStatus": [], "DGIMN": ""
      // }
    })
  }


  render() {
    const { columns } = this._SELF_;
    const { alarmRecordDataList, loading } = this.props;
    let pollutantCodeList = "";
    if (this.formRef.current) {
      pollutantCodeList = this.formRef.current.getFieldValue("PollutantCode")
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="global_state"
            layout="inline"
            ref={this.formRef}
            style={{ marginBottom: 20 }}
            initialValues={{
              time: [moment().subtract(1, 'days'), moment()],
            }}
          >
            <Form.Item
              name="AlarmType"
              label="报警类型"
            >
              <Select allowClear style={{ width: 180 }} placeholder="请选择报警类型">
                {
                  AlarmTypeList.map(item => {
                    return <Option key={item.value} value={item.value}>{item.label}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="PollutantType"
              label="污染物类型"
            >
              <SelectPollutantType allowClear style={{ width: 160 }} />
            </Form.Item>
            <Form.Item
              name="time"
              label="开始/结束时间"
            >
              <RangePicker showTime allowClear={false} format={'YYYY-MM-DD HH'} />
            </Form.Item>
            <Space align="baseline">
              <Button type="primary" onClick={this.getTableDataSource}>查询</Button>
            </Space>
          </Form>
          <SdlTable
            loading={loading}
            dataSource={alarmRecordDataList}
            columns={columns}
            scroll={{ y: 'calc(100vh - 320px)' }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default AlarmRecord;
