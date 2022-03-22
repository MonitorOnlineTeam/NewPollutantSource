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
  regionChainTableDataSource: emissionsStatistics.regionChainTableDataSource,
  entChainTableDataSource: emissionsStatistics.entChainTableDataSource,
  pointChainTableDataSource: emissionsStatistics.pointChainTableDataSource,
  regionChainExportLoading: emissionsStatistics.regionChainExportLoading,
  entChainExportLoading: emissionsStatistics.entChainExportLoading,
  pointChainExportLoading: emissionsStatistics.pointChainExportLoading,
  regionChainLoading: emissionsStatistics.regionChainLoading,
  entChainLoading: emissionsStatistics.entChainLoading,
  pointChainLoading: emissionsStatistics.pointChainLoading,
}))
@Form.create()
class Chain extends PureComponent {
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
      type: "emissionsStatistics/getEmissionsListForChain",
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode: values.TradeCode && values.TradeCode.length ? values.TradeCode[values.TradeCode.length - 1] : undefined,
        RegionCode: values.RegionCode,
        ImportantType: values.ImportantType,
        PollutantType: values.PollutantType,
        beginTime: moment(values.time1).format('YYYY-MM-01 00:00:00'),
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
        beginTime: moment(values.time1).format('YYYY-MM-01 00:00:00'),
        DataType: this.state.DataType,
      }
    })
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, pollutantCodeList, regionChainLoading, entChainLoading, pointChainLoading, regionChainExportLoading, entChainExportLoading, pointChainExportLoading, regionList, attentionList, regionChainTableDataSource, entChainTableDataSource, pointChainTableDataSource } = this.props;
    const { DataType } = this.state;
    let loading = regionChainLoading || entChainLoading || pointChainLoading;
    let exportLoading = regionChainExportLoading || entChainExportLoading || pointChainExportLoading;
    let _regionList = regionList.length ? regionList[0].children : [];
    const _style = {
      width: 60,
      textAlign: 'right',
      display: 'inline-block',
    }
    let PFL = pollutantCodeList.map(item => {
      return {
        title: item.name,
        children: [
          {
            title: '排放量(kg)',
            dataIndex: item.field + '-EmissionsValue',
            key: item.field + '-EmissionsValue',
            width: 180,
            align: 'center',
          },
          {
            title: '同期排放量(kg)',
            dataIndex: item.field + '-EmissionsValue2',
            key: item.field + '-EmissionsValue2',
            width: 180,
            align: 'center',
          },
          {
            title: '环比',
            dataIndex: item.field + '-EmissionsValueChain',
            key: item.field + '-EmissionsValueChain',
            width: 120,
            align: 'center',
          },
        ]
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
      ...PFL,
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
        width: 180,
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
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        width: 180,
        render: (text, record) => {
          return text ? text : "-"
        }
      },
      ...PFL,
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
        width: 180,
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
      ...PFL,
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
              <FormItem label={<span style={{ ..._style }}>时间</span>}>
                {getFieldDecorator('time1', {
                  initialValue: moment()
                })(
                  <DatePicker picker="month" />
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
                  // let values = this.props.form.getFieldsValue();
                  // if (values.time2.length && values.time1.length) {
                  //   if (values.time2[0] <= values.time1[1]) {
                  //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
                  //     return;
                  //   }
                  // } else {
                  //   message.error("请将时间填写完整");
                  //   return;
                  // }
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
          </Form>
          {/* <Divider /> */}
          <Tabs defaultActiveKey="region" onChange={(key) => this.setState({ DataType: key })}>
            <TabPane tab="辖区排放量" key="region">
              <SdlTable loading={regionChainLoading} pagination={false} align="center" dataSource={regionChainTableDataSource} columns={RegionColumns} />
            </TabPane>
            <TabPane tab="企业排放量" key="ent">
              <SdlTable loading={entChainLoading} pagination={false} align="center" dataSource={entChainTableDataSource} columns={EntColumns} />
            </TabPane>
            <TabPane tab="监测点排放量" key="point">
              <SdlTable loading={pointChainLoading} pagination={false} align="center" dataSource={pointChainTableDataSource} columns={PointColumns} />
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default Chain;