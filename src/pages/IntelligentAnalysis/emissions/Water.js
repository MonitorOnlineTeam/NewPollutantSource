import React, { PureComponent } from 'react'
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, Tabs, Button, message, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import IndustryTree from '@/components/IndustryTree'
import RegionList from '@/components/RegionList'


const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

// <Option value="1">污染处理厂</Option>
//           <Option value="2">水重点</Option>
//           <Option value="3">气重点</Option>
//           <Option value="4">垃圾焚烧</Option>
const ImportantTypeList = [
  { text: "污染处理厂", value: "1" },
  { text: "水重点", value: "2" },
  { text: "气重点", value: "3" },
  { text: "垃圾焚烧", value: "4" },
]

@connect(({ loading, autoForm, emissionsStatistics, common }) => ({
  regionList: autoForm.regionList,
  industryTreeList: common.industryTreeList,
  attentionList: emissionsStatistics.attentionList,
  regionTableDataSource: emissionsStatistics.regionTableDataSource,
  entTableDataSource: emissionsStatistics.entTableDataSource,
  pointTableDataSource: emissionsStatistics.pointTableDataSource,
  regionLoading: emissionsStatistics.regionLoading,
  entLoading: emissionsStatistics.entLoading,
  pointLoading: emissionsStatistics.pointLoading,
  regionExportLoading: emissionsStatistics.regionExportLoading,
  entExportLoading: emissionsStatistics.entExportLoading,
  pointExportLoading: emissionsStatistics.pointExportLoading,
}))
@Form.create()
class Water extends PureComponent {
  state = {
    time: [moment().subtract(1, 'days').startOf("day"), moment().subtract(1, 'days').endOf("day")],
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
    // this.props.dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2', }
    // });

    // 获取关注列表
    this.props.dispatch({
      type: 'emissionsStatistics/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    this.getTableData("region");
    this.getTableData("ent");
    this.getTableData("point");
  }

  // 获取table数据
  getTableData = (DataType) => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    console.log("values-time=", this.state.time)
    this.props.dispatch({
      type: "emissionsStatistics/getTableDataByType",
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode: values.TradeCode && values.TradeCode.length ? values.TradeCode[values.TradeCode.length - 1] : undefined,
        RegionCode: values.RegionCode? values.RegionCode : '',
        ImportantType: values.ImportantType,
        PollutantType: 1,
        beginTime: moment(this.state.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.state.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        // DataType: this.state.DataType,
        DataType: DataType,
      }
    })
  }

  // 导出
  onExport = () => {
    let values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: "emissionsStatistics/exportTableDataByType",
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode: values.TradeCode && values.TradeCode.length ? values.TradeCode[values.TradeCode.length - 1] : undefined,
        RegionCode:values.RegionCode? values.RegionCode : '',
        ImportantType: values.ImportantType,
        PollutantType: 1,
        beginTime: moment(this.state.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.state.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        DataType: this.state.DataType,
      }
    })
  }

  dateChange = (date, dataType) => {
    this.setState({
      time: date
    })
  }

  getColumns = () => {

  }

  render() {
    const { form: { getFieldDecorator }, regionExportLoading, entExportLoading, pointExportLoading, regionLoading, entLoading, pointLoading, regionList, attentionList, regionTableDataSource, entTableDataSource, pointTableDataSource } = this.props;
    let loading = regionLoading || entLoading || pointLoading;
    let exportLoading = regionExportLoading || entExportLoading || pointExportLoading;
    // const { columns, RegionColumns, EntColumns } = this._SELF_;
    const { time } = this.state;
    let _regionList = regionList.length ? regionList[0].children : [];
    const _style = {
      width: 60,
      textAlign: 'right',
      display: 'inline-block',
    }
    let beginTime = time[0].format("YYYY年MM月DD日")
    let endTime = time[1].format("YYYY年MM月DD日")
    let RegionColumns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 150,
      },
      {
        title: '企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 150,
      },
      {
        title: '监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        width: 150,
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        children: [
          {
            title: '生产企业数',
            dataIndex: 'ProductionCountEnt',
            key: 'ProductionCountEnt',
            width: 150,
            align: 'center',
          },
          {
            title: '生产监控点数',
            dataIndex: 'ProductionCountPoint',
            key: 'ProductionCountPoint',
            width: 150,
            align: 'center',
          },
          {
            title: '排放量（kg）',
            children: [
              {
                title: 'COD',
                dataIndex: 'CODEmissionsValue',
                key: 'CODEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '氨氮',
                dataIndex: 'AndanEmissionsValue',
                key: 'AndanEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总磷',
                dataIndex: 'ZonglinEmissionsValue',
                key: 'ZonglinEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总氮',
                dataIndex: 'ZongdanEmissionsValue',
                key: 'ZongdanEmissionsValue',
                width: 140,
                align: 'center',
              },
            ]
          },
          {
            title: '流量（吨）',
            dataIndex: 'FlowValue',
            key: 'FlowValue',
            width: 140,
            align: 'center',
          },
        ]
      },

    ];
    let EntColumns = [
      {
        title: '序号',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        // width: 150,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'left',
        // width: 200,
      },
      {
        title: '关注程度',
        dataIndex: 'AttentionName',
        key: 'AttentionName',
        // width: 150,
      },
      {
        title: '重点类别',
        dataIndex: 'ImportantType',
        key: 'ImportantType',
        render: (text, record) => {
          if (text && text !== "0") {
            // return ImportantTypeList.find(item => item.value == text)["text"]
            const ImportantTypeLists = 
              { "1": "污染处理厂",
                '2': "水重点",
                '3': "气重点",
                '4': "垃圾焚烧"
              }
            let importVal = ''
            let dataArr = text.split(',')
            dataArr.map(item=>{
              ImportantTypeList.map(items=>{
                 if(item == items.value){
                  importVal += `${ImportantTypeLists[item]}，`
                 }
              })
            })
           
            return importVal.substring(0,importVal.length-1)
            
          }else{
            return "-"
          }
        },
        width: 150,
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        render: (text, record) => {
          return text ? text : "-"
        }
        // width: 200,
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        children: [
          {
            title: '排放量（kg）',
            children: [
              {
                title: 'COD',
                dataIndex: 'CODEmissionsValue',
                key: 'CODEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '氨氮',
                dataIndex: 'AndanEmissionsValue',
                key: 'AndanEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总磷',
                dataIndex: 'ZonglinEmissionsValue',
                key: 'ZonglinEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总氮',
                dataIndex: 'ZongdanEmissionsValue',
                key: 'ZongdanEmissionsValue',
                width: 140,
                align: 'center',
              },
            ]
          },
          {
            title: '流量（吨）',
            dataIndex: 'FlowValue',
            key: 'FlowValue',
            align: 'center',
            width: 140,
          },
        ]
      },
    ]
    let PointColumns = [
      {
        title: '序号',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 150,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 220,
        align: 'left',
      },
      {
        title: '关注程度',
        dataIndex: 'AttentionName',
        key: 'AttentionName',
        width: 140,
      },
      {
        title: '重点类别',
        dataIndex: 'ImportantType',
        key: 'ImportantType',
        render: (text, record) => {
          if (text && text !== "0") {
            // return ImportantTypeList.find(item => item.value == text)["text"]
            const ImportantTypeLists = 
              { "1": "污染处理厂",
                '2': "水重点",
                '3': "气重点",
                '4': "垃圾焚烧"
              }
            let importVal = ''
            let dataArr = text.split(',')
            dataArr.map(item=>{
              ImportantTypeList.map(items=>{
                 if(item == items.value){
                  importVal += `${ImportantTypeLists[item]}，`
                 }
              })
            })
           
            return importVal.substring(0,importVal.length-1)
            
          }else{
            return "-"
          }
        },
        width: 150,
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        render: (text, record) => {
          return text ? text : "-"
        },
        width: 200,
      },
      {
        title: '监测点',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 220,
        align: 'left',
      },
      {
        title: '是否参与企业排放量计算',
        dataIndex: 'IsStatisti',
        key: 'IsStatisti',
        render: (text, record) => {
          if (text !== undefined) {
            return text == 0 ? "否" : "是"
          }
          return "-"
        },
        width: 200,
      },
      {
        title: `时间（${beginTime}至${endTime}）`,
        width: 1300,
        children: [
          {
            title: '排放量（kg）',
            width: 560,
            children: [
              {
                title: 'COD',
                dataIndex: 'CODEmissionsValue',
                key: 'CODEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '氨氮',
                dataIndex: 'AndanEmissionsValue',
                key: 'AndanEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总磷',
                dataIndex: 'ZonglinEmissionsValue',
                key: 'ZonglinEmissionsValue',
                width: 140,
                align: 'center',
              },
              {
                title: '总氮',
                dataIndex: 'ZongdanEmissionsValue',
                key: 'ZongdanEmissionsValue',
                width: 140,
                align: 'center',
              },
            ]
          },
          {
            title: '平均浓度（mg/L）',
            width: 560,
            children: [
              {
                title: 'COD',
                dataIndex: 'CODAVGValue',
                key: 'CODAVGValue',
                width: 140,
                align: 'center',
                render: (text, record) => {
                  return text ? text : "-"
                }
              },
              {
                title: '氨氮',
                dataIndex: 'AndanAVGValue',
                key: 'AndanAVGValue',
                width: 140,
                align: 'center',
                render: (text, record) => {
                  return text ? text : "-"
                }
              },
              {
                title: '总磷',
                dataIndex: 'ZonglinAVGValue',
                key: 'ZonglinAVGValue',
                width: 140,
                align: 'center',
                render: (text, record) => {
                  return text ? text : "-"
                }
              },
              {
                title: '总氮',
                dataIndex: 'ZongdanAVGValue',
                key: 'ZongdanAVGValue',
                width: 140,
                align: 'center',
                render: (text, record) => {
                  return text ? text : "-"
                }
              },
            ]
          },
          {
            title: '流量（吨）',
            dataIndex: 'FlowValue',
            key: 'FlowValue',
            align: 'center',
            width: 180,
          },
        ]
      },
      {
        title: '生产天数',
        dataIndex: 'CountDay',
        key: 'CountDay',
        width: 140,
      },
    ]
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 10 }}>
            <Row>
              <FormItem label={<span style={{ ..._style }}>行政区</span>}>
                {getFieldDecorator('RegionCode', {
                })(
                  // <Select style={{ width: 200 }} allowClear placeholder="请选择行政区">
                  //   {
                  //     _regionList.map(item => {
                  //       return <Option key={item.key} value={item.value}>
                  //         {item.title}
                  //       </Option>
                  //     })
                  //   }
                  // </Select>,
                  <RegionList changeRegion={''} RegionCode={''}/>
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>关注程度</span>}>
                {getFieldDecorator('AttentionCode', {
                  initialValue: undefined,
                })(
                  <Select allowClear style={{ width: 200 }} placeholder="请选择关注程度">
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
              <FormItem label={<span style={{ ..._style }}>日期查询</span>}>
                <RangePicker_
                  dateValue={time}
                  format="YYYY-MM-DD"
                  callback={(dates, dataType) => this.dateChange(dates, dataType)}
                  allowClear={false}
                />
              </FormItem>
            </Row>
            <Row>
              <FormItem label={<span style={{ ..._style }}>重点类型</span>}>
                {getFieldDecorator('ImportantType', {
                })(
                  <Select allowClear style={{ width: 200 }} placeholder="请选择重点类型">
                    {
                      ImportantTypeList.map(item => {
                        return <Option value={item.value} key={item.value}>{item.text}</Option>
                      })
                    }
                  </Select>
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
                  onClick={this.onExport}
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
            <TabPane tab="师市排放量" key="region">
              <SdlTable loading={regionLoading} pagination={false} align="center" dataSource={regionTableDataSource} columns={RegionColumns} />
            </TabPane>
            <TabPane tab="企业排放量" key="ent">
              <SdlTable loading={entLoading} pagination={false} align="center" dataSource={entTableDataSource} columns={EntColumns} />
            </TabPane>
            <TabPane tab="监测点排放量" key="point">
              <SdlTable loading={pointLoading} pagination={false} align="center" dataSource={pointTableDataSource} columns={PointColumns} />
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default Water;