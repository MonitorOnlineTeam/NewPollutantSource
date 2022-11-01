import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  Checkbox,
  DatePicker,
  Button,
  message,
  Modal,
} from 'antd';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import IndustryTree from '@/components/IndustryTree'
import RegionList from '@/components/RegionList'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, chaoStatistics, common }) => ({
  regionList: autoForm.regionList,
  entList: common.priseList,
  pointListByEntCode: common.pointListByEntCode,
  tableDataSource: chaoStatistics.tableDataSource,
  loading: loading.effects["chaoStatistics/getTableDataSource"],
  exportLoading: loading.effects["chaoStatistics/exportData"],
  attentionList: chaoStatistics.attentionList,
}))
@Form.create()
class index extends PureComponent {
  state = {
    columns: [],
    pollutantType: "1",
    queryCondition: {},
    unit: "mg/L",
    rangeTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")],
  }

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'chaoStatistics/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });
    this.getEntByRegionList("");
    this.getTableList();
  }

  // 根据行政区获取企业列表
  getEntByRegionList = (RegionCode) => {
    this.props.dispatch({
      type: 'common/getEntByRegion',
      payload: { RegionCode }
    });
  }

  // 根据企业获取排口
  getPointByEntCode = (EntCode) => {
    this.props.dispatch({
      type: 'common/getPointByEntCode',
      payload: { EntCode, PollutantTypeCode: this.props.form.getFieldValue("PollutantType") }
    });
  }

  onExport = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarmListForEnt",
      payload: {
        ...this.state.secondQueryCondition,
      }
    })
  }

  // 获取异常数据
  getTableList = () => {
    let values = this.props.form.getFieldsValue();
    let rangeTime = this.state.rangeTime;
    // console.log("values=", values)
    // let beginTime, endTime;
    // values.time = this.props.exceptionTime;
    // if (values.time && values.time[0]) {
    //   beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    // }
    // if (values.time && values.time[1]) {
    //   endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    // }

    this.props.dispatch({
      type: "chaoStatistics/getTableDataSource",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        DataType: values.dataType,
        EntCode: values.EntCode,
        DGIMN: values.DGIMN,
        beginTime: moment(rangeTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
    this.getColumns()
    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        DataType: values.dataType,
        EntCode: values.EntCode,
        DGIMN: values.DGIMN,
        beginTime: moment(rangeTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
  }

  // 导出数据
  onExportData = () => {
    let values = this.props.form.getFieldsValue();
    let rangeTime = this.state.rangeTime;
    this.props.dispatch({
      type: "chaoStatistics/exportData",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        DataType: values.dataType,
        EntCode: values.EntCode,
        DGIMN: values.DGIMN,
        beginTime: moment(rangeTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(rangeTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
  }


  onDataTypeChange = (value) => {
    this.rangePicker.onDataTypeChange(value)
  }

  dateChange = (date, dataType) => {
    this.setState({
      rangeTime: date
    })
  }

  getHourColumns = () => {
    return [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '行政区',
        dataIndex: 'regionName',
        key: 'regionName',
        width: 120,
      },
      {
        title: '企业名称',
        dataIndex: 'entName',
        key: 'entName',
        align: 'left'
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'left'
      },
      {
        title: '污染物',
        dataIndex: 'pollutantName',
        key: 'pollutantName',
      },
      {
        title: `排放标准（${this.state.unit}）`,
        dataIndex: 'standValue',
        key: 'standValue',
        // render: (text, record, index) => {
        //   return text ? (text * 1).toFixed(3) : text;
        // }
      },
      {
        title: `小时均值超标浓度范围（${this.state.unit}）`,
        dataIndex: 'overRange',
        key: 'overRange',
        width: 240,
      },
      {
        title: '超标倍数范围',
        dataIndex: 'multiple',
        key: 'multiple',
      },
      {
        title: '累计超标小时数（h）',
        dataIndex: 'overTime',
        key: 'overTime',
        width: 180,
      },
      {
        title: '实际上传小时数（h）',
        dataIndex: 'allTime',
        key: 'allTime',
        width: 180,
      },
      {
        title: '达标率',
        dataIndex: 'complianceRate',
        key: 'complianceRate',
        render: (text, record, index) => {
          if (text) {
            return text + "%"
          }
          return "-"
        }
      },
    ]
  }

  getDayColumns = () => {
    return [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '行政区',
        dataIndex: 'regionName',
        key: 'regionName',
        width: 120,
      },
      {
        title: '企业名称',
        dataIndex: 'entName',
        key: 'entName',
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
      },
      {
        title: '污染物',
        dataIndex: 'pollutantName',
        key: 'pollutantName',
      },
      {
        title: '超标时间范围',
        dataIndex: 'monitorTime',
        key: 'monitorTime',
        width: 240,
      },
      {
        title: `排放标准（${this.state.unit}）`,
        dataIndex: 'standValue',
        key: 'standValue',
      },
      {
        title: `日均超标浓度范围（${this.state.unit}）`,
        dataIndex: 'overRange',
        key: 'overRange',
        width: 240,
      },
      {
        title: '超标倍数范围',
        dataIndex: 'multiple',
        key: 'multiple',
      },
      {
        title: '累计超标天数（d）',
        dataIndex: 'overTime',
        key: 'overTime',
      },
      {
        title: '实际天数（d）',
        dataIndex: 'allTime',
        key: 'allTime',
      },
      {
        title: '达标率',
        dataIndex: 'complianceRate',
        key: 'complianceRate',
        render: (text, record, index) => {
          if (text) {
            return text + "%"
          }
          return "-"
        }
      },
    ]
  }

  getColumns = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    let dataType = getFieldValue("dataType");
    let columns = dataType === "HourData" ? this.getHourColumns() : this.getDayColumns();
    this.setState({
      columns: columns
    })
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, regionList, exportLoading, attentionList, entList, tableDataSource, loading, pointListByEntCode } = this.props;
    const { queryCondition, rangeTime, columns } = this.state;
    let _regionList = regionList.length ? regionList[0].children : [];
    const _style = {
      width: 60,
      textAlign: 'right',
      display: 'inline-block',
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
              <FormItem label={<span style={{ ..._style }}>行政区</span>}>
                {getFieldDecorator('RegionCode', {
                  // initialValue: 'siteDaily',
                })(
                  // <Select style={{ width: 120 }} allowClear placeholder="请选择行政区" onChange={(value) => {
                  //   this.getEntByRegionList(value)
                  // }}>
                  //   {
                  //     _regionList.map(item => {
                  //       return <Option key={item.key} value={item.value}>
                  //         {item.title}
                  //       </Option>
                  //     })
                  //   }
                  // </Select>
                  <RegionList
                    changeRegion={(value) => {
                      this.getEntByRegionList(value)
                    }}
                    RegionCode={this.props.form.getFieldValue('RegionCode')}
                  />
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>关注程度</span>}>
                {getFieldDecorator('AttentionCode', {
                  initialValue: undefined,
                })(
                  <Select allowClear style={{ width: 150 }} placeholder="请选择关注程度">
                    {
                      attentionList.map(item => {
                        return <Option key={item.AttentionCode} value={item.AttentionCode}>
                          {item.AttentionName}
                        </Option>
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>企业类型</span>}>
                {getFieldDecorator('PollutantType', {
                  initialValue: '1',
                })(
                  <Select style={{ width: 160 }} placeholder="请选择企业类型" onChange={(value) => {
                    this.setState({ pollutantType: value }, () => {
                    })
                  }}>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>企业列表</span>}>
                {getFieldDecorator('EntCode', {
                })(
                  <Select style={{ width: 200 }}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear placeholder="请选择企业列表"
                    onChange={(value) => {
                      this.getPointByEntCode(value)
                    }}
                  >
                    {
                      entList.map(item => {
                        return <Option key={item.EntCode} value={item.EntCode}>
                          {item.EntName}
                        </Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>

            </Row>
            <Row>
              <FormItem label={<span style={{ ..._style }}>超标时间</span>}>
                <RangePicker_ allowClear={false} onRef={(ref) => {
                  this.rangePicker = ref;
                }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "360px" }} dateValue={rangeTime}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>数据类型</span>}>
                {getFieldDecorator('dataType', {
                  initialValue: 'HourData',
                })(
                  <Select
                    style={{ width: 160 }}
                    placeholder="请选择数据类型"
                    // allowClear
                    onChange={this.onDataTypeChange}
                  >
                    <Option key='0' value='HourData'>小时数据</Option>
                    <Option key='1' value='DayData'> 日数据</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>监测点</span>}>
                {getFieldDecorator('DGIMN', {
                })(
                  <Select style={{ width: 200 }} allowClear placeholder="请选择监测点">
                    {
                      pointListByEntCode.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN}>
                          {item.PointName}
                        </Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={() => {
                  this.setState({
                    unit: getFieldValue("PollutantType") === "1" ? "mg/L" : "mg/m³"
                  }, () => {
                    this.getTableList()
                  })
                }}>
                  查询
                      </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={this.onExportData}
                >
                  导出
                      </Button>
              </div>
            </Row>
            <Row>
              {
                getFieldValue("PollutantType") === "1" ?
                  '' :
                  <span style={{ color: "red" }}>废气折算采用折算值，非折算采用实测值；排除停运期间的数据。</span>
              }
            </Row>
          </Form>
          <SdlTable align="center" dataSource={tableDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper >
    );
  }
}

export default index;
