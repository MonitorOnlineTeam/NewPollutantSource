import React, { PureComponent } from 'react'
import { Card, Tabs, Spin, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag, Tooltip } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"

const columns = [
  {
    title: '时间',
    dataIndex: 'MonitorTime',
    width: 160,
  },
  {
    title: '企业',
    dataIndex: 'EntName',
    width: 220,
  },
  {
    title: '排口',
    dataIndex: 'PointName',
    width: 200,
  },
  {
    // title: '外购电力二氧化碳排放量(t)',
    title: <>外购电力二氧化碳<br />排放量(t)</>,
    dataIndex: 'EValue',
    width: 140,
  },
  {
    title: '二氧化碳排放量(t)',
    dataIndex: 'DischargeAndE',
    width: 140,
  },
  {
    title: '供热比',
    dataIndex: 'AValue',
    width: 100,
  },
  {
    title: <>供热标准耗煤量<br />（t/GJ）</>,
    dataIndex: 'BGR',
    width: 140,
  },
  {
    title: <>供热部分二氧化碳<br />排放量(t)</>,
    dataIndex: 'GGR',
    width: 140,
  },
  {
    title: '单位供热二氧化碳排放（kg/MJ）',
    title: <>单位供热二氧化碳<br />排放量（kg/MJ）</>,
    dataIndex: 'DeptGGR',
    width: 140,
  },
  {
    title: '发电标准耗煤量（t）',
    dataIndex: 'BFD',
    width: 150,
  },
  {
    title: <>发电部份二氧化碳<br />排放量（t）</>,
    dataIndex: 'GFD',
    width: 140,

  },
  {
    title: '单位发电二氧化碳排放[kg/(kWh)]',
    dataIndex: 'DeptGFD',
    width: 150,
  },
]

@connect(({ CO2Report, common, loading }) => ({
  entByRegionAndAttList: CO2Report.entByRegionAndAttList,
  pointListByEntCode: common.pointListByEntCode,
  dayReportTableData: CO2Report.dayReportTableData,
  loading: loading.effects['CO2Report/getDayReportTableData'],
}))
class DayReportPage extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    // 获取企业列表
    this.props.dispatch({
      type: "CO2Report/getEntByRegionAndAtt",
      payload: { RegionCode: '', Attention: '', PollutantTypeCode: '2' },
    })
  }

  // 根据企业获取排口
  getPointByEntCode = (EntCode) => {
    this.props.dispatch({
      type: 'common/getPointByEntCode',
      payload: { EntCode, PollutantTypeCode: '2' }
    });
  }

  getTableDataSource = () => {
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "CO2Report/getDayReportTableData",
      payload: {
        DGIMN: fieldsValue.DGIMN,
        EndTime: moment(fieldsValue.time).format('YYYY-MM-DD 23:59:59'),
        BeginTime: moment(fieldsValue.time).format('YYYY-MM-DD 00:00:00'),
      }
    })
  }


  render() {
    const { entByRegionAndAttList, pointListByEntCode, dayReportTableData, loading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="global_state"
            ref={this.formRef}
            initialValues={{
              time: moment()
            }}
          >
            <Row gutter={[24, 0]}>
              <Col>
                <Form.Item
                  name="time"
                  label="时间"
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="EntCode"
                  label="企业列表"
                >
                  <Select
                    style={{ width: '200px' }}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择企业列表" onChange={(val) => {
                      this.getPointByEntCode(val)
                    }}
                  >
                    {
                      entByRegionAndAttList.map(item => {
                        return <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                          {item.EntName}
                        </Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="DGIMN"
                  label="监测点列表"
                >
                  <Select
                    style={{ width: '200px' }}

                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择监测点列表"
                  >
                    {
                      pointListByEntCode.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN}>
                          {item.PointName}
                        </Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Space align="baseline">
                <Button loading={loading} type="primary" onClick={this.getTableDataSource}>查询</Button>
              </Space>
            </Row>
          </Form>
          <SdlTable
            loading={loading}
            columns={columns}
            dataSource={dayReportTableData}
          />
        </Card>
      </BreadcrumbWrapper >
    );
  }
}

export default DayReportPage;