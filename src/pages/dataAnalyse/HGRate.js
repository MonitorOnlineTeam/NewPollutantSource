import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable'
import { Card, Form, DatePicker, Input, Row, Select, Button, Space, Progress } from "antd"
import moment from 'moment'
import { entList, ZXRateTableData } from './mock-data'

const { RangePicker } = DatePicker;
const { Option } = Select;

class HGRate extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      columns: [
        {
          title: '行政区',
          dataIndex: 'RegionName',
        },
        {
          title: '企业名称',
          dataIndex: 'EntName',
        },
        {
          title: '应执行次数',
          dataIndex: 'yzxCount',
        },
        {
          title: '合格次数',
          dataIndex: 'SJCount',
        },
        {
          title: '合格率',
          dataIndex: 'rate',
          render: (text, record) => {
            let percent = (record.SJCount / record.yzxCount).toFixed(2) * 100;
            return <>
              <Progress successPercent={percent} percent={percent} format={percent => (<span style={{ color: '#333' }}>{percent}%</span>)} />
            </>
          }
        },
      ]
    };
  }
  render() {
    const { columns } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="global_state"
            layout='inline'
            style={{ marginBottom: 20 }}
            ref={this.formRef}
            initialValues={{
              time: [moment().subtract(29, 'days'), moment()],
            }}
          // onFieldsChange={(changedFields, allFields) => {
          //   console.log('changedFields=', changedFields)
          //   console.log('allFieldss=', allFields)
          // }}
          >
            <Form.Item
              name="time"
              label="开始/结束时间"
            >
              <RangePicker showTime style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              name="PollutantCode"
              label="企业列表"
            >
              <Select style={{ width: 200 }} placeholder="请选择企业列表">
                {
                  entList.map(item => {
                    return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Space align="baseline">
              <Button type="primary">查询</Button>
              <Button type="primary">导出</Button>
            </Space>
          </Form>
          <SdlTable dataSource={ZXRateTableData} columns={columns} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default HGRate;