import React, { PureComponent } from 'react'
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Row,
  Select,
  Tabs,
  Button,
  message,
  DatePicker,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import IndustryTree from '@/components/IndustryTree'
import RegionList from '@/components/RegionList'
import SelectPollutantType from '@/components/SelectPollutantType';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;


const ImportantTypeList = [
  { text: "污染处理厂", value: "1" },
  { text: "水重点", value: "2" },
  { text: "气重点", value: "3" },
  { text: "垃圾焚烧", value: "4" },
]

@connect(({ loading, autoForm, emissionsStatistics, common }) => ({
  regionList: autoForm.regionList,
  industryTreeList: common.industryTreeList,
  pollutantCodeList: common.pollutantCode,
  attentionList: emissionsStatistics.attentionList,
  regionContrastTableDataSource: emissionsStatistics.regionContrastTableDataSource,
  entContrastTableDataSource: emissionsStatistics.entContrastTableDataSource,
  pointContrastTableDataSource: emissionsStatistics.pointContrastTableDataSource,
  regionContrastExportLoading: emissionsStatistics.regionContrastExportLoading,
  entContrastExportLoading: emissionsStatistics.entContrastExportLoading,
  pointContrastExportLoading: emissionsStatistics.pointContrastExportLoading,
  regionContrastLoading: emissionsStatistics.regionContrastLoading,
  entContrastLoading: emissionsStatistics.entContrastLoading,
  pointExportLoading: emissionsStatistics.pointExportLoading,
}))
@Form.create()
class Contrast extends PureComponent {
  state = {
    DataType: "region",
  }
  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
  }

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'emissionsStatistics/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    // this.getTableData("region");
    // this.getTableData("ent");
    // this.getTableData("point");
  }

  // 根据污染物类型获取污染物
  getAllPollutantCode = () => {
    let values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'common/getAllPollutantCode',
      payload: {
        pollutantTypes: values.PollutantType,
        dataType: 'dis'
      }
    })
  }

  // 获取table数据
  getTableData = (DataType) => {
    let values = this.props.form.getFieldsValue();
    // if (values.time2 && values.time1) {
    //   if (values.time2[0] <= values.time1[1]) {
    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
    //     return;
    //   }
    // } else {
    //   message.error("请将时间填写完整");
    //   return;
    // }
    console.log("values=", values)
    this.props.dispatch({
      type: "emissionsStatistics/getContrastTableDataByType",
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode: values.TradeCode && values.TradeCode.length ? values.TradeCode[values.TradeCode.length - 1] : undefined,
        RegionCode: values.RegionCode,
        ImportantType: values.ImportantType,
        PollutantType: values.PollutantType,
        beginTime: moment(values.time1[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(values.time1[1]).format('YYYY-MM-DD HH:mm:ss'),
        ComparisonbeginTime: moment(values.time2[0]).format('YYYY-MM-DD HH:mm:ss'),
        ComparisonendTime: moment(values.time2[1]).format('YYYY-MM-DD HH:mm:ss'),
        DataType: DataType,
      }
    })
  }

  // 导出
  onExport = () => {
    let values = this.props.form.getFieldsValue();
    // if (values.time2 && values.time1) {
    //   if (values.time2[0] <= values.time1[1]) {
    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
    //     return;
    //   }
    // } else {
    //   message.error("请将时间填写完整");
    //   return;
    // }
    this.props.dispatch({
      type: "emissionsStatistics/exportContrastTableDataByType",
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode: values.TradeCode && values.TradeCode.length ? values.TradeCode[values.TradeCode.length - 1] : undefined,
        RegionCode: values.RegionCode,
        ImportantType: values.ImportantType,
        PollutantType: values.PollutantType,
        beginTime: moment(values.time1[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time1[1]).format('YYYY-MM-DD 00:00:00'),
        ComparisonbeginTime: moment(values.time2[0]).format('YYYY-MM-DD 00:00:00'),
        ComparisonendTime: moment(values.time2[1]).format('YYYY-MM-DD 00:00:00'),
        DataType: this.state.DataType,
      }
    })
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, pollutantCodeList, regionContrastLoading, entContrastLoading, pointExportLoading, regionContrastExportLoading, entContrastExportLoading, pointContrastExportLoading, regionList, attentionList, regionContrastTableDataSource, entContrastTableDataSource, pointContrastTableDataSource } = this.props;
    const { DataType } = this.state;
    let loading = regionContrastLoading || entContrastLoading || pointExportLoading;
    let exportLoading = regionContrastExportLoading || entContrastExportLoading || pointContrastExportLoading;
    let _regionList = regionList.length ? regionList[0].children : [];
    const _style = {
      width: 60,
      textAlign: 'right',
      display: 'inline-block',
    }
    let beginTime, endTime, beginTime2, endTime2;
    let formTime1 = getFieldValue("time1");
    let formTime2 = getFieldValue("time2");
    if (formTime1) {
      beginTime = formTime1[0].format("YYYY年MM月DD日")
      endTime = formTime1[1].format("YYYY年MM月DD日")
    }
    if (formTime2) {
      beginTime2 = formTime2[0].format("YYYY年MM月DD日")
      endTime2 = formTime2[1].format("YYYY年MM月DD日")
    }

    let PFLCColumns = [];
    let PFL = pollutantCodeList.map(item => {
      PFLCColumns.push({
        title: item.name,
        dataIndex: item.field + '-EmissionsValueC',
        key: item.field + '-EmissionsValueC',
        width: 180,
        align: 'center',
      })
      return {
        title: item.name,
        dataIndex: item.field + '-EmissionsValue',
        key: item.field + '-EmissionsValue',
        width: 180,
        align: 'center',
      }
    })

    let RegionColumns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 120,
      },
      {
        title: '企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 100,
      },
      {
        title: '监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        width: 100,
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        children: [
          {
            title: '生产企业数',
            dataIndex: 'ProductionCountEnt',
            key: 'ProductionCountEnt',
            width: 100,
            align: 'center',
          },
          {
            title: '生产监控点数',
            dataIndex: 'ProductionCountPoint',
            key: 'ProductionCountPoint',
            width: 100,
            align: 'center',
          },
          {
            title: '排放量（kg）',
            children: [
              ...PFL
            ]
          },
        ]
      },
      {
        title: `时间（${beginTime2}至${endTime2}）`,
        children: [
          {
            title: '生产企业数',
            dataIndex: 'ProductionCountEntC',
            key: 'ProductionCountEntC',
            width: 100,
            align: 'center',
          },
          {
            title: '生产监控点数',
            dataIndex: 'ProductionCountPointC',
            key: 'ProductionCountPointC',
            width: 100,
            align: 'center',
          },
          {
            title: '排放量（kg）',
            children: [
              ...PFLCColumns
            ]
          },
        ]
      },
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 120,
        align: 'center',
      },
    ];
    let EntColumns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 120,
      },
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '关注程度',
        dataIndex: 'AttentionName',
        key: 'AttentionName',
        width: 120,
      },
      {
        title: '重点类别',
        dataIndex: 'ImportantType',
        key: 'ImportantType',
        width: 120,
        render: (text, record) => {
          if (text && text !== "0") {
            // return ImportantTypeList.find(item => item.value == text)["text"]
            const ImportantTypeLists =
            {
              "1": "污染处理厂",
              '2': "水重点",
              '3': "气重点",
              '4': "垃圾焚烧"
            }
            let importVal = ''
            let dataArr = text.split(',')
            dataArr.map(item => {
              ImportantTypeList.map(items => {
                if (item == items.value) {
                  importVal += `${ImportantTypeLists[item]}，`
                }
              })
            })
            let _text = importVal.substring(0, importVal.length - 1);
            return _text || '-'

          } else {
            return "-"
          }
        },
        // render: (text, record) => {
        //   if (text && text != "0") {
        //     return ImportantTypeList.find(item => item.value == text)["text"]
        //   }
        //   return "-"
        // }
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        width: 180,
        render: (text, record) => {
          return text ? text : "-"
        }
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        children: [
          {
            title: '排放量（kg）',
            children: [
              ...PFL
            ]
          },
        ]
      },
      {
        title: `时间（${beginTime2}至${endTime2}）`,
        children: [
          {
            title: '排放量（kg）',
            children: [
              ...PFLCColumns
            ]
          },
        ]
      },
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 120,
        align: 'center',
      },
    ]
    let PointColumns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 120,
        // width: 150,
      },
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '关注程度',
        dataIndex: 'AttentionName',
        key: 'AttentionName',
        width: 120,
      },
      {
        title: '重点类别',
        dataIndex: 'ImportantType',
        key: 'ImportantType',
        width: 120,
        render: (text, record) => {
          if (text && text !== "0") {
            // return ImportantTypeList.find(item => item.value == text)["text"]
            const ImportantTypeLists =
            {
              "1": "污染处理厂",
              '2': "水重点",
              '3': "气重点",
              '4': "垃圾焚烧"
            }
            let importVal = ''
            let dataArr = text.split(',')
            dataArr.map(item => {
              ImportantTypeList.map(items => {
                if (item == items.value) {
                  importVal += `${ImportantTypeLists[item]}，`
                }
              })
            })
            let _text = importVal.substring(0, importVal.length - 1);
            return _text || '-'

          } else {
            return "-"
          }
        },
        // render: (text, record) => {
        //   if (text && text != "0") {
        //     return ImportantTypeList.find(item => item.value == text)["text"]
        //   }
        //   return "-"
        // }
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        width: 180,
        render: (text, record) => {
          return text ? text : "-"
        }
        // width: 200,
      },
      {
        title: '监测点',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 180,
      },
      {
        title: '是否参与企业排放量计算',
        dataIndex: 'IsStatisti',
        key: 'IsStatisti',
        width: 80,
        render: (text, record) => {
          if (text !== undefined) {
            return text == 0 ? "否" : "是"
          }
          return "-"
        }
        // width: 200,
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        children: [
          {
            title: '生产天数',
            dataIndex: 'CountDay',
            key: 'CountDay',
            width: 80,
            align: 'center',
          },
          {
            title: '排放量（kg）',
            children: [
              ...PFL
            ]
          },
        ]
      },
      {
        title: `时间（${beginTime2}至${endTime2}）`,
        children: [
          {
            title: '生产天数',
            dataIndex: 'CountDayC',
            key: 'CountDayC',
            width: 80,
            align: 'center',
          },
          {
            title: '排放量（kg）',
            children: [
              ...PFLCColumns
            ]
          },
        ]
      },
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 180,
        align: 'center',
      },
    ]
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 10 }}>
            <Row>
              <FormItem label={<span style={{ ..._style }}>时间段1</span>}>
                {getFieldDecorator('time1', {
                  initialValue: [moment().subtract(14, 'days'), moment().subtract(7, 'days')]
                })(
                  <RangePicker />
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>时间段2</span>}>
                {getFieldDecorator('time2', {
                  initialValue: [moment().subtract(6, 'days'), moment().subtract(1, 'days')]
                })(
                  <RangePicker />
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style, width: 74 }}>污染物类型</span>}>
                {getFieldDecorator('PollutantType', {
                })(
                  <SelectPollutantType
                    style={{ width: 160 }}
                    showDefaultValue
                    placeholder="请选择污染物类型"
                    initCallback={(value) => {
                      this.props.form.setFieldsValue({ 'PollutantType': value })
                      this.getAllPollutantCode();
                      this.getTableData("region");
                      this.getTableData("ent");
                      this.getTableData("point");
                    }}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label={<span style={{ ..._style }}>关注程度</span>}>
                {getFieldDecorator('AttentionCode', {
                  initialValue: undefined,
                })(
                  <Select allowClear style={{ width: 140 }} placeholder="请选择关注程度">
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
              <FormItem label={<span style={{ ..._style }}>重点类型</span>}>
                {getFieldDecorator('ImportantType', {
                })(
                  <Select allowClear style={{ width: 140 }} placeholder="请选择重点类型">
                    {
                      ImportantTypeList.map(item => {
                        return <Option value={item.value} key={item.value}>{item.text}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>行政区</span>}>
                {getFieldDecorator('RegionCode', {
                })(
                  <RegionList RegionCode={this.props.form.getFieldValue('RegionCode')} />
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>行业</span>}>
                {getFieldDecorator('TradeCode', {
                  initialValue: undefined,
                })(
                  <IndustryTree
                    style={{ width: 200 }}
                    textField={"dbo.T_Cod_IndustryType.IndustryTypeName"}
                    valueField={"dbo.T_Cod_IndustryType.IndustryTypeCode"}
                    configId={"IndustryType"}
                  />
                )}
              </FormItem>
              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={() => {
                  let values = this.props.form.getFieldsValue();
                  if (values.time2.length && values.time1.length) {
                    if (values.time2[0] <= values.time1[1]) {
                      message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
                      return;
                    }
                  } else {
                    message.error("请将时间填写完整");
                    return;
                  }
                  this.getTableData("region");
                  this.getTableData("ent");
                  this.getTableData("point");
                }}>
                  查询
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={() => {
                    let values = this.props.form.getFieldsValue();
                    if (values.time2.length && values.time1.length) {
                      if (values.time2[0] <= values.time1[1]) {
                        message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
                        return;
                      }
                    } else {
                      message.error("请将时间填写完整");
                      return;
                    }
                    this.onExport()
                  }}
                >
                  导出
                </Button>
              </div>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <span style={{ color: "red" }}>采用日监测数据计算排放量，公式：日均浓度 × 流量。</span>
            </Row>
          </Form>
          {/* <Divider /> */}
          <Tabs defaultActiveKey="region" onChange={(key) => this.setState({ DataType: key })}>
            <TabPane tab="辖区排放量" key="region">
              <SdlTable loading={regionContrastLoading} pagination={false} align="center" dataSource={regionContrastTableDataSource} columns={RegionColumns} />
            </TabPane>
            <TabPane tab="企业排放量" key="ent">
              <SdlTable loading={entContrastLoading} pagination={false} align="center" dataSource={entContrastTableDataSource} columns={EntColumns} />
            </TabPane>
            <TabPane tab="监测点排放量" key="point">
              <SdlTable loading={pointExportLoading} pagination={false} align="center" dataSource={pointContrastTableDataSource} columns={PointColumns} />
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default Contrast;