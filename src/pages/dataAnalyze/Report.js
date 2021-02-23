import React, { PureComponent } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Card, Row, Col, DatePicker, Button } from "antd";
import SdlTable from '@/components/SdlTable'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SelectPollutantType from '@/components/SelectPollutantType';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import moment from 'moment';
import { connect } from 'dva';

const FormItem = Form.Item;

const columns = [
  {
    title: '监测点名称',
    dataIndex: 'PointName',
    key: 'PointName',
    width: 180,
    // fixed: 'left',
  },
  {
    title: '监测时间',
    dataIndex: 'MonitorTime',
    key: 'MonitorTime',
    width: 90,
    // fixed: 'left',
  },
  {
    title: '污染物浓度及空气质量分指数（IAQI）',
    children: [
      {
        title: '二氧化硫（SO₂ ）24小时平均',
        width: 200,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '03',
            key: '03',
            width: 115,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '03_IAQI',
            key: '03_IAQI',
            width: 105,
          },
        ]
      },
      {
        title: '二氧化硫（NO₂ ）24小时平均',
        width: 200,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '05',
            key: '05',
            width: 110,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '05_IAQI',
            key: '05_IAQI',
            width: 90,
          },
        ]
      },
      {
        title: '颗粒物（粒径小于等于10μm）24小时平均',
        width: 250,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '07',
            key: '07',
            width: 140,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '07_IAQI',
            key: '07_IAQI',
            width: 110,
          },
        ]
      },
      {
        title: '一氧化氮（CO）24小时平均',
        width: 200,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '02',
            key: '02',
            width: 110,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '02_IAQI',
            key: '02_IAQI',
            width: 90,
          },
        ]
      },
      {
        title: '臭氧（O₃）24小时平均',
        width: 200,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '01',
            key: '01',
            width: 110,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '01_IAQI',
            key: '01_IAQI',
            width: 90,
          },
        ]
      },
      {
        title: '颗粒物（粒径小于等于2.5μm）24小时平均',
        width: 250,
        children: [
          {
            title: '浓度（μg/m³）',
            dataIndex: '08',
            key: '08',
            width: 140,
          },
          {
            title: 'IAQI分指数',
            dataIndex: '08_IAQI',
            key: '08_IAQI',
            width: 110,
          },
        ]
      },
    ]
  },
  {
    title: '空气质量指数（AQI）',
    // title: <>空气质量指数 <br />（AQI）</>,
    dataIndex: 'AQI',
    key: 'AQI',
    width: 70,
  },
  {
    title: '首要污染物',
    dataIndex: 'PrimaryPollutant',
    key: 'PrimaryPollutant',
    width: 70,
  },
  {
    title: '空气质量指数级别',
    dataIndex: 'AirLevel',
    key: 'AirLevel',
    width: 70,
  },
  {
    title: '空气质量指数类别',
    width: 140,
    children: [
      {
        title: '颜色',
        dataIndex: 'AirColorCN',
        key: 'AirColorCN',
        width: 60,
        render: (text, record) => {
          return <span style={{ color: record.AirColor }}>{text}</span>
        }
      },
      {
        title: '等级',
        dataIndex: 'AirQuality',
        key: 'AirQuality',
        width: 80,
      },
    ],
  },
];


@connect(({ loading, dataAnalyze }) => ({
  reportTableData: dataAnalyze.reportTableData,
  searchLoading: loading.effects["dataAnalyze/getGasReport"],
  exportLoading: loading.effects["dataAnalyze/exportGasReport"]
}))
@Form.create()
class Report extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beginTime:moment().add(-1, "day").format('YYYY-MM-DD 00:00:00'),
      endTime:moment().add(-1, "day").format('YYYY-MM-DD 23:59:59'),
      time: moment().add(-1, "day"),
      defalutPollutantType: props.match.params.type * 1
    };
    this.SELF = {
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
    }
  }

  componentDidMount() {
    this.queryReportData()
  }

  queryReportData = () => {
    const {beginTime,endTime}=this.state;
    this.props.dispatch({
      type: 'dataAnalyze/getGasReport',
      payload: {
        beginTime:beginTime,
        endTime:endTime,
        Time: moment(this.props.form.getFieldValue("ReportTime")).format('YYYY-MM-DD 00:00:00'),
        PollutantType: this.state.defalutPollutantType
      }
    })
  }

  export = () => {
    const {beginTime,endTime}=this.state;
    this.props.dispatch({
      type: 'dataAnalyze/exportGasReport',
      payload: {
        beginTime:beginTime,
        endTime:endTime,
        Time: moment(this.props.form.getFieldValue("ReportTime")).format('YYYY-MM-DD 00:00:00'),
        PollutantType: this.state.defalutPollutantType
      }
    })
  }

  dateOnchange=(dates,beginTime,endTime)=>{
      const {form:{setFieldsValue}}=this.props;
      setFieldsValue({"ReportTime":dates});
      this.setState({
        beginTime,
        endTime
      })
  }

  render() {
    const { form: { getFieldDecorator }, reportTableData, searchLoading, exportLoading } = this.props;
    const { formLayout } = this.SELF;
    const { defalutPollutantType, time } = this.state;

    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="" className='searchForm' style={{ marginBottom: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xl={6} sm={24} md={12}>
                <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                  {getFieldDecorator("PollutantSourceType", {
                    // initialValue: defaultSearchForm.PollutantSourceType,
                    initialValue: defalutPollutantType,
                    rules: [{
                      required: true,
                      message: '请选择污染物类型',
                    }],
                  })(
                    <SelectPollutantType disabled placeholder="请选择污染物类型" />
                  )}
                </FormItem>
              </Col>
              <Col xl={8} sm={24} md={12}>
                <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                  {getFieldDecorator("ReportTime", {
                    initialValue: time,
                    rules: [{
                      required: true,
                      message: '请填写统计时间',
                    }],
                  })(
                    <DatePickerTool  allowClear={false} style={{ width: "100%" }} callback={
                      this.dateOnchange
                    } />
                  )}
                </FormItem>
              </Col>
              <Col xl={10} md={12}>
                <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                  <Button type="primary" loading={searchLoading} style={{ marginRight: 10 }} onClick={this.queryReportData}>生成统计</Button>
                  <Button onClick={this.export} loading={exportLoading} style={{ marginRight: 10 }}><ExportOutlined />导出</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <SdlTable
            columns={columns}
            dataSource={reportTableData}
            loading={searchLoading}
            scroll={{ x: '2000px' }}
            pagination={{
              pageSize: 20
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default Report;
